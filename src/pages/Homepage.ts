import {Page, expect } from "@playwright/test";

export default class HomePage {
  private readonly serviceTitleLocator = "Aloitus | Salesforce";
  constructor(private page: Page) {}

  async expectServiceTitleToBeVisible() {
    // The app often navigates through a few redirects; checking the document title
    // is more reliable than getByTitle for this flow.
    await this.page.waitForLoadState('load', { timeout: 30000 });
    const title = await this.page.title();
    await expect(title).toContain('Salesforce');
  }
};