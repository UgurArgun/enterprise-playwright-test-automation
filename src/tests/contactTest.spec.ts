import { test, expect } from "@playwright/test";
import LoginPage from "../pages/LoginPage";
import ContactPage from "../pages/ContactPage";
import { decrypt } from "../utils/CryptojsUtil";
import logger from "../utils/LoggerUtil";


test("simple DD test", async ({ page }) => {
  logger.info("Test for Contact Creation is started...");
  const fname = "Esra";
  const lname = "Abdullah";
  const loginPage = new LoginPage(page);
  const browserSetup = {
    headless: false,
    slowMo: 20000,
  };
  await loginPage.navigateToLoginPage();
  await loginPage.fillUsername(process.env.userId!);
  await loginPage.fillPassword(process.env.password!);

  const homePage = await loginPage.clickLoginButton();
  await homePage.expectServiceTitleToBeVisible();
  const contactsPage = await homePage.navigateToContactTab();
  await contactsPage.createNewContact(fname, lname);
  await contactsPage.expectContactLabelContainsFirstNameAndLastName(
    fname,
    lname
  );
  logger.info("Test for Contact Creation is completed");
});