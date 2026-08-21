# AI Test Management Portal — Automation Framework

A Playwright Java automation framework covering the core user flows of the AI Test Management Portal: login, dashboard, test case management, form submission, and logout. Built on Page Object Model with thread-safe parallel execution, automatic screenshot and trace capture on failure, and a Maven-generated HTML report — wired into GitHub Actions so every push is verified automatically.

## Architecture

```
Test classes (JUnit 5)
        │
        ▼
   BaseTest  ──────────────► PlaywrightFactory ──► Playwright / Browser / Context / Page
        │                          (per-thread, via ThreadLocal)
        ▼
  Page Objects (LoginPage, DashboardPage, TestCasesPage, FormsPage)
        │
        ▼
     BasePage  ──► data-testid locators against the running application
        │
        ▼
   ConfigReader  ──► config.properties / environment variables / system properties
        │
        ▼
    Constants  ──► routes and data-testid values used by the page objects
```

- **Page Object Model** keeps every locator and interaction for a screen in one class, so a UI change only requires updating the corresponding page object.
- **PlaywrightFactory** owns the Playwright/Browser/BrowserContext/Page lifecycle per thread, which is what makes parallel execution safe — no two tests ever share a browser.
- **BaseTest** wires that lifecycle into JUnit 5's `@BeforeEach` / `@AfterEach`, and additionally implements `TestExecutionExceptionHandler` so a failing test triggers a screenshot and keeps its trace file before the browser is torn down.
- **ConfigReader** resolves configuration in priority order (JVM system property → environment variable → `config.properties` → default), so the same code runs locally and in CI without modification.

## Folder structure

```
automation-framework/
├── pom.xml
├── .gitignore
├── .env                                  # local-only reference for environment overrides
├── README.md
└── src/
    ├── main/java/com/aitestportal/automation/
    │   ├── config/
    │   │   └── ConfigReader.java          # layered configuration resolution
    │   ├── constants/
    │   │   └── Constants.java             # routes, data-testid values, output paths
    │   ├── factory/
    │   │   └── PlaywrightFactory.java     # thread-safe browser lifecycle
    │   └── pages/
    │       ├── BasePage.java              # shared testid-based locator helpers
    │       ├── LoginPage.java
    │       ├── DashboardPage.java
    │       ├── TestCasesPage.java
    │       └── FormsPage.java
    └── test/
        ├── java/com/aitestportal/automation/
        │   ├── base/
        │   │   └── BaseTest.java          # lifecycle, screenshot/trace on failure
        │   └── tests/
        │       ├── LoginTest.java
        │       ├── DashboardTest.java
        │       ├── TestCasesTest.java
        │       ├── FormsTest.java
        │       └── LogoutTest.java
        └── resources/
            ├── config.properties          # default configuration
            └── junit-platform.properties  # parallel execution configuration
```

### File-by-file

