# Self-Healing Locator Roadmap

## Purpose

Self-healing lets an automation test keep working when a UI element's locator changes, provided the replacement can be identified safely. The framework should preserve the original test's intent, explain its choice, and stop for review when it cannot identify one clear replacement.

The controlled regression in this repository changes the sign-in button's ID:

```text
Original test locator:  #login-submit-button
Current DOM ID:         #login-submit
```

The original test is intentionally left using its original selector. The framework has to recognize the current sign-in button from metadata that was saved for the original control.

## Status at a glance

| Version | Status | Summary |
|---|---|---|
| V1: selector-derived fallback | Completed as an initial experiment; superseded by V2 | Builds a small list of XPath/CSS fallbacks from the failed selector and returns the first unique match. |
| V2: fingerprint-based recovery | Implemented; limited rollout | Scores current DOM candidates against a saved element fingerprint and rejects low-confidence or ambiguous matches. The sign-in button is the only application page object currently integrated. |
| V3: adaptive, history-aware recovery | Proposed; not implemented | Builds on V2 with reusable contracts, approved healing history, verified retries, calibrated confidence, and richer reporting. |

V2 is deterministic local code. Despite an earlier commit title describing the feature as AI-assisted, this implementation makes no model or network calls.

---

## V1 — Selector-derived fallback recovery

### What V1 did

V1 accepted a selector string and first checked whether the original selector matched anything. If it did not, it derived fallback selectors from the original selector text:

1. For an ID selector such as `#login-submit-button`, split the ID into tokens.
2. Build an XPath expression looking for those tokens in an element's `id`, `name`, or `data-testid` attributes.
3. For IDs containing words such as `submit` or `login`, add generic fallbacks such as `button[type='submit']`, `[data-testid*='submit']`, and `[aria-label*='Sign']`.
4. Return the first fallback whose locator matches exactly one element. Throw if none matches.

The V1 implementation is preserved in the repository history at commit `eac599c` (`Implement AI-assisted self-healing locator recovery`).

### V1 advantages

- **Small API:** callers only supplied the failed selector.
- **No runtime service:** recovery ran locally and required no model, network, or external credentials.
- **Fast original path:** if the original selector still matched, it returned immediately.
- **Basic uniqueness check:** it did not return a fallback when that fallback matched multiple elements.
- **Easy to understand:** the fallback rules were explicit and easy to inspect in logs and code.

### V1 drawbacks

- **It inferred identity from the selector text.** It did not know the original element's visible text, role, type, label, placeholder, class tokens, or parent context.
- **It only handled a narrow selector shape.** Its candidate-generation logic was centered on ID selectors. Other selector styles had little or no recovery support.
- **It used broad fallbacks.** A page can have multiple submit buttons, or a different button whose accessible name contains “Sign”. A uniqueness check helps, but a unique match can still be the wrong control.
- **It selected the first unique fallback.** It did not compare all candidates, rank them, calculate confidence, or detect a close competing candidate.
- **It did not check intent or actionability.** It did not establish that the replacement was the same kind of element, visible, enabled, or suitable for the action the test intended.
- **It had no reviewable result.** It returned a `Locator` or threw an exception, without candidate scores, a reason, or a structured status for reporting.
- **It could not safely recover when selector words were uninformative.** If an ID changed completely, its generated token search could find nothing useful.

### V1 verdict

V1 proved that local fallback recovery could be wired into a Playwright page object. It was a useful proof of concept, but its selector-string heuristics did not provide enough evidence to trust automatic selection on a real page. V2 replaces those heuristics with comparison against the original element's metadata.

---

## V2 — Fingerprint-based, confidence-gated recovery

### What changed from V1

V2 no longer guesses replacement selectors from words in the failed selector. It compares a saved fingerprint of the original element against fingerprints captured from current interactive DOM candidates.

| Concern | V1 | V2 |
|---|---|---|
| Evidence used | Tokens in the failed selector and generic fallbacks | Original and candidate element metadata |
| Candidate choice | First unique selector match | Score and rank all discovered candidates |
| Confidence | None | Weighted score with high and medium thresholds |
| Ambiguity | Only rejects a fallback that matches multiple elements | Rejects multiple eligible candidates and close actionable competitors |
| Action checks | None | Supports `CLICK` and `FILL` compatibility checks; checks visibility and enabled state |
| Result | Locator or exception | Structured `ORIGINAL_FOUND`, `HEALED`, or `REJECTED` result with ranking and reason |
| Runtime dependency | None | None; deterministic local Java code |

### V2 recovery flow

