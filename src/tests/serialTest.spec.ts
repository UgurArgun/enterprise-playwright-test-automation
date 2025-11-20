import { test, Page } from "@playwright/test";
import LoginPage from "../pages/LoginPage";
import logger from "../utils/LoggerUtil";

import ContactPage from "../pages/ContactPage";
import testdata from "../testdata/contactCaseFlow.json";

test.describe.configure({ mode: "serial" });

let page: Page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  logger.info("Browser page initialized for serial tests");
  const loginPage = new LoginPage(page);
  const homePage = await loginPage.quickLogin(
    process.env.userId!,
    process.env.password!
  );
  await homePage.expectServiceTitleToBeVisible();
  logger.info("login is completed");
});

test.skip("Create Contact and Open", async () => {
  const contactpage = new ContactPage(page);
  await contactpage.createNewContact(
    testdata.contactFName,
    testdata.contactLName
  );
  await contactpage.expectContactLabelContainsFirstNameAndLastName(
    testdata.contactFName,
    testdata.contactLName
  );
  await contactpage.findExistingContactByLastName(testdata.contactLName);
});
