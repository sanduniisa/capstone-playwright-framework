import { test } from "../../../../fixtures/api-fixtures";
import { contactListScenarios } from "../../../../test-data/combined/contact-list-scenarios";

/**
 * Same-application API + UI scenarios.
 * The API and UI both use the Contact List App, so API-created data can be
 * verified through the browser and UI-created data can be read through API.
 */
test.describe("Contact List API and UI scenarios", () => {
  for (const scenario of contactListScenarios) {
    test(`${scenario.id} ${scenario.description}`, async ({ contactAPI, page }) => {
      await scenario.run({ contactAPI, page });
    });
  }
});