```text
Original selector and saved fingerprint
                 ↓
       Does original selector match?
          ↙                 ↘
        yes                  no
 Return original       Discover interactive DOM candidates
 locator                         ↓
                    Capture candidate fingerprints
                                 ↓
                    Compare and rank each candidate
                                 ↓
                    Apply confidence/actionability gates
                         ↙                 ↘
                 One clear match       Low score or ambiguity
                       ↓                       ↓
                 Return Locator             Reject with reason
```

V2 returns the selected Playwright `Locator`; the caller performs the interaction. It does not itself replay a failed `click()` or `fill()` operation.

### Fingerprint fields

The current `ElementFingerprint` captures or accepts these fields:

- Tag name
- Visible text or accessible label text
- Role and input type
- `aria-label`
- ID and name
- Placeholder
- `data-testid`
- Class tokens
- Parent element context

The DOM capture intentionally does not read input values, so typed passwords and other input contents are not used as identity data. The selector logging helper also redacts selectors that appear to contain email/password/value data.

### Ranking and safety gates

The default `HealingConfig` weights are:

| Attribute | Weight |
|---|---:|
| Tag | 0.15 |
| Text | 0.20 |
| Role | 0.10 |
| Type | 0.10 |
| ARIA label | 0.10 |
| ID | 0.10 |
| Name | 0.05 |
| Placeholder | 0.05 |
| Test ID | 0.05 |
| Classes | 0.05 |
| Parent context | 0.05 |

Exact fields use normalized equality; text-like fields use normalized edit-distance similarity; class and parent fields use token overlap. Missing attributes contribute zero and the weights are not renormalized, so an incomplete fingerprint cannot gain an artificially high score.

The default automatic recovery threshold is **0.85**. **0.70** is the medium-confidence boundary used in the explanation shown for rejected candidates; it is not an automatic-healing threshold. A recovered candidate must also be visible, compatible with the requested action, and enabled when the action is `CLICK` or `FILL`. Multiple qualifying candidates are rejected. A close actionable competitor within the configured 0.05 score margin also makes the result ambiguous and causes rejection.

### V2 implementation in this repository

- `ElementFingerprint` stores a value-free attribute snapshot and can capture one from a Playwright locator.
- `HealingAction` identifies the intended action as `NONE`, `CLICK`, or `FILL`.
- `HealingConfig` holds immutable weights and confidence thresholds.
- `HealingResult` exposes status, selected candidate, score, candidate ranking, reason, and execution time.
- `HealingEngine` retains `heal(String)` as a compatibility entry point and adds fingerprint/action-aware healing and structured-result methods.
- The sign-in page object supplies a baseline fingerprint for the original `#login-submit-button` and requests a `CLICK`-compatible result. The app's current button ID is `login-submit`.
- `SelfHealingV2Test` exercises original locator success, changed attributes, text normalization, unique ranking, low confidence, hidden/disabled elements, no candidates, and ambiguity.

### V2 advantages

- Uses evidence about the element rather than only words in a selector.
- Gives repeatable, explainable scores and rejection reasons.
- Refuses to pick when confidence is insufficient or candidates are ambiguous.
- Checks that the candidate can fulfill the intended click/fill action.
- Keeps the behavior local and deterministic, which makes regression fixtures reproducible.
- Exposes a structured result that can be connected to reports and review workflows.

### V2 disadvantages and risks

- **Fingerprint setup is manual and easy to get wrong.** Recovery after a locator breaks requires a saved fingerprint. The current sign-in page object hard-codes that contract, and the compatibility overload `heal(selector)` cannot recover a missing selector without one.
- **V2 is stateless.** Each call scores the current page from scratch. It does not remember a previously approved replacement, identify recurring UI changes, or learn from past false positives and successful heals.
- **The scoring model is fixed.** One set of weights and thresholds is applied to all controls. A button, search field, and navigation link may need different evidence, and the current confidence score has not been calibrated as a probability.
- **Similar attributes can inflate similarity.** Common classes, repeated labels, generic roles, or shared parent containers can make unrelated elements look alike. The weighted score does not model dependencies between attributes.
- **DOM discovery is incomplete.** V2 searches common interactive elements in the current page. Custom widgets and controls inside frames or shadow roots may not be discovered through this selector.
- **Action semantics are basic.** The engine distinguishes `CLICK` and `FILL`, and checks visibility, enabled state, and some compatibility. It does not yet model the full range of user actions or the expected result of an action.
- **Selection and execution are separate.** The engine returns a locator; callers perform the interaction. The DOM could change between candidate selection and the click/fill, and the engine does not retry the interaction or verify its postcondition.
- **The original locator path has limited health checks.** If the original selector matches, V2 returns it directly. It does not establish that the matched element is unique, visible, enabled, or still semantically correct before returning it.
- **Diagnostics are not durable.** Candidate details and timings are emitted to the console and held in a structured result, but there is no persistent healing history or first-class Allure recovery view yet.
- **Validation scope is narrow.** Fixture tests cover controlled examples, but there is no broad benchmark of correct healing versus plausible wrong matches across real components, browsers, and application states.
- **Rollout is limited to one page object.** Other page objects do not yet use V2, so its behavior and integration costs have not been proven across the framework.

