import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { test as setup } from "../../../../../fixtures/api-fixtures";
import { registerAndLogin } from "../../../../../src/utils/contactListTestHelpers";

const apiAuthStateFile = resolve(
  process.cwd(),
  "playwright/.auth/contact-list-api-user.json",
);

setup("save Contact List API authentication state", async ({ contactAPI }) => {
  const { auth } = await registerAndLogin(contactAPI, "API_AUTH_SETUP");

  await mkdir(resolve(process.cwd(), "playwright/.auth"), { recursive: true });
  await writeFile(
    apiAuthStateFile,
    JSON.stringify({ token: auth.token }, null, 2),
    "utf8",
  );
});