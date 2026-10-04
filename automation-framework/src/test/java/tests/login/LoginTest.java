package tests.login;

import com.archana.framework.base.BaseTest;
import com.archana.framework.driver.DriverManager;
import com.archana.framework.listeners.TestListener;
import com.archana.framework.pages.LoginPage;
import com.microsoft.playwright.Page;
import io.qameta.allure.Allure;
import io.qameta.allure.Description;
import io.qameta.allure.Feature;
import io.qameta.allure.Severity;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.testng.annotations.Listeners;
import org.testng.annotations.Test;
import io.qameta.allure.testng.AllureTestNg;
import static io.qameta.allure.SeverityLevel.CRITICAL;
import static io.qameta.allure.SeverityLevel.NORMAL;
import static org.testng.Assert.assertEquals;
import static org.testng.Assert.assertTrue;

@Listeners({
        AllureTestNg.class,
        TestListener.class
})
public class LoginTest extends BaseTest {
    private static final Logger logger = LogManager.getLogger(LoginTest.class);

    @Feature("Login")
    @Severity(CRITICAL)
    @Description("Verifies all visible UI elements and demo credentials on the Login page")
    @Test
    public void verifyLoginPageUIElements() {

        Page page = DriverManager.getPage();
        logger.info("Starting LOGIN-001: Verify Login Page UI");

        Allure.step("Navigate to Login page", () -> {

            logger.info("Navigating to Login page");

            page.navigate("/login");
        });

        LoginPage loginPage = new LoginPage(page);

        Allure.step("Verify Login page branding and content", () -> {

            logger.info("Verifying login page branding and content");

            assertTrue(loginPage.isBrandingTitleVisible(), "AI Test Management Portal branding title should be displayed");

            assertTrue(loginPage.isLeftSideContentVisible(), "A practice-ground for real-world test automation. should be displayed");

            assertTrue(loginPage.isLeftSideTitleVisible(), "Login page feature description should be displayed");
        });

        Allure.step("Verify Login form elements", () -> {

            logger.info("Verifying login form elements");

            assertTrue(loginPage.isSignInToYourAccountVisible(), "Sign in to your account should be displayed");

            assertTrue(loginPage.isEnterCredentialsVisible(), "Enter your credentials text should be displayed");

            assertTrue(loginPage.isEmailAddressVisible(), "Email address should be displayed");

            assertTrue(loginPage.isPasswordVisible(), "Password should be displayed");

            assertTrue(loginPage.isRememberMeVisible(), "Remember Me should be displayed");

            assertTrue(loginPage.isPasswordVisibilityButtonVisible(), "Password visibility button should be displayed");

            assertTrue(loginPage.isForgotPasswordVisible(), "Forgot Password link should be displayed");
        });

        Allure.step("Verify Demo credentials", () -> {

            logger.info("Verifying demo credentials");

            assertTrue(loginPage.isDemoCredentialsVisible(), "Demo credentials text should be displayed");

            String demoCredentials = loginPage.getDemoCredentialsUsernamePassword();

            assertEquals(demoCredentials, "archana.arun@aitestportal.dev / Automate@123", "Demo username and password should be displayed correctly");
        });

        Allure.step("LOGIN-001 completed successfully");

        logger.info("LOGIN-001 completed successfully");
    }

    @Feature("Login")
    @Severity(CRITICAL)
    @Description("Verifies Login with valid credentials")
    @Test
    public void verifyValidLoginCredentials() {
        Page page = DriverManager.getPage();

        Allure.step("Navigate to Login page", () -> {

            logger.info("Navigating to Login page");

            page.navigate("/login");
        });

        LoginPage loginPage = new LoginPage(page);

        logger.info("Starting LOGIN-002: Verify Login Page with Valid credentials");


        Allure.step("Enter Valid Username", () -> {
            logger.info("Entering valid username");

            loginPage.enterEmail("archana.arun@aitestportal.dev");
        });

        Allure.step("Enter Valid Password", () -> {
            logger.info("Entering valid password");

            loginPage.enterPassword("Automate@123");
        });

        Allure.step("Click Sign In", () -> {
            logger.info("Clicking sign in button");

            loginPage.clickSignIn();

        });

        Allure.step("Sign in button displays Signing in...", () ->{
            String signInText = loginPage.getSignInButtonString();

            assertEquals(signInText, "Signing in...", "Sign in button not changed to signing in...");
        });

        Allure.step("Welcome back! Login successfully banner is displayed", () ->{
            String signInText = loginPage.getWelcomeBackText();

            assertEquals(signInText, "Welcome back! Login successful.", "Welcome back! Login successful. banner not displayed on login");
        });

    }

