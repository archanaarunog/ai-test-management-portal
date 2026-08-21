package com.aitestportal.automation.base;

import com.aitestportal.automation.config.ConfigReader;
import com.aitestportal.automation.constants.Constants;
import com.aitestportal.automation.factory.PlaywrightFactory;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.Tracing;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.TestInfo;
import org.junit.jupiter.api.extension.ExtensionContext;
import org.junit.jupiter.api.extension.TestExecutionExceptionHandler;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public class BaseTest implements TestExecutionExceptionHandler {

    protected Page page;

    private static final ThreadLocal<Boolean> TEST_FAILED = ThreadLocal.withInitial(() -> false);

    @BeforeEach
    void setUp() throws IOException {
        Files.createDirectories(Paths.get(Constants.SCREENSHOTS_DIR));
        Files.createDirectories(Paths.get(Constants.TRACES_DIR));

        page = PlaywrightFactory.createPage();
        page.navigate(ConfigReader.getBaseUrl());
    }

    @AfterEach
    void tearDown(TestInfo testInfo) {
        Path tracePath = Paths.get(Constants.TRACES_DIR, sanitize(testInfo.getDisplayName()) + ".zip");

        try {
            PlaywrightFactory.getContext().tracing().stop(new Tracing.StopOptions().setPath(tracePath));
        } catch (Exception ignored) {
            // Context may already be closed in rare teardown-ordering edge cases.
        }

        PlaywrightFactory.tearDown();

        if (!TEST_FAILED.get()) {
            deleteQuietly(tracePath);
        }
        TEST_FAILED.remove();
    }

    @Override
    public void handleTestExecutionException(ExtensionContext context, Throwable throwable) throws Throwable {
        TEST_FAILED.set(true);
        captureScreenshot(sanitize(context.getDisplayName()));
        throw throwable;
    }

    private void captureScreenshot(String testName) {
        Page currentPage = PlaywrightFactory.getPage();
        if (currentPage == null) {
            return;
        }
        Path screenshotPath = Paths.get(Constants.SCREENSHOTS_DIR, testName + ".png");
        try {
            currentPage.screenshot(new Page.ScreenshotOptions()
                    .setPath(screenshotPath)
                    .setFullPage(true));
        } catch (Exception e) {
            System.err.println("Could not capture screenshot for " + testName + ": " + e.getMessage());
        }
    }

    private void deleteQuietly(Path path) {
        try {
            Files.deleteIfExists(path);
        } catch (IOException ignored) {
        }
    }

    private String sanitize(String name) {
        return name.replaceAll("[^a-zA-Z0-9-_]", "_");
    }
}