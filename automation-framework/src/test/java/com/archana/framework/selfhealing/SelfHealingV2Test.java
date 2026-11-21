package com.archana.framework.selfhealing;

import com.microsoft.playwright.*;
import org.testng.Assert;
import org.testng.annotations.*;

/** Local controlled DOM fixtures; no SUT, network, or external service is used. */
public class SelfHealingV2Test {
    private static Playwright playwright;
    private static Browser browser;
    private Page page;
    private final ElementFingerprint baseline=ElementFingerprint.builder().tag("button").id("target-id")
            .name("target-name").text("Continue to account").type("submit").placeholder("continue")
            .ariaLabel("Continue to account").role("button").title("Continue")
            .testId("target-test-id").classes("primary action rounded").parent("form account-panel")
            .build();

    @BeforeClass public void startBrowser(){playwright=Playwright.create();BrowserType.LaunchOptions options=new BrowserType.LaunchOptions().setHeadless(true);String executable=System.getProperty("selfhealing.chromium.path");if(executable!=null&&!executable.isBlank())options.setExecutablePath(java.nio.file.Path.of(executable));browser=playwright.chromium().launch(options);}
    @AfterClass public void stopBrowser(){if(browser!=null)browser.close();if(playwright!=null)playwright.close();}
    @BeforeMethod public void newPage(){page=browser.newPage();}
    @AfterMethod public void closePage(){if(page!=null)page.close();}

    @Test public void originalLocatorWorksWithoutHealing(){page.setContent(button("target-id","target-name","target-test-id","primary action rounded","Continue to account",false,false));HealingResult r=engine().healWithResult("#target-id",baseline,HealingAction.CLICK);Assert.assertEquals(r.status(),HealingResult.Status.ORIGINAL_FOUND);}
    @Test public void changedIdIsRecovered(){assertHealed(button("new-id","target-name","target-test-id","primary action rounded","Continue to account",false,false));}
    @Test public void changedClassIsRecovered(){assertHealed(".primary",button("target-id","target-name","target-test-id","new different tokens","Continue to account",false,false));}
    @Test public void changedNameIsRecovered(){assertHealed("[name='target-name']",button("target-id","new-name","target-test-id","primary action rounded","Continue to account",false,false));}
    @Test public void changedTestIdIsRecovered(){assertHealed("[data-testid='target-test-id']",button("target-id","target-name","new-test-id","primary action rounded","Continue to account",false,false));}
    @Test public void multipleChangedAttributesAreRecovered(){assertHealed(button("new-id","new-name","new-test-id","primary action rounded","Continue to account",false,false));}
    @Test public void normalizedTextSimilarityRecoversUniqueCandidate(){assertHealed(button("new-id","target-name","new-test-id","primary action rounded","Continue to accounts",false,false));}
    @Test public void duplicateHighConfidenceCandidatesAreRejectedAsAmbiguous(){page.setContent(button("new-id","target-name","new-test-id","primary action rounded","Continue to account",false,false)+button("new-id-2","target-name","new-test-id-2","primary action rounded","Continue to account",false,false));HealingResult r=engine().healWithResult("#target-id",baseline,HealingAction.CLICK);Assert.assertEquals(r.status(),HealingResult.Status.REJECTED);Assert.assertTrue(r.reason().toLowerCase().contains("ambiguous"));}
    @Test public void lowConfidenceCandidateIsRejected(){page.setContent("<button id='unrelated' name='other' data-testid='other' class='plain' type='button' aria-label='Cancel'>Cancel</button>");HealingResult r=engine().healWithResult("#target-id",baseline,HealingAction.CLICK);Assert.assertEquals(r.status(),HealingResult.Status.REJECTED);Assert.assertTrue(r.confidence()<.70);}
    @Test public void hiddenCandidateIsRejected(){page.setContent(button("target-id","target-name","target-test-id","primary action rounded","Continue to account",true,false));HealingResult r=engine().healWithResult("#missing",baseline,HealingAction.CLICK);Assert.assertEquals(r.status(),HealingResult.Status.REJECTED);Assert.assertTrue(r.reason().contains("visibility"));}
    @Test public void disabledCandidateIsRejectedForClick(){page.setContent(button("target-id","target-name","target-test-id","primary action rounded","Continue to account",false,true));HealingResult r=engine().healWithResult("#missing",baseline,HealingAction.CLICK);Assert.assertEquals(r.status(),HealingResult.Status.REJECTED);Assert.assertTrue(r.reason().contains("visibility"));}
    @Test public void noCandidatesIsRejected(){page.setContent("<p>Nothing interactive</p>");HealingResult r=engine().healWithResult("#missing",baseline,HealingAction.CLICK);Assert.assertEquals(r.status(),HealingResult.Status.REJECTED);Assert.assertEquals(r.candidateCount(),0);}
    @Test public void rankedCandidateSelectsUniqueHighConfidenceMatch(){page.setContent("<button id='noise' type='button'>Cancel</button>"+button("new-id","target-name","target-test-id","primary action rounded","Continue to account",false,false));HealingResult r=engine().healWithResult("#target-id",baseline,HealingAction.CLICK);Assert.assertEquals(r.status(),HealingResult.Status.HEALED);Assert.assertEquals(r.selectedCandidate().rank(),1);Assert.assertTrue(r.confidence()>=.85);Assert.assertEquals(r.recoveredLocator().getAttribute("id"),"new-id");}

    private HealingEngine engine(){return new HealingEngine(page);}
    private void assertHealed(String html){assertHealed("#target-id",html);}
    private void assertHealed(String selector,String html){page.setContent(html);HealingResult r=engine().healWithResult(selector,baseline,HealingAction.CLICK);Assert.assertEquals(r.status(),HealingResult.Status.HEALED,r.reason());Assert.assertEquals(r.selectedCandidate().rank(),1);Assert.assertTrue(r.confidence()>=.85);}
    private String button(String id,String name,String testId,String classes,String text,boolean hidden,boolean disabled){return "<form id='account-panel'><button id='"+id+"' name='"+name+"' data-testid='"+testId+"' class='"+classes+"' type='submit' aria-label='Continue to account' title='Continue'"+(hidden?" style='display:none'":"")+(disabled?" disabled":"")+">"+text+"</button></form>";}
}
