import { test, expect } from "../../../fixtures/api-fixtures";

test('TC010 POST user', async ({ usersAPI }) => {
//create object for the request body
  const requestBody = {
    name: 'Sanduni',
    job: 'Senior QA Engineer',
  };

  const response = await usersAPI.createUser(requestBody);

  expect(response.status()).toBe(201);
  expect(response.ok()).toBe(true);

  const body = await response.json();

  // Level 2: response structure.
  expect(body).toEqual(
    expect.objectContaining({
      id: expect.any(String),
      createdAt: expect.any(String),
    }),
  );
  // Level 3: returned values match the submitted data.
  expect(body.name).toBe('Sanduni');
  expect(body.job).toBe('Senior QA Engineer');
  // Level 4: a successful create returns a valid identifier and timestamp.
  expect(body.id).not.toBe("");
  expect(Number.isNaN(Date.parse(body.createdAt))).toBe(false);
});

const requestBodyTestCases: Array<{
  id: string;
  description: string;
  requestBody: Record<string, unknown>;
  expectedBody: Record<string, unknown>;
}> = [
  {
    id: "TC011",
    description: "accepts a body with name missing",
    requestBody: { job: "Senior QA Engineer" },
    expectedBody: { job: "Senior QA Engineer" },
  },
  {
    id: "TC012",
    description: "accepts an empty name",
    requestBody: { name: "", job: "Senior QA Engineer" },
    expectedBody: { name: "", job: "Senior QA Engineer" },
  },
  {
    id: "TC013",
    description: "accepts a null name",
    requestBody: { name: null, job: "Senior QA Engineer" },
    expectedBody: { name: null, job: "Senior QA Engineer" },
  },
  {
    id: "TC014",
    description: "accepts wrong field data types",
    requestBody: { name: 123, job: true },
    expectedBody: { name: 123, job: true },
  },
  {
    id: "TC015",
    description: "accepts an extra field",
    requestBody: { name: "Sanduni", job: "QA", random: "abc" },
    expectedBody: { name: "Sanduni", job: "QA", random: "abc" },
  },
];

for (const testCase of requestBodyTestCases) {
  test(`${testCase.id} POST user ${testCase.description}`, async ({ usersAPI }) => {
    const response = await usersAPI.createUser(testCase.requestBody as { name: string; job: string });

    expect(response.status()).toBe(201);
    expect(response.ok()).toBe(true);

    const body = await response.json();

    // Level 2: response structure.
    expect(body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        createdAt: expect.any(String),
      }),
    );
    // Level 3: returned values match the submitted data.
    expect(body).toMatchObject(testCase.expectedBody);
    // Level 4: a successful create returns non-empty metadata.
    expect(body.id).not.toBe("");
    expect(Number.isNaN(Date.parse(body.createdAt))).toBe(false);
  });
}