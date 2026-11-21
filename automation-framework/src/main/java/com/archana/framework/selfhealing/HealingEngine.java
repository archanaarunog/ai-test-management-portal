package com.archana.framework.selfhealing;

import com.microsoft.playwright.Locator;
import com.microsoft.playwright.Page;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.regex.Pattern;

/** Local, deterministic V2 locator recovery. No model or network calls are made. */
public class HealingEngine {
    private static final String DISCOVERY_SELECTOR =
            "button,a,input,select,textarea,[role],[contenteditable='true'],[tabindex]";
    private static final Pattern NON_ALPHANUMERIC =
            Pattern.compile("[^\\p{Alnum}]+", Pattern.UNICODE_CHARACTER_CLASS);

    private final Page page;
    private final HealingConfig config;

    public HealingEngine(Page page) {
        this(page, new HealingConfig());
    }

    public HealingEngine(Page page, HealingConfig config) {
        this.page = Objects.requireNonNull(page);
        this.config = Objects.requireNonNull(config);
    }

    /** Backwards-compatible entry point. Recovery needs a fingerprint saved before a locator changes. */
    public Locator heal(String selector) {
        return heal(selector, null, HealingAction.NONE);
    }

    public Locator heal(String selector, ElementFingerprint fingerprint, HealingAction action) {
        HealingResult result = healWithResult(selector, fingerprint, action);
        if (result.status() == HealingResult.Status.REJECTED) {
            throw new IllegalStateException("[SELF-HEALING V2] " + result.reason());
        }
        return result.recoveredLocator();
    }

    public HealingResult healWithResult(
            String selector, ElementFingerprint originalFingerprint, HealingAction action) {
        long startedAt = System.nanoTime();
        HealingResult result = healInternal(selector, originalFingerprint, action);
        long elapsedMillis = (System.nanoTime() - startedAt) / 1_000_000;
        System.out.printf(Locale.ROOT, "[SELF-HEALING V2] Execution time: %d ms%n", elapsedMillis);
        return result.withExecutionTimeMillis(elapsedMillis);
    }

