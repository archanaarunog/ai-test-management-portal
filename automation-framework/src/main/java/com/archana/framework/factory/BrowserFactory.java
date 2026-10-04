package com.archana.framework.factory;

import com.archana.framework.config.ConfigManager;
import com.microsoft.playwright.*;

import java.util.List;

public class BrowserFactory {
    private BrowserFactory(){
    }

    public static Playwright createPlaywright() {
        return Playwright.create();
    }

    public static Browser createBrowser(Playwright playwright){
        ConfigManager config = ConfigManager.getInstance();

        BrowserType.LaunchOptions options = new BrowserType.LaunchOptions()
                .setHeadless(config.isHeadless())
                .setSlowMo(config.getSlowMo())
                .setArgs(List.of("--start-maximized"));

        return switch (config.getBrowser().toLowerCase()){
            case "chromium" -> playwright.chromium().launch(options);

            case "firefox" -> playwright.firefox().launch(options);

            default -> throw new IllegalArgumentException(
                    "Unsupported browser: " + config.getBrowser()
            );
        };

    }

    public static BrowserContext createContext(Browser browser){
        ConfigManager config = ConfigManager.getInstance();

        return browser.newContext(
                new Browser.NewContextOptions().setBaseURL(config.getBaseUrl()).setViewportSize(1440, 900));
    }

    public static Page createPage(BrowserContext context){
        return context.newPage();
    }
    
}