    @Feature("Login")
    @Severity(CRITICAL)
    @Description("Verifies login failure with an invalid email and valid password")
    @Test
    public void verifyLoginWithInvalidEmail() {

        Page page = DriverManager.getPage();

        Allure.step("Navigate to Login page", () -> {

            logger.info("Navigating to Login page");

            page.navigate("/login");
        });

        LoginPage loginPage = new LoginPage(page);

        logger.info("Starting LOGIN-003: Login with invalid email");

        Allure.step("Enter invalid email", () -> {

            logger.info("Entering invalid email");

            loginPage.enterEmail("invalid.user@test.com");
        });

        Allure.step("Enter valid password", () -> {

            logger.info("Entering valid password");

            loginPage.enterPassword("Automate@123");
        });

        Allure.step("Click Sign In", () -> {

            logger.info("Clicking Sign In");

            loginPage.clickSignIn();
        });

        Allure.step("Verify invalid credentials error", () -> {

            logger.info("Verifying invalid credentials error");

            String errorMessage =
                    loginPage.getInvalidCredentialsError();

            assertEquals(
                    errorMessage,
                    "Invalid email or password. Try the demo credentials shown below.",
                    "Invalid credentials error should be displayed"
            );
        });

        Allure.step("Verify user remains on Login page", () -> {

            logger.info("Verifying user remains on Login page");

            assertTrue(
                    loginPage.isLoginPageDisplayed(),
                    "User should remain on Login page after failed login"
            );
        });
    }


    @Feature("Login")
    @Severity(CRITICAL)
    @Description("Verifies login failure with a valid email and invalid password")
    @Test
    public void verifyLoginWithInvalidPassword() {

        Page page = DriverManager.getPage();

        Allure.step("Navigate to Login page", () -> {

            logger.info("Navigating to Login page");

            page.navigate("/login");
        });

        LoginPage loginPage = new LoginPage(page);

        logger.info("Starting LOGIN-004: Login with invalid password");

        Allure.step("Enter valid email", () -> {

            logger.info("Entering valid email");

            loginPage.enterEmail("archana.arun@aitestportal.dev");
        });

        Allure.step("Enter invalid password", () -> {

            logger.info("Entering invalid password");

            loginPage.enterPassword("WrongPassword@123");
        });

        Allure.step("Click Sign In", () -> {

            logger.info("Clicking Sign In");

            loginPage.clickSignIn();
        });

        Allure.step("Verify invalid credentials error", () -> {

            logger.info("Verifying invalid credentials error");

            String errorMessage =
                    loginPage.getInvalidCredentialsError();

            assertEquals(
                    errorMessage,
                    "Invalid email or password. Try the demo credentials shown below.",
                    "Invalid credentials error should be displayed"
            );
        });

        Allure.step("Verify user remains on Login page", () -> {

            logger.info("Verifying user remains on Login page");

            assertTrue(
                    loginPage.isLoginPageDisplayed(),
                    "User should remain on Login page after failed login"
            );
        });
    }


    @Feature("Login")
    @Severity(CRITICAL)
    @Description("Verifies login failure with invalid email and invalid password")
    @Test
    public void verifyLoginWithInvalidEmailAndPassword() {

        Page page = DriverManager.getPage();

        Allure.step("Navigate to Login page", () -> {

            logger.info("Navigating to Login page");

            page.navigate("/login");
        });

        LoginPage loginPage = new LoginPage(page);

        logger.info("Starting LOGIN-005: Login with invalid email and password");

        Allure.step("Enter invalid email", () -> {

            logger.info("Entering invalid email");

            loginPage.enterEmail("invalid.user@test.com");
        });

        Allure.step("Enter invalid password", () -> {

            logger.info("Entering invalid password");

            loginPage.enterPassword("WrongPassword@123");
        });

        Allure.step("Click Sign In", () -> {

            logger.info("Clicking Sign In");

            loginPage.clickSignIn();
        });

        Allure.step("Verify invalid credentials error", () -> {

            logger.info("Verifying invalid credentials error");

            String errorMessage =
                    loginPage.getInvalidCredentialsError();

            assertEquals(
                    errorMessage,
                    "Invalid email or password. Try the demo credentials shown below.",
                    "Invalid credentials error should be displayed"
            );
        });

        Allure.step("Verify user is not authenticated", () -> {

            logger.info("Verifying user is not authenticated");

            assertTrue(
                    loginPage.isLoginPageDisplayed(),
                    "User should remain on Login page and should not be authenticated"
            );
        });
    }


