package com.aitestportal.automation.tests;

import com.aitestportal.automation.base.BaseTest;
import com.aitestportal.automation.config.ConfigReader;
import com.aitestportal.automation.pages.LoginPage;
import com.aitestportal.automation.pages.TestCasesPage;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import static org.junit.jupiter.api.Assertions.assertTrue;

@ExtendWith(BaseTest.class)
class TestCasesTest extends BaseTest {

    @Test
    @DisplayName("Test Cases table is visible and populated")
    void shouldDisplayTestCasesTable() {
        LoginPage loginPage = new LoginPage(page);
        loginPage.login(ConfigReader.getUsername(), ConfigReader.getPassword());

        TestCasesPage testCasesPage = new TestCasesPage(page);
        testCasesPage.open();

        assertTrue(testCasesPage.isTableVisible(), "Test cases table should be visible");
        assertTrue(testCasesPage.getVisibleRowCount() > 0, "Test cases table should contain at least one row");
    }
}