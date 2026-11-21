package com.archana.framework.selfhealing;

import com.microsoft.playwright.Locator;
import java.util.*;

/** Explainable outcome, including every discovered candidate's attribute similarities. */
public final class HealingResult {
    public enum Status { ORIGINAL_FOUND, HEALED, REJECTED }
    public static final class Candidate {
        private final Locator locator;
        private final String selector;
        private final ElementFingerprint fingerprint;
        private final Map<String, Double> similarities;
        private final double score;
        private final int rank;
        private final boolean visible, enabled, compatible;
        Candidate(Locator locator, String selector, ElementFingerprint fingerprint, Map<String, Double> similarities,
                  double score, int rank, boolean visible, boolean enabled, boolean compatible) {
            this.locator=locator; this.selector=selector; this.fingerprint=fingerprint;
            this.similarities=Collections.unmodifiableMap(new LinkedHashMap<>(similarities)); this.score=score;
            this.rank=rank; this.visible=visible; this.enabled=enabled; this.compatible=compatible;
        }
        public Locator locator() { return locator; }
        public String selector() { return selector; }
        public ElementFingerprint fingerprint() { return fingerprint; }
        public Map<String, Double> similarities() { return similarities; }
        public double score() { return score; }
        public int rank() { return rank; }
        public boolean visible() { return visible; }
        public boolean enabled() { return enabled; }
        public boolean compatible() { return compatible; }
    }
    private final String originalLocator, reason;
    private final ElementFingerprint originalFingerprint;
    private final Candidate selected;
    private final List<Candidate> ranking;
    private final Status status;
    private final long executionTimeMillis;
    HealingResult(String originalLocator, ElementFingerprint originalFingerprint, Candidate selected,
                  List<Candidate> ranking, Status status, String reason) {
        this(originalLocator, originalFingerprint, selected, ranking, status, reason, 0);
    }
    private HealingResult(String originalLocator, ElementFingerprint originalFingerprint, Candidate selected,
                  List<Candidate> ranking, Status status, String reason, long executionTimeMillis) {
        this.originalLocator=originalLocator; this.originalFingerprint=originalFingerprint; this.selected=selected;
        this.ranking=List.copyOf(ranking); this.status=status; this.reason=reason; this.executionTimeMillis=executionTimeMillis;
    }
    public String originalLocator() { return originalLocator; }
    public ElementFingerprint originalFingerprint() { return originalFingerprint; }
    public ElementFingerprint selectedFingerprint() { return selected == null ? null : selected.fingerprint(); }
    public Locator recoveredLocator() { return selected == null ? null : selected.locator(); }
    public Candidate selectedCandidate() { return selected; }
    public List<Candidate> ranking() { return ranking; }
    public int candidateCount() { return ranking.size(); }
    public double confidence() { return selected == null ? (ranking.isEmpty() ? 0 : ranking.get(0).score()) : selected.score(); }
    public Status status() { return status; }
    public String reason() { return reason; }
    public long executionTimeMillis() { return executionTimeMillis; }
    HealingResult withExecutionTimeMillis(long duration) { return new HealingResult(originalLocator, originalFingerprint, selected, ranking, status, reason, duration); }
}