    @Feature("Login")
    @Severity(CRITICAL)
    @Description("Verifies email validation for an email containing invalid special characters")
    @Test
    public void verifySpecialCharactersInEmail() {

        Page page = DriverManager.getPage();

        Allure.step("Navigate to Login page", () -> {

            logger.info("Navigating to Login page");

            page.navigate("/login");
        });

        LoginPage loginPage = new LoginPage(page);

        logger.info("Starting LOGIN-006: Validate special characters in email");

        Allure.step("Enter invalid email with special characters", () -> {

            logger.info("Entering invalid email: test@#$");

            loginPage.enterEmail("test@#$");
        });

        Allure.step("Enter password", () -> {

            logger.info("Entering password");

            loginPage.enterPassword("Automate@123");
        });

        Allure.step("Click Sign In", () -> {

            logger.info("Clicking Sign In");

            loginPage.clickSignIn();
        });

        Allure.step("Verify email validation error", () -> {

            logger.info("Verifying email validation error");

            String errorMessage =
                    loginPage.getInvalidEmailError();

            assertEquals(
                    errorMessage,
                    "Enter a valid email address",
                    "Invalid email validation message should be displayed"
            );
        });

        Allure.step("Verify user remains on Login page", () -> {

            logger.info("Verifying user remains on Login page");

            assertTrue(
                    loginPage.isLoginPageDisplayed(),
                    "User should remain on Login page when email validation fails"
            );
        });
    }

    @Feature("Login")
    @Severity(CRITICAL)
    @Description("Verifies authentication is not bypassed using SQL injection-like input")
    @Test
    public void verifySQLInjectionInput() {

        Page page = DriverManager.getPage();

        Allure.step("Navigate to Login page", () -> {
            logger.info("Navigating to Login page");
            page.navigate("/login");
        });

        LoginPage loginPage = new LoginPage(page);

        logger.info("Starting LOGIN-007: Verify SQL injection-like input");

        Allure.step("Enter SQL injection-like email", () -> {

            logger.info("Entering SQL injection-like email");

            loginPage.enterEmail("' OR '1'='1");
        });

        Allure.step("Enter SQL injection-like password", () -> {

            logger.info("Entering SQL injection-like password");

            loginPage.enterPassword("' OR '1'='1");
        });

        Allure.step("Click Sign In", () -> {

            logger.info("Clicking Sign In");

            loginPage.clickSignIn();
        });

        Allure.step("Verify invalid email validation", () -> {

            logger.info("Verifying invalid email validation");

            assertEquals(
                    loginPage.getInvalidEmailError(),
                    "Enter a valid email address",
                    "Invalid email validation should be displayed for SQL injection-like input"
            );
        });

        Allure.step("Verify authentication is not bypassed", () -> {

            logger.info("Verifying user remains on Login page");

            assertTrue(
                    loginPage.isLoginPageDisplayed(),
                    "SQL injection-like input should not bypass authentication"
            );
        });
    }

    @Feature("Login")
    @Severity(CRITICAL)
    @Description("Verifies validation when email field is empty")
    @Test
    public void verifyLoginWithEmptyEmail() {

        Page page = DriverManager.getPage();

        Allure.step("Navigate to Login page", () -> {
            logger.info("Navigating to Login page");
            page.navigate("/login");
        });

        LoginPage loginPage = new LoginPage(page);

        logger.info("Starting LOGIN-008: Login with empty email");

        Allure.step("Leave email field empty", () -> {
            logger.info("Email field is left empty");
        });

        Allure.step("Enter valid password", () -> {

            logger.info("Entering valid password");

            loginPage.enterPassword("Automate@123");
        });

        Allure.step("Click Sign In", () -> {

            logger.info("Clicking Sign In");

            loginPage.clickSignIn();
        });

        Allure.step("Verify email required validation", () -> {

            logger.info("Verifying Email is required message");

            assertEquals(
                    loginPage.getEmailRequiredError(),
                    "Email is required",
                    "Email required validation message should be displayed"
            );
        });

        Allure.step("Verify login is not submitted", () -> {

            logger.info("Verifying user remains on Login page");

            assertTrue(
                    loginPage.isLoginPageDisplayed(),
                    "Login should not be submitted when email is empty"
            );
        });
    }

    @Feature("Login")
    @Severity(CRITICAL)
    @Description("Verifies validation when password field is empty")
    @Test
    public void verifyLoginWithEmptyPassword() {

        Page page = DriverManager.getPage();

        Allure.step("Navigate to Login page", () -> {
            logger.info("Navigating to Login page");
            page.navigate("/login");
        });

        LoginPage loginPage = new LoginPage(page);

        logger.info("Starting LOGIN-009: Login with empty password");

        Allure.step("Enter valid email", () -> {

            logger.info("Entering valid email");

            loginPage.enterEmail("archana.arun@aitestportal.dev");
        });

        Allure.step("Leave password field empty", () -> {

            logger.info("Password field is left empty");
        });

        Allure.step("Click Sign In", () -> {

            logger.info("Clicking Sign In");

            loginPage.clickSignIn();
        });

        Allure.step("Verify password required validation", () -> {

            logger.info("Verifying Password is required message");

            assertEquals(
                    loginPage.getPasswordRequiredError(),
                    "Password is required",
                    "Password required validation message should be displayed"
            );
        });

        Allure.step("Verify login is not submitted", () -> {

            logger.info("Verifying user remains on Login page");

            assertTrue(
                    loginPage.isLoginPageDisplayed(),
                    "Login should not be submitted when password is empty"
            );
        });
    }

