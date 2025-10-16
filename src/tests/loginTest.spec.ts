import {test} from "@playwright/test";
import LoginPage from "../pages/LoginPage";

test("test login to salesforce", async ({page}) => {
  const loginPage = new LoginPage(page);

  await loginPage.navigateToLoginPage();
  await loginPage.fillUsername("sarpercaglayan16-sud1@force.com");
  await loginPage.fillPassword("Ua952098!");

  const homePage = await loginPage.clickLoginButton();
  await homePage.expectServiceTitleToBeVisible();   

});
