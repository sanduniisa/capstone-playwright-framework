/// <reference types="node" />
import { defineConfig, devices } from "@playwright/test";
import process from "node:process";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
    // Browsers close automatically after each test. Use --headed (or HEADED=true) to watch the run.
    headless: (process.env.HEADED ?? "").toLowerCase() !== "true",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    acceptDownloads: true,
    //navigationTimeout: 15_000,

    //  launchOptions: {
    //   slowMo: process.env.CI ? 0 : 300,
    // },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "ui-chromium",

      testMatch: "tests/UI/**/*.spec.ts",

      use: {
        ...devices["Desktop Chrome"],
        baseURL:
          process.env.SAUCEDEMO_URL ??
          process.env.sauceDemoUrl ??
          "https://www.saucedemo.com/",
      },
    },
    {
      name: "reqres-api",
      testMatch: "tests/API/reqres/**/*.spec.ts",
      use: {
        baseURL:
          process.env.REQRES_API_URL ??
          process.env.reqresApiUrl ??
          "https://reqres.in/api/",

        extraHTTPHeaders: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-api-key":
            process.env.REQRES_API_KEY ??
            "free_user_3E75Ai3rComzXI0NWpSXIL6LG7b"
            //"free_user_3JDDiT5EEztSZkknbviA6LSqfH3",
        },
        ...devices["Desktop Chrome"],
      },
    },
    {
      name: "contact-list-combined",
      testMatch: "tests/API/herokuapp/**/*.spec.ts",
      use: {
        baseURL:
          process.env.CONTACT_LIST_URL ??
          "https://thinking-tester-contact-list.herokuapp.com",
        ...devices["Desktop Chrome"],
      },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