    @Feature("Login")
    @Severity(CRITICAL)
    @Description("Verifies validation when both email and password fields are empty")
    @Test
    public void verifyLoginWithBothFieldsEmpty() {

        Page page = DriverManager.getPage();

        Allure.step("Navigate to Login page", () -> {
            logger.info("Navigating to Login page");
            page.navigate("/login");
        });

        LoginPage loginPage = new LoginPage(page);

        logger.info("Starting LOGIN-010: Login with both fields empty");

        Allure.step("Leave email field empty", () -> {

            logger.info("Email field is left empty");
        });

        Allure.step("Leave password field empty", () -> {

            logger.info("Password field is left empty");
        });

        Allure.step("Click Sign In", () -> {

            logger.info("Clicking Sign In");

            loginPage.clickSignIn();
        });

        Allure.step("Verify email required validation", () -> {

            logger.info("Verifying Email is required message");

            assertEquals(
                    loginPage.getEmailRequiredError(),
                    "Email is required",
                    "Email required validation message should be displayed"
            );
        });

        Allure.step("Verify password required validation", () -> {

            logger.info("Verifying Password is required message");

            assertEquals(
                    loginPage.getPasswordRequiredError(),
                    "Password is required",
                    "Password required validation message should be displayed"
            );
        });

        Allure.step("Verify login is not submitted", () -> {

            logger.info("Verifying user remains on Login page");

            assertTrue(
                    loginPage.isLoginPageDisplayed(),
                    "Login should not be submitted when both fields are empty"
            );
        });
    }

    @Feature("Login")
    @Severity(NORMAL)
    @Description("Verifies that password characters are masked")
    @Test
    public void verifyPasswordMasking() {

        Page page = DriverManager.getPage();

        Allure.step("Navigate to Login page", () -> {
            logger.info("Navigating to Login page");
            page.navigate("/login");
        });

        LoginPage loginPage = new LoginPage(page);

        logger.info("Starting LOGIN-011: Verify password masking");

        Allure.step("Click Password field", () -> {

            logger.info("Clicking Password field");

            loginPage.enterPassword("Automate@123");
        });

        Allure.step("Verify password is masked", () -> {

            logger.info("Verifying password input type");

            assertEquals(
                    loginPage.getPasswordInputType(),
                    "password",
                    "Password should be masked using password input type"
            );
        });
    }

    @Feature("Login")
    @Severity(NORMAL)
    @Description("Verifies show and hide password functionality")
    @Test
    public void verifyShowHidePassword() {

        Page page = DriverManager.getPage();

        Allure.step("Navigate to Login page", () -> {
            logger.info("Navigating to Login page");
            page.navigate("/login");
        });

        LoginPage loginPage = new LoginPage(page);

        logger.info("Starting LOGIN-012: Verify show/hide password");

        Allure.step("Enter password", () -> {

            logger.info("Entering password");

            loginPage.enterPassword("Automate@123");
        });

        Allure.step("Verify password is initially masked", () -> {

            logger.info("Verifying password is initially masked");

            assertEquals(
                    loginPage.getPasswordInputType(),
                    "password",
                    "Password should initially be masked"
            );
        });

        Allure.step("Click eye icon to show password", () -> {

            logger.info("Clicking password visibility button");

            loginPage.clickPasswordVisibilityButton();
        });

        Allure.step("Verify password becomes visible", () -> {

            logger.info("Verifying password is visible");

            assertEquals(
                    loginPage.getPasswordInputType(),
                    "text",
                    "Password should become visible after clicking eye icon"
            );
        });

        Allure.step("Click eye icon again", () -> {

            logger.info("Clicking password visibility button again");

            loginPage.clickPasswordVisibilityButton();
        });

        Allure.step("Verify password becomes masked again", () -> {

            logger.info("Verifying password is masked again");

            assertEquals(
                    loginPage.getPasswordInputType(),
                    "password",
                    "Password should become masked after clicking eye icon again"
            );
        });
    }
    // ============================================================
    // LOGIN-013
    // Validate email format
    // ============================================================

