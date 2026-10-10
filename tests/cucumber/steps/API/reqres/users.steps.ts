// Implements shared ReqRes request and response steps for GET, POST, PUT, PATCH, and DELETE features.
import { Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import type {
  CreateUserResponse,
  SingleUserResponse,
  UpdateUserResponse,
  UserListResponse,
  UserPayload,
} from "../../../../../src/api/UsersAPI";
import { PlaywrightWorld } from "../../../support/world";

When(
  "I request ReqRes users page {string}",
  async function (this: PlaywrightWorld, page: string) {
    this.apiResponse = await this.usersAPI!.getUsers(page);
  },
);

When(
  "I request ReqRes users without a page parameter",
  async function (this: PlaywrightWorld) {
    this.apiResponse = await this.usersAPI!.getUsers();
  },
);

When(
  "I request ReqRes user {int}",
  async function (this: PlaywrightWorld, userId: number) {
    this.apiResponse = await this.usersAPI!.getUserById(userId);
  },
);

When(
  "I create a ReqRes user with JSON {string}",
  async function (this: PlaywrightWorld, payload: string) {
    this.apiResponse = await this.usersAPI!.createUser(
      JSON.parse(payload) as UserPayload,
    );
  },
);

When(
  "I replace ReqRes user {int} with JSON {string}",
  async function (this: PlaywrightWorld, userId: number, payload: string) {
    this.apiResponse = await this.usersAPI!.updateUser(
      userId,
      JSON.parse(payload) as UserPayload,
    );
  },
);

When(
  "I partially update ReqRes user {int} with JSON {string}",
  async function (this: PlaywrightWorld, userId: number, payload: string) {
    this.apiResponse = await this.usersAPI!.patchUser(
      userId,
      JSON.parse(payload) as Partial<UserPayload>,
    );
  },
);

When(
  "I delete ReqRes user {int}",
  async function (this: PlaywrightWorld, userId: number) {
    this.apiResponse = await this.usersAPI!.deleteUser(userId);
  },
);

Then(
  "ReqRes response status should be {int}",
  async function (this: PlaywrightWorld, expectedStatus: number) {
    expect(this.apiResponse!.status()).toBe(expectedStatus);
  },
);

Then(
  "ReqRes response content type should be JSON",
  async function (this: PlaywrightWorld) {
    expect(this.apiResponse!.headers()["content-type"]).toContain("application/json");
  },
);

Then(
  "ReqRes user list should be page {int} with {int} results",
  async function (
    this: PlaywrightWorld,
    expectedPage: number,
    expectedCount: number,
  ) {
    const body = await this.apiResponse!.json() as UserListResponse;
    expect(body).toEqual(
      expect.objectContaining({
        page: expectedPage,
        per_page: expect.any(Number),
        total: expect.any(Number),
        total_pages: expect.any(Number),
        data: expect.any(Array),
      }),
    );
    expect(body.data).toHaveLength(expectedCount);
    for (const user of body.data) {
      expect(user.email).toMatch(/^[^@\s]+@[^@\s]+\.[^@\s]+$/);
      expect(user.first_name).toEqual(expect.any(String));
      expect(user.last_name).toEqual(expect.any(String));
    }
  },
);

Then(
  "ReqRes response user ID should be {int}",
  async function (this: PlaywrightWorld, expectedId: number) {
    const body = await this.apiResponse!.json() as SingleUserResponse;
    expect(body.data.id).toBe(expectedId);
  },
);

Then(
  "ReqRes response body should contain JSON {string}",
  async function (this: PlaywrightWorld, expectedJson: string) {
    expect(await this.apiResponse!.json()).toMatchObject(JSON.parse(expectedJson));
  },
);

Then(
  "ReqRes response should include generated ID and timestamp",
  async function (this: PlaywrightWorld) {
    const body = await this.apiResponse!.json() as CreateUserResponse;
    expect(body.id).toEqual(expect.any(String));
    expect(Number.isNaN(Date.parse(body.createdAt))).toBe(false);
  },
);

Then(
  "ReqRes response should include an update timestamp",
  async function (this: PlaywrightWorld) {
    const body = await this.apiResponse!.json() as UpdateUserResponse;
    expect(Number.isNaN(Date.parse(body.updatedAt))).toBe(false);
  },
);

Then(
  "ReqRes response body should be empty",
  async function (this: PlaywrightWorld) {
    expect(await this.apiResponse!.body()).toHaveLength(0);
  },
);