| File | Why it exists | What it does | How it connects |
|---|---|---|---|
| `pom.xml` | Defines the build | Declares Playwright, JUnit 5, and the plugins for compiling, running tests, generating the HTML report, and installing browsers | Everything else runs through Maven's lifecycle defined here |
| `ConfigReader.java` | Avoids hard-coded environment values | Resolves base URL, browser, headless mode, timeout, and credentials from system property → env var → properties file → default | Used by `PlaywrightFactory` (browser/timeout) and every test (base URL, credentials) |
| `Constants.java` | Single source of truth for selectors | Holds `data-testid` values and route fragments | Used by every page object instead of inline strings |
| `PlaywrightFactory.java` | Makes parallel execution safe | Creates and tears down one Playwright/Browser/Context/Page per thread using `ThreadLocal` | Called from `BaseTest.setUp()` / `tearDown()` |
| `BasePage.java` | Removes locator duplication | Provides `click`, `fill`, `isVisible`, `waitForVisible` helpers built on `data-testid` | Extended by every page object |
| `LoginPage.java` | Models the login screen | Fills credentials and submits the form | Used by every test, since every flow starts by logging in |
| `DashboardPage.java` | Models the dashboard | Confirms the dashboard loaded, checks summary cards, performs logout | Used by `DashboardTest` and `LogoutTest` |
| `TestCasesPage.java` | Models the Test Cases screen | Navigates to the section, confirms the table is visible and populated | Used by `TestCasesTest` |
| `FormsPage.java` | Models the Forms screen | Navigates to the section, fills mandatory fields, submits | Used by `FormsTest` |
| `BaseTest.java` | Shared test lifecycle | Opens a page before each test, closes it after, captures a screenshot and keeps the trace file only when a test fails | Extended by every test class |
| `LoginTest.java` | Verifies authentication | Logs in and asserts the dashboard loads | — |
| `DashboardTest.java` | Verifies the dashboard | Logs in and asserts the summary cards render | — |
| `TestCasesTest.java` | Verifies the Test Cases table | Logs in, opens Test Cases, asserts the table is visible with rows | — |
| `FormsTest.java` | Verifies form submission | Logs in, opens Forms, fills and submits, asserts the success toast | — |
| `LogoutTest.java` | Verifies session termination | Logs in, logs out, asserts the login form reappears | — |
| `config.properties` | Default configuration | Base URL, browser, headless flag, timeout, demo credentials | Read by `ConfigReader` |
| `junit-platform.properties` | Enables parallel execution | Turns on concurrent execution across test classes and methods | Read automatically by the JUnit Platform |
| `.env` | Local override reference | Documents the environment variables `ConfigReader` understands | Exported into the shell before running Maven locally, or set as `env:` in CI |

## Installation

**Prerequisites:** Java 21, Maven 3.9+, Node.js 20+ (to run the application under test).

```bash
cd automation-framework
mvn -B exec:java@install-playwright-browsers
```

This downloads the Chromium browser binary Playwright drives during tests.

## Run locally

1. Start the application (from the repository root, in a separate terminal):
   ```bash
   npm install
   npm run dev
   ```
   The app serves on `http://localhost:5173`, which matches the default `base.url` in `config.properties`.

2. Run the test suite:
   ```bash
   cd automation-framework
   mvn clean test
   ```

3. To override configuration without editing files:
   ```bash
   mvn clean test -Dbrowser=firefox -Dheadless=false
   ```

## Parallel execution

Parallel execution is enabled through `src/test/resources/junit-platform.properties`:

```properties
junit.jupiter.execution.parallel.enabled=true
junit.jupiter.execution.parallel.mode.default=concurrent
junit.jupiter.execution.parallel.mode.classes.default=concurrent
junit.jupiter.execution.parallel.config.strategy=dynamic
junit.jupiter.execution.parallel.config.dynamic.factor=1
```

The JUnit Platform picks the thread count dynamically based on available processor cores. Because `PlaywrightFactory` stores every Playwright object in a `ThreadLocal`, tests running concurrently never share a browser, context, or page.

## GitHub Actions

`.github/workflows/playwright-tests.yml` runs on every push to any branch:

1. Checks out the repository
2. Builds and starts the application (`npm run build` + `npm run preview`) and waits for it to respond
3. Sets up Java 21 with Maven dependency caching
4. Installs Playwright's Chromium binary
5. Runs `mvn clean test` (tests execute in parallel per the configuration above)
6. Generates the HTML report with `mvn surefire-report:report-only`
7. Uploads the HTML report and, if any test failed, the screenshots and trace files, as workflow artifacts

## View reports

**Locally**, after `mvn clean test`:
```bash
mvn surefire-report:report-only
```
Open `target/site/surefire-report.html` in a browser.

**In CI**, open the workflow run in the **Actions** tab, scroll to **Artifacts**, and download:
- `playwright-html-report` — the HTML test report
- `failure-artifacts` — screenshots and Playwright traces (only present if a test failed)

To inspect a trace file: `npx playwright show-trace path/to/trace.zip`
