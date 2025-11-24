import { test, expect } from "@playwright/test";
import LoginPage from "../pages/LoginPage";

test("Verify Logo Placement and Size", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigateToLoginPage();
  await loginPage.fillUsername(process.env.userId!);
  await loginPage.fillPassword(process.env.password!);
  await loginPage.clickLoginButton();
  const logo = await page.locator(`//div[@class='header item']`);
  await expect(logo).toBeVisible();
  const boundingBox = await logo.boundingBox();
  if (boundingBox) {
    expect(boundingBox.width).toBe(200);
    expect(boundingBox.height).toBe(43);
  }
});

test("Confirm logo Color", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigateToLoginPage();
  await loginPage.fillUsername(process.env.userId!);
  await loginPage.fillPassword(process.env.password!);
  await loginPage.clickLoginButton();
  const logo = await page.locator(`//div[@class='header item']`);
  // Get the computed style of the button
  const logoStyle = await logo.evaluate((element) => {
    const style = window.getComputedStyle(element);
    return {
      color: style.color,
      // Add other styles you want to validate here
    };
  });
  // Assert the background color of the button
  expect(logoStyle.color).toBe("rgb(62, 76, 89)");
  // Replace with your expected background color
});

test.skip("Screenshot compare test", async ({ page }) => {
  await page.goto("/");
  const loginPage = new LoginPage(page);
  await loginPage.fillUsername("demo");
  await expect(page).toHaveScreenshot();
});
