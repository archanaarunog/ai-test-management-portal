package com.aitestportal.automation.tests;

import com.aitestportal.automation.base.BaseTest;
import com.aitestportal.automation.config.ConfigReader;
import com.aitestportal.automation.constants.Constants;
import com.aitestportal.automation.pages.DashboardPage;
import com.aitestportal.automation.pages.LoginPage;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import static org.junit.jupiter.api.Assertions.assertTrue;

@ExtendWith(BaseTest.class)
class LogoutTest extends BaseTest {

    @Test
    @DisplayName("User can log out and is returned to the login page")
    void shouldLogoutSuccessfully() {
        LoginPage loginPage = new LoginPage(page);
        loginPage.login(ConfigReader.getUsername(), ConfigReader.getPassword());

        DashboardPage dashboardPage = new DashboardPage(page);
        assertTrue(dashboardPage.isDashboardLoaded(), "Dashboard should load before attempting logout");

        dashboardPage.logout();

        page.waitForURL(Constants.LOGIN_URL_FRAGMENT);
        assertTrue(loginPage.isLoginFormVisible(), "Login form should be visible again after logout");
    }
}
