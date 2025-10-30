import {test} from "@playwright/test";
import LoginPage from "../pages/LoginPage";

test("test login to Cogmento CRM", async ({page}) => {
  const loginPage = new LoginPage(page);

  await loginPage.navigateToLoginPage();
  //await loginPage.fillUsername("sarpercaglayan16@gmail.com");
  //await loginPage.fillPassword("Jale2013");

  await loginPage.fillUsername(process.env.userId!);
  await loginPage.fillPassword(process.env.password!);

  const homePage = await loginPage.clickLoginButton();
  await homePage.expectServiceTitleToBeVisible();
});

test("sample env test", async ({page}) => {
  console.log("env: " + process.env.NODE_ENV);
  console.log("userId: " + process.env.userId);
  console.log("password: " + process.env.password);
});


  import { encryptEnvFile } from "../utils/EncryptEnvFile";
  import { decrypt, encrypt } from "../utils/CryptojsUtil";
 test("Sample env test", async ({ }) => {
    const plaintext = 'Hello, Mars!';
    const encryptedText = encrypt("myplaywright909");
    console.log('SALT:', process.env.SALT);
    console.log('Encrypted:', encryptedText);
    const decryptedText = decrypt(encryptedText);
    console.log('Decrypted:', decryptedText);
    //encryptEnvFile();
    //console.log(decrypt("U2FsdGVkX197mBdFhci0yNUxOudsGfcL4w5q9pV2n18JctWJ3ya5USIkbuPXjyd8"));
  });
  