    private HealingResult healInternal(
            String selector, ElementFingerprint originalFingerprint, HealingAction action) {
        Objects.requireNonNull(selector, "originalSelector");
        HealingAction requestedAction = action == null ? HealingAction.NONE : action;
        Locator originalLocator = page.locator(selector);
        String loggedSelector = safeSelector(selector);

        if (originalLocator.count() > 0) {
            ElementFingerprint fingerprint = originalFingerprint;
            try {
                if (fingerprint == null) {
                    fingerprint = ElementFingerprint.capture(originalLocator.first());
                }
            } catch (RuntimeException ignored) {
                // Existing locator remains usable even if optional metadata capture fails.
            }

            System.out.println("[SELF-HEALING V2] Original locator works: " + loggedSelector);
            ElementFingerprint candidateFingerprint = fingerprint == null
                    ? ElementFingerprint.builder().build()
                    : fingerprint;
            HealingResult.Candidate originalCandidate = new HealingResult.Candidate(
                    originalLocator,
                    selector,
                    candidateFingerprint,
                    Map.of(),
                    1.0,
                    1,
                    isVisible(originalLocator.first()),
                    isEnabled(originalLocator.first()),
                    true);
            return new HealingResult(
                    selector,
                    fingerprint,
                    originalCandidate,
                    List.of(originalCandidate),
                    HealingResult.Status.ORIGINAL_FOUND,
                    "Original locator resolved.");
        }

        System.out.println("[SELF-HEALING V2] Original locator failed: " + loggedSelector);
        if (originalFingerprint == null || originalFingerprint.attributes().isEmpty()) {
            return reject(
                    selector,
                    originalFingerprint,
                    List.of(),
                    "Original fingerprint is unavailable; safe recovery requires metadata captured before the locator changed.");
        }

        System.out.println("[SELF-HEALING V2] Candidate discovery started.");
        Locator candidatesLocator = page.locator(DISCOVERY_SELECTOR);
        int discoveredCount = candidatesLocator.count();
        System.out.println("[SELF-HEALING V2] Candidates discovered: " + discoveredCount);

        List<HealingResult.Candidate> candidates = new ArrayList<>();
        for (int index = 0; index < discoveredCount; index++) {
            collectCandidate(
                    candidatesLocator.nth(index),
                    index,
                    originalFingerprint,
                    requestedAction,
                    candidates);
        }

        List<HealingResult.Candidate> rankedCandidates = rankCandidates(candidates);
        if (rankedCandidates.isEmpty()) {
            return reject(selector, originalFingerprint, rankedCandidates,
                    "No suitable candidates were discovered.");
        }
        logRanking(rankedCandidates);

        List<HealingResult.Candidate> eligibleCandidates = rankedCandidates.stream()
                .filter(candidate -> isEligible(candidate, requestedAction))
                .toList();
        if (eligibleCandidates.isEmpty()) {
            return reject(selector, originalFingerprint, rankedCandidates,
                    explainNoEligibleCandidate(rankedCandidates.get(0).score()));
        }
        if (eligibleCandidates.size() != 1) {
            return reject(selector, originalFingerprint, rankedCandidates,
                    "Multiple candidates meet the high-confidence and actionability requirements (ambiguous result).");
        }

        HealingResult.Candidate selected = eligibleCandidates.get(0);
        if (hasCloseActionableCompetitor(rankedCandidates, selected, requestedAction)) {
            return reject(selector, originalFingerprint, rankedCandidates,
                    "Ambiguous result: another actionable candidate is within the configured confidence margin.");
        }

        System.out.printf(
                Locale.ROOT,
                "[SELF-HEALING V2] Healing successful. Confidence: %.2f%%%n",
                selected.score() * 100);
        return new HealingResult(
                selector,
                originalFingerprint,
                selected,
                rankedCandidates,
                HealingResult.Status.HEALED,
                "Unique high-confidence candidate selected.");
    }

    private void collectCandidate(
            Locator locator,
            int domIndex,
            ElementFingerprint original,
            HealingAction action,
            List<HealingResult.Candidate> candidates) {
        try {
            ElementFingerprint fingerprint = ElementFingerprint.capture(locator);
            Map<String, Double> similarities = calculateSimilarities(original, fingerprint);
            double score = config.weights().entrySet().stream()
                    .mapToDouble(entry -> entry.getValue() * similarities.get(entry.getKey()))
                    .sum();
            boolean visible = locator.isVisible();
            boolean enabled = locator.isEnabled();
            boolean compatible = isCompatible(original, fingerprint, action, locator);
            String description = describe(fingerprint, domIndex);

            candidates.add(new HealingResult.Candidate(
                    locator,
                    description,
                    fingerprint,
                    similarities,
                    score,
                    0,
                    visible,
                    enabled,
                    compatible));
            System.out.println("[SELF-HEALING V2] Candidate: " + description);
            similarities.forEach((attribute, similarity) -> System.out.printf(
                    Locale.ROOT,
                    "[SELF-HEALING V2] %s similarity: %.2f%n",
                    attribute,
                    similarity));
            System.out.printf(Locale.ROOT, "[SELF-HEALING V2] Final confidence: %.2f%%%n", score * 100);
        } catch (RuntimeException exception) {
            System.out.println("[SELF-HEALING V2] Rejected unsuitable candidate at DOM position "
                    + domIndex + ": " + exception.getClass().getSimpleName());
        }
    }

    private List<HealingResult.Candidate> rankCandidates(List<HealingResult.Candidate> candidates) {
        candidates.sort(Comparator.comparingDouble(HealingResult.Candidate::score).reversed());
        List<HealingResult.Candidate> ranked = new ArrayList<>();
        for (int index = 0; index < candidates.size(); index++) {
            HealingResult.Candidate candidate = candidates.get(index);
            ranked.add(new HealingResult.Candidate(
                    candidate.locator(),
                    candidate.selector(),
                    candidate.fingerprint(),
                    candidate.similarities(),
                    candidate.score(),
                    index + 1,
                    candidate.visible(),
                    candidate.enabled(),
                    candidate.compatible()));
        }
        return ranked;
    }

