package com.archana.framework.listeners;

import com.archana.framework.driver.DriverManager;
import com.microsoft.playwright.Page;
import io.qameta.allure.Allure;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.testng.ITestListener;
import org.testng.ITestResult;

import java.io.ByteArrayInputStream;

public class TestListener implements ITestListener {

    private static final Logger logger =
            LogManager.getLogger(TestListener.class);

    @Override
    public void onTestStart(ITestResult result) {

        String testName = result.getName();

        logger.info("Test started: {}", testName);

        Allure.step("Test started: " + testName);
    }

    @Override
    public void onTestSuccess(ITestResult result) {

        String testName = result.getName();

        logger.info("Test passed: {}", testName);

        Allure.step("Test passed: " + testName);
    }

    @Override
    public void onTestFailure(ITestResult result) {

        String testName = result.getName();

        logger.error("Test failed: {}", testName);

        // Attach failure reason
        if (result.getThrowable() != null) {

            Allure.addAttachment(
                    "Failure Reason",
                    "text/plain",
                    result.getThrowable().getMessage()
            );
        }

        // Capture and attach screenshot
        try {

            Page page = DriverManager.getPage();

            if (page == null) {

                logger.error(
                        "Page is null. Cannot capture failure screenshot."
                );

                return;
            }

            byte[] screenshot = page.screenshot(
                    new Page.ScreenshotOptions()
                            .setFullPage(true)
            );

            Allure.addAttachment(
                    "Failure Screenshot",
                    "image/png",
                    new ByteArrayInputStream(screenshot),
                    ".png"
            );

            logger.info(
                    "Failure screenshot attached to Allure: {}",
                    testName
            );

        } catch (Exception e) {

            logger.error(
                    "Failed to capture/attach failure screenshot",
                    e
            );

            Allure.addAttachment(
                    "Screenshot Capture Error",
                    "text/plain",
                    e.getMessage()
            );
        }
    }
}