    @Feature("Login")
    @Severity(CRITICAL)
    @Description("Verifies validation for invalid email formats")
    @Test
    public void verifyInvalidEmailFormats() {

        Page page = DriverManager.getPage();

        Allure.step("Navigate to Login page", () -> {

            logger.info("Navigating to Login page");

            page.navigate("/login");
        });


        String[] invalidEmails = {
                "test",
                "test@",
                "@test.com",
                "test.com"
        };

        for (String invalidEmail : invalidEmails) {

            Allure.step(
                    "Verify invalid email format: " + invalidEmail,
                    () -> {


                        logger.info(
                                "Testing invalid email format: {}",
                                invalidEmail
                        );

                        // Reload before each variation
                        page.navigate("/login");

                        LoginPage loginPage = new LoginPage(page);

                        loginPage.enterEmail(invalidEmail);

                        loginPage.enterPassword("Automate@123");

                        loginPage.clickSignIn();

                        assertEquals(
                                loginPage.getInvalidEmailError(),
                                "Enter a valid email address",
                                "Invalid email validation message should be displayed"
                        );

                        assertTrue(
                                loginPage.isLoginPageDisplayed(),
                                "User should remain on Login page"
                        );
                    }
            );
        }
    }


    // ============================================================
    // LOGIN-014
    // Login with uppercase email
    // ============================================================

    @Feature("Login")
    @Severity(CRITICAL)
    @Description("Verifies login succeeds when a valid email is entered in uppercase")
    @Test
    public void verifyLoginWithUppercaseEmail() {

        Page page = DriverManager.getPage();

        Allure.step("Navigate to Login page", () -> {

            logger.info("Navigating to Login page");

            page.navigate("/login");
        });

        LoginPage loginPage = new LoginPage(page);

        Allure.step("Enter uppercase email", () -> {

            logger.info("Entering uppercase email");

            loginPage.enterEmail(
                    "ARCHANA.ARUN@AITESTPORTAL.DEV"
            );
        });

        Allure.step("Enter valid password", () -> {

            logger.info("Entering valid password");

            loginPage.enterPassword("Automate@123");
        });

        Allure.step("Click Sign In", () -> {

            logger.info("Clicking Sign In");

            loginPage.clickSignIn();
        });

        Allure.step("Verify login succeeds", () -> {

            logger.info("Verifying successful login");

            assertEquals(
                    loginPage.getWelcomeBackText(),
                    "Welcome back! Login successful.",
                    "Login success message should be displayed"
            );
        });

        Allure.step("Verify navigation to Dashboard", () -> {

            logger.info("Verifying Dashboard navigation");

            assertTrue(
                    page.url().contains("/app/dashboard"),
                    "User should be navigated to Dashboard"
            );
        });
    }


    // ============================================================
    // LOGIN-015
    // Password case sensitivity
    // ============================================================

    @Feature("Login")
    @Severity(CRITICAL)
    @Description("Verifies that password authentication is case-sensitive")
    @Test
    public void verifyPasswordCaseSensitivity() {

        Page page = DriverManager.getPage();

        Allure.step("Navigate to Login page", () -> {

            logger.info("Navigating to Login page");

            page.navigate("/login");
        });

        LoginPage loginPage = new LoginPage(page);

        Allure.step("Enter valid email", () -> {

            logger.info("Entering valid email");

            loginPage.enterEmail(
                    "archana.arun@aitestportal.dev"
            );
        });

        Allure.step("Enter password with incorrect casing", () -> {

            logger.info("Entering incorrectly cased password");

            loginPage.enterPassword("automate@123");
        });

        Allure.step("Click Sign In", () -> {

            logger.info("Clicking Sign In");

            loginPage.clickSignIn();
        });

        Allure.step("Verify invalid credentials error", () -> {

            logger.info("Verifying invalid credentials error");

            assertEquals(
                    loginPage.getInvalidCredentialsError(),
                    "Invalid email or password. Try the demo credentials shown below.",
                    "Invalid credentials error should be displayed"
            );
        });

        Allure.step("Verify user remains on Login page", () -> {

            logger.info("Verifying authentication did not succeed");

            assertTrue(
                    loginPage.isLoginPageDisplayed(),
                    "User should remain on Login page"
            );
        });
    }


    // ============================================================
    // LOGIN-016
    // Leading/trailing spaces in email
    // ============================================================

