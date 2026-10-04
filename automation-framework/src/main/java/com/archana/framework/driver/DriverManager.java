package com.archana.framework.driver;

import com.archana.framework.factory.BrowserFactory;
import com.microsoft.playwright.Browser;
import com.microsoft.playwright.BrowserContext;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.Playwright;

public class DriverManager {
    private static ThreadLocal<Playwright> playwright = new ThreadLocal<>();
    private static ThreadLocal<Browser> browser = new ThreadLocal<>();
    private static ThreadLocal<BrowserContext> context = new ThreadLocal<>();
    private static ThreadLocal<Page> page = new ThreadLocal<>();

    public static void initialize() {
        playwright.set(BrowserFactory.createPlaywright());
        browser.set(BrowserFactory.createBrowser(playwright.get()));
        context.set(BrowserFactory.createContext(browser.get()));
        page.set(BrowserFactory.createPage(context.get()));

    }

    public static Page getPage() {
        return page.get();
    }

    public static Playwright getPlaywright() {
        return playwright.get();
    }

    public static Browser getBrowser() {
        return browser.get();
    }

    public static BrowserContext getContext() {
        return context.get();
    }

    public static void cleanup() {

        try {
            if (context.get() != null) {
                context.get().close();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        try {
            if (browser.get() != null) {
                browser.get().close();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        try {
            if (playwright.get() != null) {
                playwright.get().close();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        page.remove();
        context.remove();
        browser.remove();
        playwright.remove();
    }
}
