import {Page, expect } from "@playwright/test";
import logger from "../utils/LoggerUtil";
import ContactPage from "./ContactPage";


export default class HomePage {
  private readonly serviceTitleLocator = "Aloitus | Salesforce";
  private readonly contactsLinkLocator = "Contacts";

  constructor(private page: Page) {}

  async expectServiceTitleToBeVisible() {
    // The app often navigates through a few redirects; checking the document title
    // is more reliable than getByTitle for this flow.
    await this.page.waitForLoadState('load', { timeout: 30000 });
    const title = await this.page.title();
    await expect(title).toContain("Cogmento CRM");
  }



  async navigateToContactTab() {
    await expect(this.page.getByRole('link', { name: this.contactsLinkLocator })).toBeVisible();
    logger.info("Contacts link is visible on Home Page");
    await this.page.getByRole('link', { name: this.contactsLinkLocator }).click();
    logger.info("Navigated to Contact Page from Home Page");
    return new ContactPage(this.page);
  }
}