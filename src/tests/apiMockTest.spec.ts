import { test, expect } from "@playwright/test";
import logger from "../utils/LoggerUtil";

test("API Monitoring test", async ({ page }) => {
  page.on("request", (request) => {
    logger.info(`Requested Url is ${request.url()}`);
    logger.info(`Requested method is ${request.method()}`);
    logger.info(
      `Request headers is ${JSON.stringify(request.headers(), null, 2)}`
    );
  });

  page.on("response", (response) => {
    logger.info(`Response status is ${response.status()}`);
  });

  await page.goto("/");
});

test.skip("API Intercepting test", async ({ page }) => {
  // Intercept all requests, but only modify API requests
  await page.route("**/*", (route) => {
    if (route.request().url().includes("/api/")) {
      const headers = { ...route.request().headers(), "X-Custom-Header": "integration-check" };
      console.log(headers);
      route.continue({ headers });
    } else {
      route.continue();
    }
  });

  page.on("request", (request) => {
    logger.info(
      `Modified Request headers is ${JSON.stringify(request.headers(), null, 2)}
         Modified Request type is ${request.method()}`
    );
  });

  await page.goto("/");
  await page.waitForLoadState("networkidle");
});

test("API Mocking test", async ({ page }) => {
  page.route(
    "https://demo.playwright.dev/api-mocking/api/v1/fruits",
    async (route) => {
      const json = [
        { name: "Mandarin", id: 3 },
        { name: "Tangerine", id: 1 },
        { name: "Clementines", id: 5 },
      ];

      await route.fulfill({ json });
    }
  );

  await page.goto("https://demo.playwright.dev/api-mocking/");
  await page.waitForLoadState("networkidle");
});