    private boolean isEligible(HealingResult.Candidate candidate, HealingAction action) {
        return candidate.score() >= config.highThreshold()
                && candidate.visible()
                && candidate.compatible()
                && (action == HealingAction.NONE || candidate.enabled());
    }

    private boolean hasCloseActionableCompetitor(
            List<HealingResult.Candidate> ranked,
            HealingResult.Candidate selected,
            HealingAction action) {
        return ranked.stream()
                .filter(candidate -> candidate != selected)
                .filter(HealingResult.Candidate::visible)
                .filter(HealingResult.Candidate::compatible)
                .filter(candidate -> action == HealingAction.NONE || candidate.enabled())
                .anyMatch(candidate -> candidate.score()
                        >= selected.score() - config.ambiguityMargin());
    }

    private String explainNoEligibleCandidate(double topScore) {
        if (topScore >= config.highThreshold()) {
            return "No high-confidence candidate satisfies visibility, enabled-state, and action compatibility requirements.";
        }
        if (topScore >= config.mediumThreshold()) {
            return String.format(
                    Locale.ROOT,
                    "Medium confidence %.2f%% is below the %.2f%% automatic-healing threshold; manual review is required.",
                    topScore * 100,
                    config.highThreshold() * 100);
        }
        return String.format(
                Locale.ROOT,
                "Low confidence %.2f%% is below the %.2f%% automatic-healing threshold.",
                topScore * 100,
                config.highThreshold() * 100);
    }

    private void logRanking(List<HealingResult.Candidate> ranked) {
        ranked.forEach(candidate -> System.out.printf(
                Locale.ROOT,
                "[SELF-HEALING V2] Candidate ranking: %d — %s (%.2f%%)%n",
                candidate.rank(),
                candidate.selector(),
                candidate.score() * 100));
    }

    private HealingResult reject(
            String selector,
            ElementFingerprint fingerprint,
            List<HealingResult.Candidate> ranked,
            String reason) {
        System.out.println("[SELF-HEALING V2] Healing rejected: " + reason);
        return new HealingResult(
                selector,
                fingerprint,
                null,
                ranked,
                HealingResult.Status.REJECTED,
                reason);
    }

    private boolean isCompatible(
            ElementFingerprint original,
            ElementFingerprint candidate,
            HealingAction action,
            Locator locator) {
        String tag = candidate.get("tag").toLowerCase(Locale.ROOT);
        String expectedTag = original.get("tag").toLowerCase(Locale.ROOT);
        boolean sameElementType = expectedTag.isBlank()
                || expectedTag.equals(tag)
                || (expectedTag.equals("button")
                    && tag.equals("input")
                    && Set.of("button", "submit").contains(
                            candidate.get("type").toLowerCase(Locale.ROOT)));
        if (!sameElementType) {
            return false;
        }

        if (action == HealingAction.FILL) {
            if (!(tag.equals("input")
                    || tag.equals("textarea")
                    || "true".equalsIgnoreCase(candidate.get("contenteditable")))) {
                return false;
            }
            try {
                return locator.isEditable();
            } catch (RuntimeException exception) {
                return false;
            }
        }
        if (action == HealingAction.CLICK) {
            return Set.of("button", "a", "input", "summary").contains(tag)
                    || !candidate.get("role").isBlank()
                    || "true".equalsIgnoreCase(candidate.get("contenteditable"));
        }
        return true;
    }

    private boolean isVisible(Locator locator) {
        try {
            return locator.isVisible();
        } catch (RuntimeException exception) {
            return false;
        }
    }

    private boolean isEnabled(Locator locator) {
        try {
            return locator.isEnabled();
        } catch (RuntimeException exception) {
            return false;
        }
    }

