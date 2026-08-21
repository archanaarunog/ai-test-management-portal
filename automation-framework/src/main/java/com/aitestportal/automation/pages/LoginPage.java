package com.aitestportal.automation.pages;

import com.aitestportal.automation.constants.Constants;
import com.microsoft.playwright.Page;

public class LoginPage extends BasePage {

    public LoginPage(Page page) {
        super(page);
    }

    public void login(String username, String password) {
        waitForVisible(Constants.LOGIN_FORM);
        fill(Constants.LOGIN_EMAIL_INPUT, username);
        fill(Constants.LOGIN_PASSWORD_INPUT, password);
        click(Constants.LOGIN_SUBMIT_BUTTON);
    }

    public boolean isLoginFormVisible() {
        return isVisible(Constants.LOGIN_FORM);
    }
}
