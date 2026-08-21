package com.aitestportal.automation.config;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

/**
 * Resolves configuration values in this order of priority:
 *   1. JVM system property (-Dbrowser=firefox)
 *   2. Environment variable (BROWSER=firefox)
 *   3. src/test/resources/config.properties
 *   4. Hard-coded default
 *
 * This lets the same properties file drive local runs, while CI or a
 * developer's shell can override any single value without editing code.
 */
public final class ConfigReader {

    private static final Properties PROPERTIES = new Properties();

    static {
        try (InputStream input = ConfigReader.class.getClassLoader()
                .getResourceAsStream("config.properties")) {
            if (input != null) {
                PROPERTIES.load(input);
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to load config.properties", e);
        }
    }

    private ConfigReader() {
    }

    private static String resolve(String propertyKey, String envKey, String defaultValue) {
        String systemValue = System.getProperty(propertyKey);
        if (systemValue != null && !systemValue.isBlank()) {
            return systemValue;
        }
        String envValue = System.getenv(envKey);
        if (envValue != null && !envValue.isBlank()) {
            return envValue;
        }
        return PROPERTIES.getProperty(propertyKey, defaultValue);
    }

    public static String getBaseUrl() {
        return resolve("base.url", "BASE_URL", "http://localhost:5173");
    }

    public static String getBrowser() {
        return resolve("browser", "BROWSER", "chromium");
    }

    public static boolean isHeadless() {
        return Boolean.parseBoolean(resolve("headless", "HEADLESS", "true"));
    }

    public static int getDefaultTimeout() {
        return Integer.parseInt(resolve("default.timeout", "DEFAULT_TIMEOUT", "30000"));
    }

    public static String getUsername() {
        return resolve("app.username", "APP_USERNAME", "achu.nair@aitestportal.dev");
    }

    public static String getPassword() {
        return resolve("app.password", "APP_PASSWORD", "Automate@123");
    }
}
