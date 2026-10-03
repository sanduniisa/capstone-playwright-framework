// import { test, expect } from "../../../../fixtures/api-fixtures";
// import { HttpStatusCodes } from "../../../src/api/HttpStatusCodes";
// import {
//   CreateUserResponse,
//   SingleUserResponse,
//   UserListResponse,
// } from "../../../src/api/UsersAPI";
// import { LoginPage } from "../../../src/ui/pages";

// const SAUCEDEMO_URL = "https://www.saucedemo.com/";
// const SAUCEDEMO_USER = "standard_user";
// const SAUCEDEMO_PASSWORD = "secret_sauce";

// /**
//  * Combined API + UI scenarios.
//  *
//  * ReqRes and SauceDemo are separate demo systems, so these tests validate
//  * both systems in one workflow without claiming that they share data.
//  */
// test.describe("Combined API and UI scenarios", () => {
//   test("TC027 API user lookup and UI login", async ({ usersAPI, page }) => {
//     // API step: verify that the backend user endpoint is available.
//     const apiResponse = await usersAPI.getUserById(2);

//     expect(apiResponse.status()).toBe(HttpStatusCodes.OK);
//     expect(apiResponse.ok()).toBe(true);

//     const apiUser = await usersAPI.getResponseBody<SingleUserResponse>(apiResponse);

//     expect(apiUser.data.id).toBe(2);
//     expect(apiUser.data.email).toMatch(/^[^@\s]+@[^@\s]+\.[^@\s]+$/);

//     // UI step: authenticate and verify the application opens the inventory.
//     const loginPage = new LoginPage(page);
//     await page.goto(SAUCEDEMO_URL);
//     const inventoryPage = await loginPage.login(
//       SAUCEDEMO_USER,
//       SAUCEDEMO_PASSWORD,
//     );

//     await expect(page).toHaveURL(/inventory\.html/);
//     await inventoryPage.verifyInventoryPage();
//   });

//   test("TC028 API user list and UI inventory validation", async ({
//     usersAPI,
//     page,
//   }) => {
//     // API step: validate the list response and its business data.
//     const apiResponse = await usersAPI.getUsers(1);

//     expect(apiResponse.status()).toBe(HttpStatusCodes.OK);
//     expect(apiResponse.headers()["content-type"]).toContain("application/json");

//     const userList = await usersAPI.getResponseBody<UserListResponse>(apiResponse);

//     expect(userList).toEqual(
//       expect.objectContaining({
//         page: 1,
//         data: expect.any(Array),
//       }),
//     );
//     expect(userList.data.length).toBeGreaterThan(0);
//     expect(userList.total).toBeGreaterThanOrEqual(userList.data.length);

//     // UI step: verify that the product inventory is available.
//     const loginPage = new LoginPage(page);
//     await page.goto(SAUCEDEMO_URL);
//     const inventoryPage = await loginPage.login(
//       SAUCEDEMO_USER,
//       SAUCEDEMO_PASSWORD,
//     );

//     await inventoryPage.verifyInventoryPage();
//     await expect(inventoryPage.productCard).toHaveCount(6);
//   });

//   test("TC029 UI cart action and API create-user verification", async ({
//     usersAPI,
//     page,
//   }) => {
//     // UI step: add a product and verify the cart business result.
//     const loginPage = new LoginPage(page);
//     await page.goto(SAUCEDEMO_URL);
//     const inventoryPage = await loginPage.login(
//       SAUCEDEMO_USER,
//       SAUCEDEMO_PASSWORD,
//     );

//     await inventoryPage.addProductToCart("Sauce Labs Backpack");
//     expect(await inventoryPage.getProductCount()).toBe(1);

//     // API step: verify that a user can be created successfully.
//     const apiResponse = await usersAPI.createUser({
//       name: "Combined Test User",
//       job: "QA Engineer",
//     });

//     expect(apiResponse.status()).toBe(HttpStatusCodes.CREATED);
//     expect(apiResponse.ok()).toBe(true);

//     const createdUser = await usersAPI.getResponseBody<CreateUserResponse>(apiResponse);

//     expect(createdUser).toMatchObject({
//       name: "Combined Test User",
//       job: "QA Engineer",
//       id: expect.any(String),
//       createdAt: expect.any(String),
//     });
//   });
// });
