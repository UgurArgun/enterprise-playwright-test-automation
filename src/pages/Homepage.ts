import {Page, expect } from "@playwright/test";

export default class HomePage {
  private readonly serviceTitleLocator = "Aloitus | Salesforce";
  constructor(private page: Page) {}

  async expectServiceTitleToBeVisible() {
    await expect(this.page.getByTitle(this.serviceTitleLocator)).toBeVisible({
      timeout: 20000,
    });
  }
};