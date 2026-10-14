import process from "node:process";

export type TestEnvironment = "qa" | "stg" | "prod";

export interface EnvironmentUrls {
  sauceDemoUrl: string;
  parabankUrl: string;
  contactListUrl: string;
  reqresApiUrl: string;
  mockingUrl: string;
}

const DEFAULT_URLS: EnvironmentUrls = {
  sauceDemoUrl: "https://www.saucedemo.com/",
  parabankUrl: "https://parabank.parasoft.com/parabank/",
  contactListUrl: "https://thinking-tester-contact-list.herokuapp.com",
  reqresApiUrl: "https://reqres.in/api/",
  mockingUrl: "https://demo.playwright.dev/api-mocking/",
};

function resolveUrl(primaryKey: string, sharedKey: string, fallback: string): string {
  return process.env[primaryKey] ?? process.env[sharedKey] ?? fallback;
}

const ENVIRONMENT_URLS: Record<TestEnvironment, EnvironmentUrls> = {
  qa: {
    sauceDemoUrl: resolveUrl("QA_SAUCEDEMO_URL", "SAUCEDEMO_URL", DEFAULT_URLS.sauceDemoUrl),
    parabankUrl: resolveUrl("QA_PARABANK_URL", "PARABANK_URL", DEFAULT_URLS.parabankUrl),
    contactListUrl: resolveUrl(
      "QA_CONTACT_LIST_URL",
      "CONTACT_LIST_URL",
      DEFAULT_URLS.contactListUrl,
    ),
    reqresApiUrl: resolveUrl("QA_REQRES_API_URL", "REQRES_API_URL", DEFAULT_URLS.reqresApiUrl),
    mockingUrl: resolveUrl("QA_MOCKING_URL", "MOCKING_URL", DEFAULT_URLS.mockingUrl),
  },
  stg: {
    sauceDemoUrl: resolveUrl("STG_SAUCEDEMO_URL", "SAUCEDEMO_URL", DEFAULT_URLS.sauceDemoUrl),
    parabankUrl: resolveUrl("STG_PARABANK_URL", "PARABANK_URL", DEFAULT_URLS.parabankUrl),
    contactListUrl: resolveUrl(
      "STG_CONTACT_LIST_URL",
      "CONTACT_LIST_URL",
      DEFAULT_URLS.contactListUrl,
    ),
    reqresApiUrl: resolveUrl(
      "STG_REQRES_API_URL",
      "REQRES_API_URL",
      DEFAULT_URLS.reqresApiUrl,
    ),
    mockingUrl: resolveUrl("STG_MOCKING_URL", "MOCKING_URL", DEFAULT_URLS.mockingUrl),
  },
  prod: {
    sauceDemoUrl: resolveUrl(
      "PROD_SAUCEDEMO_URL",
      "SAUCEDEMO_URL",
      DEFAULT_URLS.sauceDemoUrl,
    ),
    parabankUrl: resolveUrl("PROD_PARABANK_URL", "PARABANK_URL", DEFAULT_URLS.parabankUrl),
    contactListUrl: resolveUrl(
      "PROD_CONTACT_LIST_URL",
      "CONTACT_LIST_URL",
      DEFAULT_URLS.contactListUrl,
    ),
    reqresApiUrl: resolveUrl(
      "PROD_REQRES_API_URL",
      "REQRES_API_URL",
      DEFAULT_URLS.reqresApiUrl,
    ),
    mockingUrl: resolveUrl("PROD_MOCKING_URL", "MOCKING_URL", DEFAULT_URLS.mockingUrl),
  },
};

export function resolveTestEnvironment(rawEnvironment = process.env.TEST_ENV): TestEnvironment {
  if (
    rawEnvironment === "qa" ||
    rawEnvironment === "stg" ||
    rawEnvironment === "prod"
  ) {
    return rawEnvironment;
  }

  return "qa";
}

export function getEnvironmentUrls(rawEnvironment = process.env.TEST_ENV): EnvironmentUrls {
  return ENVIRONMENT_URLS[resolveTestEnvironment(rawEnvironment)];
}