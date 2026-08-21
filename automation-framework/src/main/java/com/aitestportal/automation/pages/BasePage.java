package com.aitestportal.automation.pages;

import com.microsoft.playwright.Locator;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.options.WaitForSelectorState;

/**
 * Common helpers for every page object. All locators go through data-testid,
 * matching the stable attributes the application exposes for automation.
 */
public abstract class BasePage {

    protected final Page page;

    protected BasePage(Page page) {
        this.page = page;
    }

    protected Locator byTestId(String testId) {
        return page.locator("[data-testid='" + testId + "']");
    }

    protected void click(String testId) {
        byTestId(testId).click();
    }

    protected void fill(String testId, String value) {
        byTestId(testId).fill(value);
    }

    protected boolean isVisible(String testId) {
        return byTestId(testId).isVisible();
    }

    protected void waitForVisible(String testId) {
        byTestId(testId).waitFor(new Locator.WaitForOptions()
                .setState(WaitForSelectorState.VISIBLE));
    }
}
