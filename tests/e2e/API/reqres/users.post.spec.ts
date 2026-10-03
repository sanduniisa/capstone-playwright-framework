import { test, expect } from "../../../../fixtures/api-fixtures";
import { reqresPostScenarios } from "../../../../test-data/api/reqres-user-data";

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

for (const testCase of reqresPostScenarios) {
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