### V2 completion assessment

The V2 recovery engine and controlled regression suite are implemented. V2 should be treated as a limited experiment, not as a framework-wide completed feature, until the baseline capture, interaction wrapper, reporting, and broader integration work below is finished and verified.

---

## Bridge work — finish the V2 rollout

These tasks close the integration gaps before V3 is designed around wider use.

### Priority 1: make fingerprints maintainable

- Provide one page-object API that declares the original selector, expected fingerprint, and intended action together.
- Capture fingerprints from a known-good UI or explicit page-object contract, rather than requiring each application page object to manually assemble a map inline.
- Keep fingerprints value-free and review how dynamic text, generated IDs, localization, and frequently changing class names affect scoring.

### Priority 2: make interactions consistent

- Add shared `click` and `fill` helpers that use the declared fingerprint and action.
- Keep normal locator use fast; invoke recovery only when the original selector is absent or fails under the helper's documented policy.
- Perform the requested action only after recovery succeeds. Surface a clear failure when recovery is rejected; do not silently select a low-confidence candidate.
- Add compatibility rules for more interaction types only when those rules can be checked safely.

### Priority 3: improve review and reporting

- Attach original selector, selected candidate description, confidence, ranking, action, outcome, reason, and execution time to Allure.
- Avoid logging typed values or sensitive attribute contents.
- Preserve the original selector and report the recovery separately so maintainers can update stale page-object contracts intentionally.
- Track recovery and rejection counts so teams can distinguish a healed test from a clean test run.

### Priority 4: validate before expanding automatic healing

- Add fixtures for role/name changes, nested controls, custom widgets, dynamic duplicate controls, stale/hidden controls, and candidates with similar labels.
- Add tests proving that `FILL` never selects a non-editable element and that click/fill action compatibility is enforced.
- Evaluate thresholds against both correct replacements and plausible-but-wrong controls; tune only with observed evidence.
- Run the app regression with the backend and frontend available, then review the Allure result. Keep fixture-level tests separate from end-to-end portal tests.
- Expand from the sign-in button to other page objects only after each addition has a known-good fingerprint and controlled break/recovery case.

## Acceptance criteria for calling V2 complete

- [ ] Page objects can declare original locator contracts without hand-building a fingerprint in each constructor.
- [ ] Shared interaction helpers consistently handle original success, recovery success, and rejection.
- [ ] A rejected or ambiguous recovery never performs the requested action.
- [ ] Allure clearly reports healed and rejected attempts without sensitive values.
- [ ] Controlled fixtures cover supported actions, confidence gates, ambiguity, visibility, enabled state, and missing metadata.
- [ ] The controlled ID-break regression passes with both frontend and backend running.
- [ ] More than the login page uses the common recovery API, or the project explicitly scopes V2 to login only.
- [ ] The run guide documents prerequisites, both application services, test commands, and Allure viewing.

---

## V3 introduction — adaptive, history-aware, verified recovery

**V3 is a proposed direction, not code that exists in this repository today.** It advances V2 from a per-call candidate scorer into a controlled recovery workflow that can use approved history, verify the intended action, and provide maintainers with useful evidence. V3 should preserve V2's conservative rejection behavior: richer intelligence must not mean silently clicking a merely plausible element.

### How V3 advances V2

| Capability | V2 today | V3 proposal |
|---|---|---|
| Element contract | Manually supplied fingerprint for the integrated sign-in button | Reusable locator contract declared once in a page object or shared registry |
| Candidate evidence | Static weighted DOM attributes | Layered semantic, structural, state, and optionally visual evidence, selected by control/action type |
| Learning from previous runs | None; each call is independent | Versioned history of approved heals, rejected candidates, and outcomes, scoped to page/component and environment |
| Confidence | Fixed heuristic weights and thresholds | Calibrated thresholds per action/control class using labeled fixtures and reviewed outcomes |
| Interaction | Returns a candidate locator | Executes through a guarded helper, retries at most once, and checks the caller's postcondition |
| Review trail | Console logs and in-memory result | Durable Allure details and a proposed locator change that maintainers can accept or reject |
| Ambiguous cases | Rejects | Rejects automatic action; may provide ranked suggestions and evidence for human review |

