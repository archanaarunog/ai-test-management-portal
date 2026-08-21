package com.aitestportal.automation.constants;

public final class Constants {

    private Constants() {
    }

    // Output locations
    public static final String SCREENSHOTS_DIR = "test-output/screenshots";
    public static final String TRACES_DIR = "test-output/traces";

    // Routes
    public static final String DASHBOARD_URL_FRAGMENT = "**/app/dashboard";
    public static final String TESTS_URL_FRAGMENT = "**/app/tests";
    public static final String FORMS_URL_FRAGMENT = "**/app/forms";
    public static final String LOGIN_URL_FRAGMENT = "**/login";

    // Login page
    public static final String LOGIN_FORM = "login-form";
    public static final String LOGIN_EMAIL_INPUT = "login-email-input";
    public static final String LOGIN_PASSWORD_INPUT = "login-password-input";
    public static final String LOGIN_SUBMIT_BUTTON = "login-submit-button";

    // Header / navigation
    public static final String USER_PROFILE_DROPDOWN_TRIGGER = "user-profile-dropdown-trigger";
    public static final String LOGOUT_MENU_ITEM = "logout-menu-item";
    public static final String SIDEBAR_NAV_TESTS = "sidebar-nav-tests";
    public static final String SIDEBAR_NAV_FORMS = "sidebar-nav-forms";

    // Dashboard page
    public static final String DASHBOARD_PAGE = "dashboard-page";
    public static final String SUMMARY_CARDS = "summary-cards";

    // Test Cases page
    public static final String TESTS_TABLE_CONTAINER = "tests-table-container";
    public static final String TESTS_TABLE_BODY = "tests-table-body";

    // Forms page
    public static final String FORMS_PAGE = "forms-page";
    public static final String FULL_NAME_INPUT = "full-name-input";
    public static final String EMAIL_INPUT = "email-input";
    public static final String PASSWORD_INPUT = "password-input";
    public static final String AGREE_TERMS_CHECKBOX = "agree-terms-checkbox";
    public static final String REGISTRATION_FORM_SUBMIT_BUTTON = "registration-form-submit-button";
}