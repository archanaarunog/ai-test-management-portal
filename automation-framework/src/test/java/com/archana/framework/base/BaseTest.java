package com.archana.framework.base;

import com.archana.framework.driver.DriverManager;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;

public class BaseTest {

    @BeforeMethod
    public void setUp() {
        System.out.println(
                "START: " + Thread.currentThread().getName()
        );
        DriverManager.initialize();
    }
    @AfterMethod
    public void tearDown(){
        System.out.println(
                "END: " + Thread.currentThread().getName()
        );
        DriverManager.cleanup();

    }
}
