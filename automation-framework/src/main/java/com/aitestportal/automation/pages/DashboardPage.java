package com.aitestportal.automation.pages;

import com.aitestportal.automation.constants.Constants;
import com.microsoft.playwright.Page;

public class DashboardPage extends BasePage {

    public DashboardPage(Page page) {
        super(page);
    }

    public boolean isDashboardLoaded() {
        page.waitForURL(Constants.DASHBOARD_URL_FRAGMENT);
        waitForVisible(Constants.DASHBOARD_PAGE);
        return isVisible(Constants.DASHBOARD_PAGE);
    }

    public boolean areSummaryCardsVisible() {
        return isVisible(Constants.SUMMARY_CARDS);
    }

    public void logout() {
        click(Constants.USER_PROFILE_DROPDOWN_TRIGGER);
        click(Constants.LOGOUT_MENU_ITEM);
    }
}
