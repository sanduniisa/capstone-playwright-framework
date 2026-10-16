/// <reference types="node" />
import { defineConfig, devices, type ReporterDescription } from "@playwright/test";
import { getEnvironmentUrls } from "./config/environments";
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
const environmentUrls = getEnvironmentUrls();
const reporters: ReporterDescription[] = [
  ["html", { outputFolder: "playwright-report", open: "never" }],
  ["allure-playwright", { resultsDir: "allure-results" }],
];

if (process.env.PLAYWRIGHT_BLOB_REPORT === "true") {
  reporters.push(["blob", { outputDir: "blob-report" }]);
}

if (process.env.PLAYWRIGHT_JSON_REPORT) {
  reporters.push([
    "json",
    { outputFile: process.env.PLAYWRIGHT_JSON_REPORT },
  ]);
}

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
  reporter: reporters,
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
      name: "admin-setup",
      testMatch: "tests/e2e/UI/auth/admin-setup.ts",
      use: {
        baseURL: environmentUrls.sauceDemoUrl,
      },
    },
    {
      name: "user-setup",
      testMatch: "tests/e2e/UI/auth/user-setup.ts",
      use: {
        baseURL: environmentUrls.sauceDemoUrl,
      },
    },
    {
      name: "bank-admin-setup",
      testMatch: "tests/e2e/UI/auth/bank-admin-setup.ts",
      use: {
        baseURL: environmentUrls.parabankUrl,
      },
    },
    {
      name: "admin-tests",
      testMatch: "**/*admin*.spec.ts",
      testIgnore: "**/*bank-admin*.spec.ts",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "playwright/.auth/admin.json",
        baseURL: environmentUrls.sauceDemoUrl,
      },
      dependencies: ["admin-setup"],
    },
    {
      name: "user-tests",
      testMatch: "**/*user*.spec.ts",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "playwright/.auth/user.json",
        baseURL: environmentUrls.sauceDemoUrl,
      },
      dependencies: ["user-setup"],
    },
    {
      name: "login-tests",
      testMatch: "**/*login*.spec.ts",
      use: {
        ...devices["Desktop Chrome"],
        storageState: { cookies: [], origins: [] },
        baseURL: environmentUrls.sauceDemoUrl,
      },
    },
    {
      name: "multi-role-tests",
      testMatch: "**/*multi-role*.spec.ts",
      use: {
        ...devices["Desktop Chrome"],
      },
      dependencies: ["admin-setup", "user-setup"],
    },
    {
      name: "bank-admin-tests",
      testMatch: "**/*bank-admin*.spec.ts",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "playwright/.auth/bank-admin.json",
        baseURL: environmentUrls.parabankUrl,
      },
      dependencies: ["bank-admin-setup"],
    },
    {
      name: "ui-chromium",

      testMatch: [
        "e2e/UI/products/**/*.spec.ts",
        "e2e/UI/checkout/**/*.spec.ts",
      ],

      use: {
        ...devices["Desktop Chrome"],
        baseURL: environmentUrls.sauceDemoUrl,
      },
    },
    {
      name: "mocking",
      testMatch: "tests/e2e/Mocking/**/*.spec.ts",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: environmentUrls.mockingUrl,
      },
    },
    {
      name: "reqres-api",
      testMatch: "tests/e2e/API/reqres/**/*.spec.ts",
      use: {
        baseURL: environmentUrls.reqresApiUrl,

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
      name: "contact-list-api-auth-setup",
      testMatch: "**/contact-list-api-auth.setup.ts",
      use: {
        baseURL: environmentUrls.contactListUrl,
      },
    },
    {
      name: "contact-list-api-auth-tests",
      testMatch: "**/*.api-auth.spec.ts",
      use: {
        baseURL: environmentUrls.contactListUrl,
      },
      dependencies: ["contact-list-api-auth-setup"],
    },
    {
      name: "contact-list-combined",
      testMatch: "tests/e2e/API/herokuapp/**/*.spec.ts",
      testIgnore: "**/*.api-auth.spec.ts",
      use: {
        baseURL: environmentUrls.contactListUrl,
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