### Proposed V3 flow

```text
Declared locator contract and intended action
                   ↓
Check original locator and page state
                   ↓
Generate candidates from current DOM
                   ↓
Score with action-specific evidence and approved history
                   ↓
Confidence and ambiguity gates
          ↙                         ↘
   Clear approved match           Uncertain/ambiguous
          ↓                              ↓
Perform action once             Do not act; report suggestions
          ↓                              ↓
Verify expected outcome          Human review / locator update
          ↓
Record outcome and evidence
```

### Proposed V3 capabilities

1. **Reusable locator contracts.** A page object declares the original selector, fingerprint or semantic attributes, action type, and expected postcondition together. This removes repeated hand-built fingerprints from constructors.
2. **Action-specific candidate evaluation.** A button click can prioritize role, accessible name, form context, and enabled state; a field fill can prioritize label, input type, placeholder, and editability. Candidate discovery can include frame/shadow-root handling where Playwright support and scope are explicit.
3. **Approved healing memory.** Store reviewed replacement mappings with the page/component identity, old and new fingerprints, environment/version, approval status, and last-seen result. Reuse an approved mapping only while its evidence still matches; expire or re-review stale mappings.
4. **Calibrated confidence and feedback.** Measure correct selections and false matches against labeled fixtures and reviewed production-like runs. Tune thresholds by action/control class. Treat history as supporting evidence, not as permission to ignore a changed or ambiguous page.
5. **Guarded execution and verification.** A common helper performs the requested operation only after the candidate passes the gates, retries no more than once, and checks an explicit expected outcome. If the outcome fails, stop and report the test failure; do not keep trying other elements.
6. **Optional AI assistance with deterministic boundaries.** If introduced, a model may summarize evidence or suggest/rank candidates when deterministic scoring is uncertain. Its response must be validated against the DOM and confidence gates; it cannot independently perform the action or turn a rejected candidate into an automatic heal.
7. **Durable reporting and maintenance workflow.** Attach original and recovered locators, evidence, score, history match, action, postcondition result, and approval state to Allure. Offer a clear suggested page-object locator update for maintainer review.
8. **Evaluation before rollout.** Maintain a fixture corpus with expected winners and intentionally confusing candidates. Track false-heal rate, rejection rate, successful recovery rate, and added runtime before enabling V3 broadly.

### Proposed V3 Java call

The following is an **illustrative API for the V3 design**, not code that currently compiles in this repository. The `com.archana.framework.selfhealing.v3` types below would need to be implemented. The key API difference from V2 is that a caller provides a locator contract and the intended action to a guarded helper. The helper resolves a candidate, performs at most one action, checks the expected outcome, and returns a structured result.

```java
import com.archana.framework.selfhealing.HealingAction;
import com.archana.framework.selfhealing.v3.HealingModelClient;
import com.archana.framework.selfhealing.v3.HealingOutcome;
import com.archana.framework.selfhealing.v3.LocatorContract;
import com.archana.framework.selfhealing.v3.SelfHealingPage;
import com.microsoft.playwright.Page;

// The model client is injected. Its provider-specific implementation is kept
// outside the page object and can be replaced by a test stub.
HealingModelClient modelClient = healingModelGateway;
SelfHealingPage selfHealing = new SelfHealingPage(page, modelClient);

LocatorContract signIn = LocatorContract.builder("#login-submit-button")
        .tag("button")
        .text("Sign in")
        .role("button")
        .type("submit")
        .ariaLabel("Sign in")
        .testId("login-submit-button")
        .parent("form#login-form")
        .action(HealingAction.CLICK)
        .build();

HealingOutcome outcome = selfHealing.click(
        signIn,
        () -> page.getByTestId("dashboard-page").waitFor());

if (!outcome.succeeded()) {
    throw new AssertionError("Sign-in action failed: " + outcome.reason());
}
```

In this proposed shape, `click` returns only after the original locator or an approved recovered locator has been clicked and the supplied postcondition has been checked. If candidate selection is rejected, the helper does not click. If the click does not produce the expected dashboard state, it reports failure rather than trying a sequence of other candidates.

### Proposed model request

The V3 service first discovers DOM candidates locally, removes sensitive fields, and sends a bounded JSON request. Candidate IDs are generated for this request; the model can choose only among these IDs or abstain. Do not send the full page HTML, input values, passwords, cookies, authorization tokens, or arbitrary browser storage.

