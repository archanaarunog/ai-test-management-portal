package com.archana.framework.pages;

import com.microsoft.playwright.Locator;
import com.microsoft.playwright.Page;

public class LoginPage {

    private Page page;

    private Locator brandingTitle;
    private Locator leftSideContentText;
    private Locator leftSideTitleText;
    private Locator signInToYourAccountText;
    private Locator enterCredentialsText;
    private Locator emailAddressText;
    private Locator passwordText;
    private Locator forgotPasswordText;
    private Locator passwordVisibilityButton;
    private Locator rememberMeText;
    private Locator demoCredentialsText;
    private Locator demoCredentialsUsernamePassword;
    private Locator usernameInput;
    private Locator passwordInput;
    private Locator signInButton;
    private Locator welcomeBackText;

    // LOGIN-003 to LOGIN-007
    private Locator invalidCredentialsError;
    private Locator invalidEmailError;

    // LOGIN-008 to LOGIN-010
    private Locator emailRequiredError;
    private Locator passwordRequiredError;

    // LOGIN-017
    private Locator rememberMeCheckbox;

    // LOGIN-019 to LOGIN-022
    private Locator resetPasswordDialog;
    private Locator resetPasswordTitle;
    private Locator resetPasswordEmailInput;
    private Locator sendResetLinkButton;
    private Locator resetPasswordMessage;
    private Locator resetPasswordToast;


    public LoginPage(Page page) {

        this.page = page;

        // =========================
        // Login Page UI
        // =========================

        this.brandingTitle =
                page.locator("div.relative div.flex.items-center.gap-2")
                        .getByText("AI Test Management Portal");

        this.leftSideContentText =
                page.getByText(
                        "A practice-ground for real-world test automation."
                );

        this.leftSideTitleText =
                page.getByText(
                        "Login, tables, modals, drag-and-drop, alerts, iframes, and more — every screen is built as a stable, automatable surface for your Playwright and Selenium suites."
                );

        this.signInToYourAccountText =
                page.getByText("Sign in to your account");

        this.enterCredentialsText =
                page.getByText(
                        "Enter your credentials to access the test management console."
                );

        this.emailAddressText =
                page.getByText("Email address");

        this.passwordText =
                page.getByText(
                        "Password",
                        new Page.GetByTextOptions().setExact(true)
                );

        this.forgotPasswordText =
                page.getByText("Forgot password?");

        this.passwordVisibilityButton =
                page.locator("#toggle-password-visibility");

        this.rememberMeText =
                page.getByText("Remember me");

        this.demoCredentialsText =
                page.getByText("Demo credentials");

        this.demoCredentialsUsernamePassword =
                page.getByTestId("demo-credentials-hint");

        this.usernameInput =
                page.locator("#login-email");

        this.passwordInput =
                page.locator("#login-password");

        this.signInButton =
                page.locator("#login-submit-button");

        this.welcomeBackText =
                page.getByText(
                        "Welcome back! Login successful."
                );


        // =========================
        // Login Validation
        // =========================

        this.invalidCredentialsError =
                page.getByText(
                        "Invalid email or password. Try the demo credentials shown below.",
                        new Page.GetByTextOptions().setExact(true)
                );

        this.invalidEmailError =
                page.getByText(
                        "Enter a valid email address",
                        new Page.GetByTextOptions().setExact(true)
                );

        this.emailRequiredError =
                page.getByText(
                        "Email is required",
                        new Page.GetByTextOptions().setExact(true)
                );

        this.passwordRequiredError =
                page.getByText(
                        "Password is required",
                        new Page.GetByTextOptions().setExact(true)
                );


        // =========================
        // Remember Me
        // =========================

        this.rememberMeCheckbox =
                page.getByLabel("Remember me");


        // =========================
        // Forgot Password
        // =========================



        this.resetPasswordTitle =
                page.getByText(
                        "Reset your password",
                        new Page.GetByTextOptions().setExact(true)
                );

        /*
         * The exact locator for the forgot-password email field
         * should preferably use its stable id/test-id if available.
         *
         * This assumes the application uses an input associated
         * with the reset-password form.
         */
        this.resetPasswordEmailInput =
                page.locator(
                        "input[type='email']"
                ).last();

        this.sendResetLinkButton =
                page.locator("#forgot-password-submit-button");

        this.resetPasswordMessage =
                page.getByText(
                        "If an account exists",
                        new Page.GetByTextOptions().setExact(false)
                );

        this.resetPasswordToast =
                page.getByText(
                        "Password reset link sent (simulated).",
                        new Page.GetByTextOptions().setExact(true)
                );
    }