    @Feature("Login")
    @Severity(CRITICAL)
    @Description("Verifies that leading and trailing spaces in email are trimmed")
    @Test
    public void verifyLoginWithEmailSpaces() {

        Page page = DriverManager.getPage();


        // --------------------------------------------------------
        // Leading spaces
        // --------------------------------------------------------

        Allure.step("Verify email with leading spaces", () -> {

            logger.info("Testing email with leading spaces");

            page.navigate("/login");
            LoginPage loginPage = new LoginPage(page);


            loginPage.enterEmail(
                    "   archana.arun@aitestportal.dev"
            );

            loginPage.enterPassword("Automate@123");

            loginPage.clickSignIn();

            assertEquals(
                    loginPage.getWelcomeBackText(),
                    "Welcome back! Login successful.",
                    "Login should succeed when email contains leading spaces"
            );

            assertTrue(
                    page.url().contains("/app/dashboard"),
                    "User should be navigated to Dashboard"
            );
        });


        // --------------------------------------------------------
        // Trailing spaces
        // --------------------------------------------------------

        Allure.step("Verify email with trailing spaces", () -> {

            logger.info("Testing email with trailing spaces");

            page.navigate("/login");
            LoginPage loginPage = new LoginPage(page);


            loginPage.enterEmail(
                    "archana.arun@aitestportal.dev   "
            );

            loginPage.enterPassword("Automate@123");

            loginPage.clickSignIn();

            assertEquals(
                    loginPage.getWelcomeBackText(),
                    "Welcome back! Login successful.",
                    "Login should succeed when email contains trailing spaces"
            );

            assertTrue(
                    page.url().contains("/app/dashboard"),
                    "User should be navigated to Dashboard"
            );
        });
    }


    // ============================================================
    // LOGIN-017
    // Remember Me functionality
    // ============================================================

    @Feature("Login")
    @Severity(CRITICAL)
    @Description("Verifies Remember Me preserves authentication state")
    @Test
    public void verifyRememberMeFunctionality() {

        Page page = DriverManager.getPage();

        Allure.step("Navigate to Login page", () -> {

            logger.info("Navigating to Login page");

            page.navigate("/login");
        });

        // Create LoginPage only after we are actually on the Login page
        LoginPage loginPage = new LoginPage(page);

        Allure.step("Enter valid email", () -> {

            logger.info("Entering valid email");

            loginPage.enterEmail(
                    "archana.arun@aitestportal.dev"
            );
        });

        Allure.step("Enter valid password", () -> {

            logger.info("Entering valid password");

            loginPage.enterPassword("Automate@123");
        });

        Allure.step("Select Remember Me", () -> {

            logger.info("Selecting Remember Me");

            loginPage.selectRememberMe();

            assertTrue(
                    loginPage.isRememberMeSelected(),
                    "Remember Me checkbox should be selected"
            );
        });

        Allure.step("Click Sign In", () -> {

            logger.info("Clicking Sign In");

            loginPage.clickSignIn();
        });

        Allure.step("Verify successful login", () -> {

            logger.info("Verifying successful login");

            assertEquals(
                    loginPage.getWelcomeBackText(),
                    "Welcome back! Login successful.",
                    "Login should succeed"
            );
        });

        Allure.step("Verify Dashboard navigation", () -> {

            logger.info("Verifying Dashboard navigation");

            assertTrue(
                    page.url().contains("/app/dashboard"),
                    "User should be navigated to Dashboard"
            );
        });

        Allure.step("Reload application", () -> {

            logger.info("Reloading application");

            // Direct Page operation — no LoginPage/healing required here
            page.reload();

            // Wait for the application to settle after reload
            page.waitForLoadState();
        });

        Allure.step("Verify authentication state is preserved", () -> {

            logger.info("Verifying Remember Me authentication state");

            assertTrue(
                    page.url().contains("/app/dashboard"),
                    "User should remain authenticated after reload"
            );
        });
    }


    // ============================================================
    // LOGIN-018
    // Sign In button during authentication
    // ============================================================

    @Feature("Login")
    @Severity(NORMAL)
    @Description("Verifies Sign In button changes to Signing in and becomes disabled during authentication")
    @Test
    public void verifySignInButtonDuringAuthentication() {

        Page page = DriverManager.getPage();

        Allure.step("Navigate to Login page", () -> {

            logger.info("Navigating to Login page");

            page.navigate("/login");
        });

        LoginPage loginPage = new LoginPage(page);

        Allure.step("Enter valid email", () -> {

            logger.info("Entering valid email");

            loginPage.enterEmail(
                    "archana.arun@aitestportal.dev"
            );
        });

        Allure.step("Enter valid password", () -> {

            logger.info("Entering valid password");

            loginPage.enterPassword("Automate@123");
        });

        Allure.step("Click Sign In", () -> {

            logger.info("Clicking Sign In");

            loginPage.clickSignIn();
        });

        Allure.step("Verify button displays Signing in", () -> {

            logger.info("Verifying Sign In button text");

            assertEquals(
                    loginPage.getSignInButtonString(),
                    "Signing in...",
                    "Sign In button should change to Signing in..."
            );
        });

        Allure.step("Verify Sign In button is disabled", () -> {

            logger.info("Verifying Sign In button is disabled");

            assertTrue(
                    loginPage.isSignInButtonDisabled(),
                    "Sign In button should be disabled during authentication"
            );
        });
    }

    // ============================================================
// LOGIN-019
// Forgot Password with valid email
// ============================================================

