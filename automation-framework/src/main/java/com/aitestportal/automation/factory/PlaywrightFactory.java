package com.aitestportal.automation.factory;

import com.aitestportal.automation.config.ConfigReader;
import com.microsoft.playwright.Browser;
import com.microsoft.playwright.BrowserContext;
import com.microsoft.playwright.BrowserType;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.Playwright;
import com.microsoft.playwright.Tracing;

/**
 * Creates and tears down one Playwright / Browser / BrowserContext / Page per
 * test thread. Everything is stored in a ThreadLocal so that tests running in
 * parallel (see junit-platform.properties) never share a browser instance.
 */
public final class PlaywrightFactory {

    private static final ThreadLocal<Playwright> PLAYWRIGHT = new ThreadLocal<>();
    private static final ThreadLocal<Browser> BROWSER = new ThreadLocal<>();
    private static final ThreadLocal<BrowserContext> CONTEXT = new ThreadLocal<>();
    private static final ThreadLocal<Page> PAGE = new ThreadLocal<>();

    private PlaywrightFactory() {
    }

    public static Page createPage() {
        Playwright playwright = Playwright.create();
        PLAYWRIGHT.set(playwright);

        Browser browser = launchBrowser(playwright);
        BROWSER.set(browser);

        BrowserContext context = browser.newContext(new Browser.NewContextOptions()
                .setViewportSize(1440, 900));
        context.setDefaultTimeout(ConfigReader.getDefaultTimeout());
        context.tracing().start(new Tracing.StartOptions()
                .setScreenshots(true)
                .setSnapshots(true)
                .setSources(true));
        CONTEXT.set(context);

        Page page = context.newPage();
        PAGE.set(page);

        return page;
    }

    private static Browser launchBrowser(Playwright playwright) {
        BrowserType.LaunchOptions options = new BrowserType.LaunchOptions()
                .setHeadless(ConfigReader.isHeadless());

        return switch (ConfigReader.getBrowser().toLowerCase()) {
            case "firefox" -> playwright.firefox().launch(options);
            case "webkit" -> playwright.webkit().launch(options);
            default -> playwright.chromium().launch(options);
        };
    }

    public static Page getPage() {
        return PAGE.get();
    }

    public static BrowserContext getContext() {
        return CONTEXT.get();
    }

    public static void tearDown() {
        try {
            if (CONTEXT.get() != null) {
                CONTEXT.get().close();
            }
            if (BROWSER.get() != null) {
                BROWSER.get().close();
            }
            if (PLAYWRIGHT.get() != null) {
                PLAYWRIGHT.get().close();
            }
        } finally {
            PAGE.remove();
            CONTEXT.remove();
            BROWSER.remove();
            PLAYWRIGHT.remove();
        }
    }
}
