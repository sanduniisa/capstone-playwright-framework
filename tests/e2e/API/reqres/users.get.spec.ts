import { test, expect } from "../../../../fixtures/api-fixtures";

function assertUserListResponse(
  responseBody: Record<string, any>,
  expectedPage: number,
  expectedDataLength: number,
) {
  // Level 2: response structure.
  expect(responseBody).toEqual(
    expect.objectContaining({
      page: expect.any(Number),
      per_page: expect.any(Number),
      total: expect.any(Number),
      total_pages: expect.any(Number),
      data: expect.any(Array),
    }),
  );

  // Level 3: returned data values and field types.
  expect(responseBody.page).toBe(expectedPage);
  expect(responseBody.data).toHaveLength(expectedDataLength);
  for (const user of responseBody.data) {
    expect(user).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        email: expect.stringMatching(/^[^@\s]+@[^@\s]+\.[^@\s]+$/),
        first_name: expect.any(String),
        last_name: expect.any(String),
        avatar: expect.any(String),
      }),
    );
  }

  // Level 4: the requested page contains the expected number of users.
  expect(responseBody.data.length).toBe(expectedDataLength);
}

test.describe("ReqRes Users API GET Method", () => {
  //checks the standard successful request: GET /users?page=2 returns 200, JSON, pagination fields, and valid user objects.
  test("TC001 GET users returns a valid user list", async ({ usersAPI }) => {
    const response = await usersAPI.getUsers(2);

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain(
      "application/json",
    );

    const responseBody = await response.json();

    assertUserListResponse(responseBody, 2, 6);

    console.log(
      `PASS: Retrieved ${responseBody.data.length} users from page ${responseBody.page}`,
    );
  });
// TC002 checks page=1 returns page 1 with users.

// TC003 checks page=2 returns page 2 with users.

// TC004 checks page=0; ReqRes defaults it to page 1 with users.

// TC005 checks page=-1; ReqRes accepts it and returns page -1 with users.

// TC006 checks page=abc; ReqRes defaults the invalid text value to page 1 with users.

// TC007 checks a huge page number (999999999); ReqRes returns 200 with that page number and an empty user list.
  const pageTestCases = [
    { id: "TC002", label: "page = 1", page: "1", expectedPage: 1, expectedDataLength: 6 },
    { id: "TC003", label: "page = 2", page: "2", expectedPage: 2, expectedDataLength: 6 },
    { id: "TC004", label: "page = 0", page: "0", expectedPage: 1, expectedDataLength: 6 },
    { id: "TC005", label: "page = -1", page: "-1", expectedPage: -1, expectedDataLength: 6 },
    { id: "TC006", label: "page = abc", page: "abc", expectedPage: 1, expectedDataLength: 6 },
    {
      id: "TC007",
      label: "page = huge number",
      page: "999999999",
      expectedPage: 999999999,
      expectedDataLength: 0,
    },
  ];

  for (const pageTestCase of pageTestCases) {
    test(`${pageTestCase.id} GET users with ${pageTestCase.label}`, async ({ usersAPI }) => {
      const response = await usersAPI.getUsers(Number(pageTestCase.page));

      expect(response.status()).toBe(200);

      const responseBody = await response.json();

      assertUserListResponse(
        responseBody,
        pageTestCase.expectedPage,
        pageTestCase.expectedDataLength,
      );
    });
  }

  test("TC008 GET users with page missing defaults to page 1", async ({ usersAPI }) => {
    const response = await usersAPI.getUsers();

    expect(response.status()).toBe(200);

    const responseBody = await response.json();

    assertUserListResponse(responseBody, 1, 6);
  });

//TC009 checks page=2 returns page 2 with users.
test('TC009 GET users - pagination', async ({ usersAPI }) => {

  const response = await usersAPI.getUsers(2);

  expect(response.status()).toBe(200);

  const body = await response.json();

  assertUserListResponse(body, 2, 6);
});

test("TC025 GET users with a query parameter", async ({ usersAPI }) => {
  // ? starts the query string: users?page=1.
  // UsersAPI serializes the equivalent params form for the request.
  const response = await usersAPI.getUsers(1);

  // Level 1: status code.
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("application/json");

  const responseBody = await response.json();

  // Levels 2-4: response structure, values, and page business rule.
  assertUserListResponse(responseBody, 1, 6);
  expect(responseBody.total_pages).toBeGreaterThanOrEqual(responseBody.page);
});

test("TC026 GET user with a path parameter", async ({ usersAPI }) => {
  const userId = 2;
  // / separates URL path segments: users/2, where 2 is the path parameter.
  const response = await usersAPI.getUserById(userId);

  // Level 1: status code.
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("application/json");

  const responseBody = await response.json();

  // Level 2: response structure.
  expect(responseBody).toEqual(
    expect.objectContaining({
      data: expect.objectContaining({
        id: expect.any(Number),
        email: expect.any(String),
        first_name: expect.any(String),
        last_name: expect.any(String),
        avatar: expect.any(String),
      }),
      support: expect.objectContaining({
        url: expect.any(String),
        text: expect.any(String),
      }),
    }),
  );

  // Level 3: returned data values and field formats.
  expect(responseBody.data.id).toBe(userId);
  expect(responseBody.data.email).toMatch(/^[^@\s]+@[^@\s]+\.[^@\s]+$/);

  // Level 4: the path parameter identifies the returned user.
  expect(responseBody.data.id).toBe(userId);
});

});