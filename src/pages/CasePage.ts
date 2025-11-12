import { Page, expect } from "@playwright/test";
import logger from "../utils/LoggerUtil";

export default class CasePage {
  private readonly caseLink = "Cases";
  private readonly newButtonLocator = "//i[@class='add icon']";
  private readonly titleLocator = "Title";
  private readonly typeLocator = "Type - Current Selection";
  private readonly companyLocator = "Company";
  private readonly saveButtonLocator = "Save";
  private readonly contactFullNameLabelLocator = "span.selectable ";

  constructor(private page: Page) {}

  async createNewCaseFromContactDetailPage(
    title: string,
    type: string,
    company: string
  ) {
    await this.page.getByRole("link", { name: this.caseLink }).click();
    await this.page
      .getByLabel(this.caseLink)
      .getByRole("button", { name: this.newButtonLocator })
      .click();
    await this.page.getByLabel(this.titleLocator).fill(title);
    await this.page
      .getByRole("option", { name: this.typeLocator })
      .locator('span:has-text("General Support")')
      .click();
    await this.page.getByLabel(this.companyLocator).fill(company);
    await this.page.getByRole("button", { name: this.saveButtonLocator, exact: true })
      .click();
  }
}