    // ============================================================
    // Login Page UI
    // ============================================================

    public boolean isBrandingTitleVisible() {
        return brandingTitle.isVisible();
    }

    public boolean isLeftSideContentVisible() {
        return leftSideContentText.isVisible();
    }

    public boolean isLeftSideTitleVisible() {
        return leftSideTitleText.isVisible();
    }

    public boolean isSignInToYourAccountVisible() {
        return signInToYourAccountText.isVisible();
    }

    public boolean isEnterCredentialsVisible() {
        return enterCredentialsText.isVisible();
    }

    public boolean isEmailAddressVisible() {
        return emailAddressText.isVisible();
    }

    public boolean isPasswordVisible() {
        return passwordText.isVisible();
    }

    public boolean isRememberMeVisible() {
        return rememberMeText.isVisible();
    }

    public boolean isPasswordVisibilityButtonVisible() {
        return passwordVisibilityButton.isVisible();
    }

    public boolean isForgotPasswordVisible() {
        return forgotPasswordText.isVisible();
    }

    public boolean isDemoCredentialsVisible() {
        return demoCredentialsText.isVisible();
    }

    public String getDemoCredentialsUsernamePassword() {
        return demoCredentialsUsernamePassword.innerText();
    }


    // ============================================================
    // Login Actions
    // ============================================================

    public void enterEmail(String email) {
        usernameInput.fill(email);
    }

    public void enterPassword(String password) {
        passwordInput.fill(password);
    }

    public void clickSignIn() {
        signInButton.click();
    }

    public String getSignInButtonString() {
        return signInButton.innerText();
    }

    public boolean isSignInButtonDisabled() {
        return signInButton.isDisabled();
    }

    public String getWelcomeBackText() {
        return welcomeBackText.innerText();
    }


    // ============================================================
    // LOGIN-003 to LOGIN-007
    // ============================================================

    public String getInvalidCredentialsError() {
        return invalidCredentialsError.innerText();
    }

    public String getInvalidEmailError() {
        return invalidEmailError.innerText();
    }

    public boolean isLoginPageDisplayed() {
        return page.url().contains("/login");
    }


    // ============================================================
    // LOGIN-008 to LOGIN-010
    // ============================================================

    public String getEmailRequiredError() {
        return emailRequiredError.innerText();
    }

    public String getPasswordRequiredError() {
        return passwordRequiredError.innerText();
    }


    // ============================================================
    // LOGIN-011 / LOGIN-012
    // ============================================================

    public String getPasswordInputType() {
        return passwordInput.getAttribute("type");
    }

    public void clickPasswordVisibilityButton() {
        passwordVisibilityButton.click();
    }


    // ============================================================
    // LOGIN-017
    // ============================================================

    public void selectRememberMe() {
        rememberMeCheckbox.check();
    }

    public boolean isRememberMeSelected() {
        return rememberMeCheckbox.isChecked();
    }

    public void reloadPage() {
        page.reload();
    }


    // ============================================================
    // LOGIN-019 to LOGIN-022
    // ============================================================

    public void clickForgotPassword() {
        forgotPasswordText.click();
    }

    public boolean isResetPasswordDialogDisplayed() {
        return resetPasswordTitle.isVisible();
    }

    public void enterResetPasswordEmail(String email) {
        resetPasswordEmailInput.fill(email);
    }

    public void clickSendResetLink() {
        sendResetLinkButton.click();
    }

    public String getResetPasswordMessage() {
        return resetPasswordMessage.innerText();
    }

    public String getResetPasswordToast() {
        return resetPasswordToast.innerText();
    }


    // ============================================================
    // LOGIN-020 / LOGIN-021
    // ============================================================

    public boolean isInvalidEmailErrorDisplayed() {
        return invalidEmailError.isVisible();
    }


    // ============================================================
    // LOGIN-023
    // ============================================================

    public void pressTab() {
        page.keyboard().press("Tab");
    }

    public void pressEnter() {
        page.keyboard().press("Enter");
    }

    public String getFocusedElementId() {
        return page.evaluate(
                "() => document.activeElement ? document.activeElement.id : ''"
        ).toString();
    }
}