package com.archana.framework.selfhealing;

import com.microsoft.playwright.Locator;
import com.microsoft.playwright.Page;

import java.util.ArrayList;
import java.util.List;

public class HealingEngine {

    private final Page page;

    public HealingEngine(Page page) {
        this.page = page;
    }

    public Locator heal(String originalSelector) {

        Locator original = page.locator(originalSelector);

        // Original locator still works
        if (original.count() > 0) {
            return original;
        }

        System.out.println(
                "[SELF-HEALING] Original locator failed: " + originalSelector
        );

        List<String> candidates = generateCandidates(originalSelector);

        for (String candidate : candidates) {

            Locator locator = page.locator(candidate);

            if (locator.count() == 1) {

                System.out.println(
                        "[SELF-HEALING] Healed: "
                                + originalSelector
                                + " -> "
                                + candidate
                );

                return locator;
            }
        }

        throw new RuntimeException(
                "[SELF-HEALING] Unable to heal locator: "
                        + originalSelector
        );
    }

    private List<String> generateCandidates(String originalSelector) {

        List<String> candidates = new ArrayList<>();

        if (originalSelector.startsWith("#")) {

            String id = originalSelector.substring(1);

            // Look for elements whose attributes contain parts
            // of the original ID.
            String[] parts = id.split("-");

            StringBuilder xpath = new StringBuilder(
                    "//*["
            );

            boolean first = true;

            for (String part : parts) {

                if (part.length() < 3) {
                    continue;
                }

                if (!first) {
                    xpath.append(" or ");
                }

                xpath.append("contains(@id,'")
                        .append(part)
                        .append("')");

                xpath.append(" or contains(@name,'")
                        .append(part)
                        .append("')");

                xpath.append(" or contains(@data-testid,'")
                        .append(part)
                        .append("')");

                first = false;
            }

            xpath.append("]");

            if (!first) {
                candidates.add(xpath.toString());
            }

            // Common fallback for buttons
            if (id.toLowerCase().contains("submit")
                    || id.toLowerCase().contains("login")) {

                candidates.add(
                        "button[type='submit']"
                );

                candidates.add(
                        "[data-testid*='submit']"
                );

                candidates.add(
                        "[aria-label*='Sign']"
                );
            }
        }

        return candidates;
    }
}