    @Feature("Login")
    @Severity(NORMAL)
    @Description("Verifies Forgot Password flow with a valid email")
    @Test
    public void verifyForgotPasswordWithValidEmail() {

        Page page = DriverManager.getPage();


        Allure.step("Navigate to Login page", () -> {

            logger.info("Navigating to Login page");

            page.navigate("/login");
        });

        Allure.step("Click Forgot Password", () -> {
            LoginPage loginPage = new LoginPage(page);


            logger.info("Clicking Forgot Password");

            loginPage.clickForgotPassword();
        });

        Allure.step("Verify Reset Password dialog", () -> {

            logger.info("Verifying Reset Password dialog");
            LoginPage loginPage = new LoginPage(page);


            assertTrue(
                    loginPage.isResetPasswordDialogDisplayed(),
                    "Reset Password dialog should be displayed"
            );
        });

        Allure.step("Enter valid email", () -> {
            LoginPage loginPage = new LoginPage(page);


            logger.info("Entering valid reset email");

            loginPage.enterResetPasswordEmail(
                    "archana.arun@aitestportal.dev"
            );
        });

        Allure.step("Click Send reset link", () -> {
            LoginPage loginPage = new LoginPage(page);


            logger.info("Clicking Send reset link");

            loginPage.clickSendResetLink();
        });

        Allure.step("Verify generic reset message", () -> {
            LoginPage loginPage = new LoginPage(page);


            logger.info("Verifying generic reset message");

            assertTrue(
                    loginPage.getResetPasswordMessage()
                            .contains("If an account exists"),
                    "Generic reset password message should be displayed"
            );
        });

        Allure.step("Verify reset link toast", () -> {

            logger.info("Verifying reset link toast");
            LoginPage loginPage = new LoginPage(page);


            assertEquals(
                    loginPage.getResetPasswordToast(),
                    "Password reset link sent (simulated).",
                    "Reset link informational toast should be displayed"
            );
        });
    }


// ============================================================
// LOGIN-020
// Forgot Password with invalid email
// ============================================================

    @Feature("Login")
    @Severity(NORMAL)
    @Description("Verifies Forgot Password validation with an invalid email")
    @Test
    public void verifyForgotPasswordWithInvalidEmail() {

        Page page = DriverManager.getPage();


        Allure.step("Navigate to Login page", () -> {

            logger.info("Navigating to Login page");

            page.navigate("/login");
        });

        Allure.step("Click Forgot Password", () -> {
            LoginPage loginPage = new LoginPage(page);


            logger.info("Clicking Forgot Password");

            loginPage.clickForgotPassword();
        });

        Allure.step("Verify Reset Password dialog", () -> {

            logger.info("Verifying Reset Password dialog");
            LoginPage loginPage = new LoginPage(page);


            assertTrue(
                    loginPage.isResetPasswordDialogDisplayed(),
                    "Reset Password dialog should be displayed"
            );
        });

        Allure.step("Enter invalid email", () -> {
            LoginPage loginPage = new LoginPage(page);


            logger.info("Entering invalid email");

            loginPage.enterResetPasswordEmail("invalid-email");
        });

        Allure.step("Click Send reset link", () -> {
            LoginPage loginPage = new LoginPage(page);


            logger.info("Clicking Send reset link");

            loginPage.clickSendResetLink();
        });

        Allure.step("Verify invalid email validation", () -> {
            LoginPage loginPage = new LoginPage(page);


            logger.info("Verifying invalid email validation");

            assertEquals(
                    loginPage.getInvalidEmailError(),
                    "Enter a valid email address",
                    "Invalid email validation message should be displayed"
            );
        });

        Allure.step("Verify reset request is not processed", () -> {
            LoginPage loginPage = new LoginPage(page);


            logger.info("Verifying reset request was not processed");

            assertTrue(
                    loginPage.isResetPasswordDialogDisplayed(),
                    "Reset Password dialog should remain open"
            );
        });
    }


// ============================================================
// LOGIN-021
// Forgot Password with empty email
// ============================================================

    @Feature("Login")
    @Severity(NORMAL)
    @Description("Verifies Forgot Password validation with an empty email")
    @Test
    public void verifyForgotPasswordWithEmptyEmail() {

        Page page = DriverManager.getPage();


        Allure.step("Navigate to Login page", () -> {

            logger.info("Navigating to Login page");

            page.navigate("/login");
        });

        Allure.step("Click Forgot Password", () -> {
            LoginPage loginPage = new LoginPage(page);


            logger.info("Clicking Forgot Password");

            loginPage.clickForgotPassword();
        });

        Allure.step("Verify Reset Password dialog", () -> {

            logger.info("Verifying Reset Password dialog");
            LoginPage loginPage = new LoginPage(page);


            assertTrue(
                    loginPage.isResetPasswordDialogDisplayed(),
                    "Reset Password dialog should be displayed"
            );
        });

        Allure.step("Leave reset email empty", () -> {

            logger.info("Leaving reset email field empty");
        });

        Allure.step("Click Send reset link", () -> {
            LoginPage loginPage = new LoginPage(page);


            logger.info("Clicking Send reset link");

            loginPage.clickSendResetLink();
        });

        Allure.step("Verify email validation", () -> {

            logger.info("Verifying email validation");
            LoginPage loginPage = new LoginPage(page);


            assertEquals(
                    loginPage.getInvalidEmailError(),
                    "Enter a valid email address",
                    "Email validation message should be displayed"
            );
        });
    }


// ============================================================
// LOGIN-022
// Forgot Password with unknown email
// ============================================================

