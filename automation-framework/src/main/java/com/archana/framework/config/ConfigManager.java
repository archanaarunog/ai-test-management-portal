package com.archana.framework.config;

import com.archana.framework.constants.ConfigKeys;
import com.archana.framework.constants.FrameworkConstants;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class ConfigManager {
    private static ConfigManager instance;
    private final Properties properties;

    private ConfigManager(){
        properties = new Properties();
        try(InputStream inputStream = getClass().getClassLoader().getResourceAsStream(FrameworkConstants.CONFIG_FILE)){
            if (inputStream == null){
                throw new RuntimeException("Config file not found.");
            }
            properties.load(inputStream);
        } catch (IOException e) {
            throw new RuntimeException("Failed to load config.properties",e);
        }
    }

    public static ConfigManager getInstance(){
        if (instance==null){
            instance = new ConfigManager();
        }
        return instance;
    }

    public String getProperty(String key){
        return properties.getProperty(key);
    }

    public String getBrowser(){
        return properties.getProperty(ConfigKeys.BROWSER);
    }
    public String getBaseUrl(){
        return properties.getProperty(ConfigKeys.BASE_URL);
    }
    public boolean isHeadless(){
        return Boolean.parseBoolean(properties.getProperty(ConfigKeys.HEADLESS));
    }
    public int getTimeout(){
        return Integer.parseInt(properties.getProperty(ConfigKeys.TIMEOUT));
    }
    public int getSlowMo(){
        return Integer.parseInt(properties.getProperty(ConfigKeys.SLOW_MO));
    }
}
