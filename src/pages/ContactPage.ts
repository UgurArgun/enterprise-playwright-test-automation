import { Page, expect } from "@playwright/test";
import logger from "../utils/LoggerUtil";

export default class ContactPage {
  private readonly contactsLink = "Contacts";
  private readonly newContactLink = "Create";
  private readonly firstNameTextFieldLocator = "input[name='first_name']";
  private readonly lastNameTextFieldLocator = "input[name='last_name']";
  private readonly saveButtonLocator = "Save";
  private readonly searchBoxLocator = "Search";
  private readonly contactFullNameLabelLocator = "span.selectable ";
  private readonly contactDisplayNameLocator = "#brandBand_2";

  constructor(private page: Page) {}

  async createNewContact(fname: string, lname: string) {
    await this.page.getByRole("link", { name: this.contactsLink }).click();
    await this.page.getByRole("link", { name: this.newContactLink }).click();
    logger.info("Create button is clicked");

    // Wait for the create form to appear (heading or a known input)
    await expect(this.page.getByText("Create New Contact")).toBeVisible({ timeout: 10000 }).catch(() => {});

    const firstNameField = this.page.locator(this.firstNameTextFieldLocator);
    await expect(firstNameField).toBeVisible({ timeout: 10000 });
    await firstNameField.fill(fname);
    logger.info(`First name is filled as ${fname}`);

    const lastNameField = this.page.locator(this.lastNameTextFieldLocator);
    await expect(lastNameField).toBeVisible({ timeout: 10000 });
    await lastNameField.fill(lname);
    logger.info(`Last name is filled as ${lname}`);
    await this.page
      .getByRole("button", { name: this.saveButtonLocator, exact: true })
      .click()
      .catch((error) => {
        logger.error(`Error clicking Save button: ${error}`);
        throw error; // rethrow the error if needed
      })
      .then(() => logger.info("Save Button is clicked"));
  }

  async expectContactLabelContainsFirstNameAndLastName(
    fname: string,
    lname: string
  ) {
    await expect(
      this.page.locator(this.contactFullNameLabelLocator)
    ).toContainText(`${fname} ${lname}`);
    logger.info(`New contact created and ${fname} ${lname} is visible`);
    await this.page.getByRole("link", { name: this.contactsLink }).click();
  }

  async findExistingContactByLastName(lname: string) {
    await this.page.getByRole("link", { name: this.contactsLink }).click();
    await this.page.getByPlaceholder(this.searchBoxLocator).click();
    await this.page.getByPlaceholder(this.searchBoxLocator).fill(lname);
    await this.page.getByPlaceholder(this.searchBoxLocator).press("Enter");
    await this.page.getByRole("link", { name: lname }).click();
  }
}