    @Feature("Login")
    @Severity(NORMAL)
    @Description("Verifies Forgot Password does not reveal whether an email is registered")
    @Test
    public void verifyForgotPasswordWithUnknownEmail() {

        Page page = DriverManager.getPage();


        Allure.step("Navigate to Login page", () -> {

            logger.info("Navigating to Login page");

            page.navigate("/login");
        });

        Allure.step("Click Forgot Password", () -> {
            LoginPage loginPage = new LoginPage(page);


            logger.info("Clicking Forgot Password");

            loginPage.clickForgotPassword();
        });

        Allure.step("Enter unknown valid email", () -> {

            logger.info("Entering syntactically valid but unregistered email");
            LoginPage loginPage = new LoginPage(page);


            loginPage.enterResetPasswordEmail(
                    "unknown.user@aitestportal.dev"
            );
        });

        Allure.step("Click Send reset link", () -> {
            LoginPage loginPage = new LoginPage(page);


            logger.info("Clicking Send reset link");

            loginPage.clickSendResetLink();
        });

        Allure.step("Verify generic reset message", () -> {

            logger.info("Verifying generic reset message");
            LoginPage loginPage = new LoginPage(page);


            assertTrue(
                    loginPage.getResetPasswordMessage()
                            .contains("If an account exists"),
                    "Application should display a generic reset message"
            );
        });

        Allure.step("Verify reset link toast", () -> {

            logger.info("Verifying reset link toast");
            LoginPage loginPage = new LoginPage(page);


            assertEquals(
                    loginPage.getResetPasswordToast(),
                    "Password reset link sent (simulated).",
                    "Reset link informational toast should be displayed"
            );
        });
    }


// ============================================================
// LOGIN-023
// Keyboard / Tab navigation
// ============================================================

    @Feature("Login")
    @Severity(NORMAL)
    @Description("Verifies Login page can be operated using keyboard navigation")
    @Test
    public void verifyKeyboardTabNavigation() {

        Page page = DriverManager.getPage();

        Allure.step("Navigate to Login page", () -> {

            logger.info("Navigating to Login page");

            page.navigate("/login");
        });

        LoginPage loginPage = new LoginPage(page);

        Allure.step("Focus email field", () -> {

            logger.info("Focusing email field");

            page.locator("#login-email").focus();

            assertEquals(
                    loginPage.getFocusedElementId(),
                    "login-email",
                    "Email field should receive focus"
            );
        });

        Allure.step("Enter email using keyboard", () -> {

            logger.info("Entering email using keyboard");

            page.keyboard().type(
                    "archana.arun@aitestportal.dev"
            );
        });

        Allure.step("Move to password field using Tab", () -> {

            logger.info("Pressing Tab to move to password field");

            page.keyboard().press("Tab"); // Forgot password
            page.keyboard().press("Tab"); // Password

            assertEquals(
                    loginPage.getFocusedElementId(),
                    "login-password",
                    "Password field should receive focus after Tab"
            );
        });

        Allure.step("Enter password using keyboard", () -> {

            logger.info("Entering password using keyboard");

            page.keyboard().type("Automate@123");
        });

        Allure.step("Move to Sign In button using keyboard", () -> {

            logger.info("Moving focus to Sign In button");

            page.keyboard().press("Tab"); // Toggle password visibility
            page.keyboard().press("Tab"); // Remember Me
            page.keyboard().press("Tab"); // Sign In

            assertTrue(
                    loginPage.isSignInButtonFocused(),
                    "Sign In button should receive focus after Tab"
            );
        });

        Allure.step("Submit login using Enter key", () -> {

            logger.info("Submitting login using Enter key");

            loginPage.pressEnter();
        });

        Allure.step("Verify successful login", () -> {

            logger.info("Verifying successful login");

            assertEquals(
                    loginPage.getWelcomeBackText(),
                    "Welcome back! Login successful.",
                    "Login should succeed using keyboard navigation"
            );
        });

        Allure.step("Verify Dashboard navigation", () -> {

            logger.info("Verifying Dashboard navigation");

            assertTrue(
                    page.url().contains("/app/dashboard"),
                    "User should be navigated to Dashboard"
            );
        });
    }


}
