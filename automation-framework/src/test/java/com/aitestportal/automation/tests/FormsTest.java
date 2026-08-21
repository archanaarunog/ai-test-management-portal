package com.aitestportal.automation.tests;

import com.aitestportal.automation.base.BaseTest;
import com.aitestportal.automation.config.ConfigReader;
import com.aitestportal.automation.pages.FormsPage;
import com.aitestportal.automation.pages.LoginPage;
import com.microsoft.playwright.Locator;
import com.microsoft.playwright.options.WaitForSelectorState;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import static org.junit.jupiter.api.Assertions.assertTrue;

@ExtendWith(BaseTest.class)
class FormsTest extends BaseTest {

    @Test
    @DisplayName("Registration form can be filled and submitted")
    void shouldSubmitFormSuccessfully() {
        LoginPage loginPage = new LoginPage(page);
        loginPage.login(ConfigReader.getUsername(), ConfigReader.getPassword());

        FormsPage formsPage = new FormsPage(page);
        formsPage.open();
        formsPage.fillMandatoryFields("Jane Doe", "jane.doe@aitestportal.dev", "Automate@123");
        formsPage.submit();

        Locator successToast = page.getByText("Form submitted successfully.");
        successToast.waitFor(new Locator.WaitForOptions().setState(WaitForSelectorState.VISIBLE));

        assertTrue(successToast.isVisible(), "Success toast should be shown after form submission");
    }
}
