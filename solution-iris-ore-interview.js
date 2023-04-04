// @ts-check
const { test, expect } = require("@playwright/test");

test.describe("Test all scenarios", async () => {
  process.env._IsolateTests = "false";
  test("fill the details - Positive scenario and launc the negative scenario", async ({ browser }) => {
    // Create two isolated browser contexts
    const adminContext = await browser.newContext();
    // Create pages and interact with contexts independently
    const adminPage = await adminContext.newPage();
    const userPage = await adminContext.newPage();
    //launch and check the network response of the failing network request
    await adminPage.bringToFront();
    await adminPage.goto("https://osa-web.t-cg.co.uk ");
    await adminPage.fill(`//input`, "B16 8PE");
    await adminPage.click(`//button`);
    const [response1] = await Promise.all([
      adminPage.waitForResponse(
        (res) =>
          res.status() == 200 &&
          res.url() ==
            "https://pro-fapi-osa.t-cg.co.uk/api/schools/4055/news?markAsRead=false"
      ),
      adminPage.click(
        `//div[@data-testid="activeIcon"]/preceding-sibling::h2//strong[text()="Contact Group"]`
      ),
    ]);
    //log the url and response of the news fiel displays
    console.log(await response1.json());
    console.log(adminPage.url());
    //check whether news is displayed
    expect(await adminPage.locator(`//h1`).innerText()).toBe("News");

    //launch the URL of negative scenario and check the failing response
    await userPage.bringToFront();
    const response2 = await Promise.all([
      userPage.waitForRequest(
        (res) =>
          res.url() ==
          "https://pro-fapi-osa.t-cg.co.uk/api/schools/organisationId/news?markAsRead=false"
      ),
      userPage.goto("https://osa-web.t-cg.co.uk/qatest"),
    ]);
    //log the url and response of the news field displayed or not
    console.log(response2);
    //check whether news is displayed
    expect(await userPage.locator(`//h1`).isVisible()).toBeFalsy();
  });
});
