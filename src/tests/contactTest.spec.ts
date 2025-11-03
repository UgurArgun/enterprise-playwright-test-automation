import { test, expect } from "@playwright/test";
import LoginPage from "../pages/LoginPage";
import ContactPage from "../pages/ContactPage";
import { decrypt } from "../utils/CryptojsUtil";
import logger from "../utils/LoggerUtil";
import cdata from "../testdata/contact.json"
import { convertCsvFileToJsonFile } from "../utils/CsvtoJsonUtil";
import { getDemoOutput } from "../utils/fakerSample";
import { exportToCsv, exportToJson, generateTestData } from "../utils/FakerDataUtil";


for (const contact of cdata) {
  test.skip(`Advance DD test for ${contact.firstName} `, async ({ page }) => {
    logger.info("Test for Contact Creation is started...");
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
    await contactsPage.createNewContact(contact.firstName, contact.lastName);
    await contactsPage.expectContactLabelContainsFirstNameAndLastName(
      contact.firstName,
      contact.lastName
    );
    logger.info("Test for Contact Creation is completed");
  });
} 

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

test.skip("csv to json", async () => {
  convertCsvFileToJsonFile("data.csv", "datademo.json");
});

test.skip("demo faker", async () => {
  console.log(await getDemoOutput());
});

test.skip("Faker", async ({ page }) => {
  // Generate test data
  const testData = await generateTestData(20);

  // Export data to JSON file
  exportToJson(testData, "testData_en.json");

  // Export data to CSV file
  exportToCsv(testData, "testData_en.csv");
});