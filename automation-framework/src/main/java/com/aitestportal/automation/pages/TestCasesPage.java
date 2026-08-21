package com.aitestportal.automation.pages;

import com.aitestportal.automation.constants.Constants;
import com.microsoft.playwright.Page;

public class TestCasesPage extends BasePage {

    public TestCasesPage(Page page) {
        super(page);
    }

    public void open() {
        click(Constants.SIDEBAR_NAV_TESTS);
        page.waitForURL(Constants.TESTS_URL_FRAGMENT);
    }

    public boolean isTableVisible() {
        waitForVisible(Constants.TESTS_TABLE_CONTAINER);
        return isVisible(Constants.TESTS_TABLE_CONTAINER);
    }

    public int getVisibleRowCount() {
        return page.locator("[data-testid='" + Constants.TESTS_TABLE_BODY + "'] tr[data-testid^='test-row-']").count();
    }
}