// Starts only the browser or API resources required by each scenario's tags, then closes them.
import { After, Before, setDefaultTimeout } from "@cucumber/cucumber";
import { PlaywrightWorld } from "./world";

setDefaultTimeout(30_000);

Before({ tags: "@saucedemo" }, async function (this: PlaywrightWorld) {
  await this.startBrowser(this.baseURL);
});

Before({ tags: "@contact-list-ui" }, async function (this: PlaywrightWorld) {
  await this.startBrowser(this.contactListBaseURL);
});

Before({ tags: "@reqres" }, async function (this: PlaywrightWorld) {
  await this.startReqresAPI();
});

Before({ tags: "@contact-list-api" }, async function (this: PlaywrightWorld) {
  await this.startContactListAPI();
});

Before({ tags: "@mocking" }, async function (this: PlaywrightWorld) {
  await this.startMockingBrowser();
});

After(async function (this: PlaywrightWorld) {
  await this.closeBrowser();
});