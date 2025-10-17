import { Page, expect } from "@playwright/test";
import HomePage from "./HomePage";
import logger from "../utils/LoggerUtil";


export default class LoginPage {
  private readonly usernameInputSelector = "#username";
  private readonly usernameInputSelectors = [
    "#username",
    'input[name="username"]',
    ".username",
    "//*[@id='username']",
  ];
  private readonly passwordInputSelector = "#password";
  private readonly loginButtonSelector = "#Login";

  constructor(private page: Page) {}

  async quickLogin(username: string, password: string) {
    await this.navigateToLoginPage();
    await this.fillUsername(username);
    await this.fillPassword(password);
    return await this.clickLoginButton();
  }

  async navigateToLoginPage() {
    await this.page.goto("https://login.salesforce.com");
    logger.info("Navigated to Login Page");
  }

  async fillUsername(username: string) {
    await this.page.locator(this.usernameInputSelector).fill(username);
    logger.info(`Filled username: ${username}`);
  }

  

  async fillPassword(password: string) {
    await this.page.locator(this.passwordInputSelector).fill(password);
    logger.info(`Filled password: ********`);
  }

  async clickLoginButton() {
    // Click and wait for navigation to ensure we're on the home page
    await Promise.all([
      this.page.waitForNavigation({ waitUntil: 'load', timeout: 30000 }),
      this.page.locator(this.loginButtonSelector).click().catch((error) => {
        logger.error(`Error clicking Login button: ${error}`);
        throw error;
      }),
    ]);

    logger.info("Clicked login and navigation finished");

    const homePage = new HomePage(this.page);
    return homePage;
  }
}
