package com.aitestportal.automation.tests;

import com.aitestportal.automation.base.BaseTest;
import com.aitestportal.automation.config.ConfigReader;
import com.aitestportal.automation.pages.DashboardPage;
import com.aitestportal.automation.pages.LoginPage;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import static org.junit.jupiter.api.Assertions.assertTrue;

@ExtendWith(BaseTest.class)
class DashboardTest extends BaseTest {

    @Test
    @DisplayName("Dashboard loads with summary cards after login")
    void shouldDisplayDashboardSummaryCards() {
        LoginPage loginPage = new LoginPage(page);
        loginPage.login(ConfigReader.getUsername(), ConfigReader.getPassword());

        DashboardPage dashboardPage = new DashboardPage(page);
        assertTrue(dashboardPage.isDashboardLoaded(), "Dashboard page should be visible");
        assertTrue(dashboardPage.areSummaryCardsVisible(), "Summary cards should be visible on the dashboard");
    }
}