    private String describe(ElementFingerprint fingerprint, int domIndex) {
        if (!fingerprint.get("id").isBlank()) {
            return safeSelector(fingerprint.get("tag") + "#" + fingerprint.get("id"));
        }
        if (!fingerprint.get("testId").isBlank()) {
            return safeSelector(fingerprint.get("tag")
                    + "[data-testid=\"" + fingerprint.get("testId") + "\"]");
        }
        return fingerprint.get("tag") + " (DOM candidate " + (domIndex + 1) + ")";
    }

    private String safeSelector(String selector) {
        String lowerCase = selector.toLowerCase(Locale.ROOT);
        if (lowerCase.contains("password")
                || lowerCase.contains("email")
                || lowerCase.contains("value=")
                || selector.contains("@")) {
            return "<redacted locator>";
        }
        return selector;
    }

    private Map<String, Double> calculateSimilarities(
            ElementFingerprint original, ElementFingerprint candidate) {
        Map<String, Double> similarities = new LinkedHashMap<>();
        similarities.put("tag", exact(original.get("tag"), candidate.get("tag")));
        similarities.put("text", string(original.get("text"), candidate.get("text")));
        similarities.put("role", exact(original.get("role"), candidate.get("role")));
        similarities.put("type", exact(original.get("type"), candidate.get("type")));
        similarities.put("ariaLabel", string(original.get("ariaLabel"), candidate.get("ariaLabel")));
        similarities.put("id", string(original.get("id"), candidate.get("id")));
        similarities.put("name", string(original.get("name"), candidate.get("name")));
        similarities.put("placeholder", string(original.get("placeholder"), candidate.get("placeholder")));
        similarities.put("testId", string(original.get("testId"), candidate.get("testId")));
        similarities.put("classes", token(original.get("classes"), candidate.get("classes")));
        similarities.put("parent", token(original.get("parent"), candidate.get("parent")));
        return similarities;
    }

    private double exact(String first, String second) {
        String normalizedFirst = normalize(first);
        String normalizedSecond = normalize(second);
        return !normalizedFirst.isEmpty()
                && !normalizedSecond.isEmpty()
                && normalizedFirst.equals(normalizedSecond) ? 1.0 : 0.0;
    }

    private double string(String first, String second) {
        String left = normalize(first);
        String right = normalize(second);
        if (left.isEmpty() || right.isEmpty()) {
            return 0.0;
        }
        if (left.equals(right)) {
            return 1.0;
        }

        int[] previous = new int[right.length() + 1];
        int[] current = new int[right.length() + 1];
        for (int column = 0; column <= right.length(); column++) {
            previous[column] = column;
        }
        for (int row = 1; row <= left.length(); row++) {
            current[0] = row;
            for (int column = 1; column <= right.length(); column++) {
                int substitutionCost = left.charAt(row - 1) == right.charAt(column - 1) ? 0 : 1;
                current[column] = Math.min(
                        Math.min(current[column - 1] + 1, previous[column] + 1),
                        previous[column - 1] + substitutionCost);
            }
            int[] swap = previous;
            previous = current;
            current = swap;
        }
        return 1.0 - (double) previous[right.length()] / Math.max(left.length(), right.length());
    }

    private double token(String first, String second) {
        Set<String> firstTokens = tokens(first);
        Set<String> secondTokens = tokens(second);
        if (firstTokens.isEmpty() || secondTokens.isEmpty()) {
            return 0.0;
        }

        Set<String> union = new HashSet<>(firstTokens);
        union.addAll(secondTokens);
        Set<String> intersection = new HashSet<>(firstTokens);
        intersection.retainAll(secondTokens);
        return (double) intersection.size() / union.size();
    }

    private Set<String> tokens(String value) {
        Set<String> result = new HashSet<>();
        for (String token : normalize(value).split(" ")) {
            if (!token.isBlank()) {
                result.add(token);
            }
        }
        return result;
    }

    private String normalize(String value) {
        return NON_ALPHANUMERIC
                .matcher(value == null ? "" : value.toLowerCase(Locale.ROOT))
                .replaceAll(" ")
                .trim();
    }
}
