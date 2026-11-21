package com.archana.framework.selfhealing;

import java.util.*;

/**
 * Immutable deterministic V2 weights and confidence thresholds.
 * Missing fingerprint attributes contribute zero; weights are not renormalized,
 * so incomplete metadata cannot inflate a candidate's confidence.
 */
public final class HealingConfig {
    public static final Map<String, Double> DEFAULT_WEIGHTS;
    static {
        Map<String, Double> w = new LinkedHashMap<>();
        w.put("tag", .15); w.put("text", .20); w.put("role", .10); w.put("type", .10);
        w.put("ariaLabel", .10); w.put("id", .10); w.put("name", .05); w.put("placeholder", .05);
        w.put("testId", .05); w.put("classes", .05); w.put("parent", .05);
        DEFAULT_WEIGHTS = Collections.unmodifiableMap(w);
    }
    private final Map<String, Double> weights;
    private final double highThreshold, mediumThreshold, ambiguityMargin;

    public HealingConfig() { this(DEFAULT_WEIGHTS, .85, .70, .05); }
    public HealingConfig(Map<String, Double> weights, double high, double medium, double margin) {
        if (weights == null || !weights.keySet().equals(DEFAULT_WEIGHTS.keySet())) throw new IllegalArgumentException("Weights must define all V2 attributes");
        double total = weights.values().stream().mapToDouble(Double::doubleValue).sum();
        if (Math.abs(total - 1.0) > .000001 || high < medium || medium < 0 || high > 1 || margin < 0) throw new IllegalArgumentException("Invalid V2 weights or thresholds");
        this.weights = Collections.unmodifiableMap(new LinkedHashMap<>(weights));
        this.highThreshold = high; this.mediumThreshold = medium; this.ambiguityMargin = margin;
    }
    public Map<String, Double> weights() { return weights; }
    public double highThreshold() { return highThreshold; }
    public double mediumThreshold() { return mediumThreshold; }
    public double ambiguityMargin() { return ambiguityMargin; }
}
