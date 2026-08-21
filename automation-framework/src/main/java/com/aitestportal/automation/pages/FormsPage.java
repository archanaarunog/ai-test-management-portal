package com.aitestportal.automation.pages;

import com.aitestportal.automation.constants.Constants;
import com.microsoft.playwright.Page;

public class FormsPage extends BasePage {

    public FormsPage(Page page) {
        super(page);
    }

    public void open() {
        click(Constants.SIDEBAR_NAV_FORMS);
        page.waitForURL(Constants.FORMS_URL_FRAGMENT);
        waitForVisible(Constants.FORMS_PAGE);
    }

    public void fillMandatoryFields(String fullName, String email, String password) {
        fill(Constants.FULL_NAME_INPUT, fullName);
        fill(Constants.EMAIL_INPUT, email);
        fill(Constants.PASSWORD_INPUT, password);
        click(Constants.AGREE_TERMS_CHECKBOX);
    }

    public void submit() {
        click(Constants.REGISTRATION_FORM_SUBMIT_BUTTON);
    }
}
