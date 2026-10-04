package com.archana.framework.utilities;

import com.microsoft.playwright.Page;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public class ScreenshotUtility {

    private ScreenshotUtility() {
    }

    public static String captureScreenshot(Page page, String testName) {

        try {
            Path screenshotDirectory = Paths.get("screenshots");

            Files.createDirectories(screenshotDirectory);

            String fileName = testName + "_" + System.currentTimeMillis() + ".png";

            Path screenshotPath = screenshotDirectory.resolve(fileName);

            page.screenshot(
                    new Page.ScreenshotOptions()
                            .setPath(screenshotPath)
                            .setFullPage(true)
            );

            return screenshotPath.toString();

        } catch (Exception e) {
            throw new RuntimeException("Failed to capture screenshot", e);
        }
    }
}