```json
{
  "schemaVersion": "1",
  "task": "rank_locator_candidates",
  "action": "CLICK",
  "expectedOutcome": "The dashboard page becomes visible after sign-in.",
  "original": {
    "selector": "#login-submit-button",
    "tag": "button",
    "role": "button",
    "text": "Sign in",
    "type": "submit",
    "ariaLabel": "Sign in",
    "testId": "login-submit-button",
    "parent": "form#login-form"
  },
  "candidates": [
    {
      "candidateId": "candidate-1",
      "tag": "button",
      "role": "button",
      "text": "Sign in",
      "type": "submit",
      "ariaLabel": "Sign in",
      "id": "login-submit",
      "testId": "login-submit-button",
      "visible": true,
      "enabled": true,
      "parent": "form#login-form"
    },
    {
      "candidateId": "candidate-2",
      "tag": "button",
      "role": "button",
      "text": "Forgot password?",
      "visible": true,
      "enabled": true,
      "parent": "form#login-form"
    }
  ]
}
```

The request should be size-limited, schema-versioned, and generated from sanitized snapshots. The expected outcome is a short task description; local code, not the model, evaluates the actual postcondition after the click.

### Proposed model response

The model returns a constrained decision, not a CSS/XPath selector and not an instruction to click. For example:

```json
{
  "schemaVersion": "1",
  "decision": "SELECT",
  "candidateId": "candidate-1",
  "alternatives": ["candidate-2"],
  "reason": "The candidate matches the button role, submit type, accessible name, test ID, and form context.",
  "suggestedConfidence": 0.97
}
```

The V3 adapter validates the response before using it:

1. Parse it against the expected schema; reject malformed or extra action fields.
2. Confirm `candidateId` is one of the IDs in the request and is compatible with the requested action.
3. Treat `suggestedConfidence` as model output for diagnostics only. It is not proof and cannot bypass locally calibrated thresholds, visibility/enabled checks, ambiguity rules, or policy.
4. Require the deterministic safety gate to independently approve the candidate. `ABSTAIN`, an unknown candidate ID, timeout, invalid output, or a failed gate means no action is taken.
5. After the helper performs at most one action, verify the actual postcondition locally and return that outcome to the test and Allure.

An abstention response can be as small as:

```json
{
  "schemaVersion": "1",
  "decision": "ABSTAIN",
  "candidateId": null,
  "alternatives": [],
  "reason": "Two visible submit buttons have similar evidence.",
  "suggestedConfidence": 0.48
}
```

### Proposed V3 outcome returned to the test

The helper should return a typed result that distinguishes a normal locator match from a recovered match and a rejection. For a successful recovered sign-in, the conceptual result could look like this:

```json
{
  "status": "HEALED_AND_VERIFIED",
  "originalSelector": "#login-submit-button",
  "selectedCandidate": "button#login-submit[data-testid='login-submit-button']",
  "selectionSource": "MODEL_SUGGESTION_AND_LOCAL_POLICY",
  "localScore": 0.94,
  "action": "CLICK",
  "attempts": 1,
  "postcondition": "PASSED",
  "reason": "Unique compatible candidate passed the local confidence gate; dashboard page became visible."
}
```

These status names and fields are proposed. The model response is retained as supporting evidence, while the final outcome is created by the Java framework after local validation and action verification. A failed or uncertain result should include the reason and ranked candidate summaries but no sensitive input values.

### Why V3 is more advanced

V3 is more advanced because it combines recognition, controlled action, outcome verification, and learning from reviewed history. V2 answers, “Which current element resembles the saved fingerprint?” V3 aims to answer, “Is this replacement still trustworthy for this action, has a maintainer approved similar evidence, did the action produce the expected result, and can the decision be audited?”

The central safeguard remains conservative behavior: uncertain evidence produces a failure with useful suggestions, not a guessed interaction. Any use of AI is an optional aid around evidence analysis; the decision to act stays governed by explicit validation rules and measurable thresholds.

### V3 acceptance criteria

- [ ] Locator contracts and action/postcondition declarations are reusable and do not require ad hoc constructor code.
- [ ] Healing history is versioned, reviewable, scoped, and expires or requests review when its evidence becomes stale.
- [ ] Candidate scores are calibrated against a labeled evaluation corpus, with false-heal rate reported.
- [ ] The guarded helper performs at most one recovered interaction and verifies an explicit postcondition.
- [ ] Ambiguous, low-confidence, stale-history, or failed-postcondition outcomes never trigger repeated guessing.
- [ ] Allure includes enough privacy-safe evidence to review and reproduce a healing decision.
- [ ] Any AI-assisted output is constrained by the same DOM compatibility, confidence, and ambiguity gates as deterministic scoring.
- [ ] V3 rollout is enabled per page/component only after its evaluation results meet agreed quality thresholds.
