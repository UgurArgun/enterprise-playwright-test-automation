import { Page, expect } from "@playwright/test";
import HomePage from "./HomePage";
import logger from "../utils/LoggerUtil";
import findValidElement from "../utils/SelfHealingUtil";

export default class LoginPage {
  private readonly usernameInputSelector = "input[name='email']";
  private readonly usernameInputSelectors = [
    "input[placeholder='Email']",
    "input[name='email']",
  ];
  private readonly passwordInputSelector = "input[name='password']";
  private readonly loginButtonSelector = ".ui.fluid.large.blue.submit.button";

  constructor(private page: Page) {}

  async quickLogin(username: string, password: string) {
    await this.navigateToLoginPage();
    await this.fillUsername(username);
    await this.fillPassword(password);
    return await this.clickLoginButton();
  }

  async navigateToLoginPage() {
    await this.page.goto("https://ui.cogmento.com");
    logger.info("Navigated to Login Page");
  }

  async fillUsername(username: string) {
    await this.page.locator(this.usernameInputSelector).fill(username);
    logger.info(`Filled username: ${username}`);
  }

  async fillUsername_selfheal(username: string) {
    let usernameInputLocator = await findValidElement(
      this.page,
      this.usernameInputSelectors
    );
    await usernameInputLocator?.fill(username);
    const enteredValue = await usernameInputLocator?.inputValue();
    expect(enteredValue).toBe(username);
  }
  async fillPassword(password: string) {
    await this.page.locator(this.passwordInputSelector).fill(password);
    logger.info(`Filled password: ********`);
  }

  async clickLoginButton() {
    // Click and wait for navigation to ensure we're on the home page
    // Wait for the login form and button to be visible
    await expect(this.page.locator("form")).toBeVisible({ timeout: 10000 });
    const loginButton = this.page.locator(
      "div.ui.fluid.large.blue.submit.button",
      { hasText: "Login" }
    );
    await expect(loginButton).toBeVisible({ timeout: 10000 });
    await loginButton.click();

    // Wait for dashboard or contacts link
    await Promise.race([
      this.page.waitForURL(/(home|dashboard|contacts)/, { timeout: 20000 }),
      this.page
        .getByRole("link", { name: /Contacts/i })
        .waitFor({ state: "visible", timeout: 20000 }),
    ]);

    logger.info("Clicked login and navigation finished");

    const homePage = new HomePage(this.page);
    return homePage;
  }
}
