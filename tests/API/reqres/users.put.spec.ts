import { test, expect } from "../../../fixtures/api-fixtures";
import type { UserPayload } from "../../../src/api/UsersAPI";

const putTestCases: Array<{
	id: string;
	description: string;
	userId: number;
	requestBody: Record<string, unknown>;
	expectedBody: Record<string, unknown>;
}> = [
	{
		id: "TC016",
		description: "updates a user's name and job",
		userId: 2,
		requestBody: { name: "Sanduni", job: "Senior QA Engineer" },
		expectedBody: { name: "Sanduni", job: "Senior QA Engineer" },
	},
	{
		id: "TC017",
		description: "accepts a request with the name field missing",
		userId: 2,
		requestBody: { job: "QA Engineer" },
		expectedBody: { job: "QA Engineer" },
	},
	{
		id: "TC018",
		description: "accepts an empty name and an additional field",
		userId: 2,
		requestBody: { name: "", job: "QA Engineer", team: "Testing" },
		expectedBody: { name: "", job: "QA Engineer", team: "Testing" },
	},
];

for (const testCase of putTestCases) {
	test(`${testCase.id} PUT user ${testCase.description}`, async ({ usersAPI }) => {
		const response = await usersAPI.updateUser(
			testCase.userId,
			testCase.requestBody as unknown as UserPayload,
		);

		expect(response.status()).toBe(200);
		expect(response.ok()).toBe(true);
		expect(response.headers()["content-type"]).toContain("application/json");

		const responseBody = await response.json();

		// Level 2: response structure.
		expect(responseBody).toEqual(
			expect.objectContaining({ updatedAt: expect.any(String) }),
		);
		// Level 3: returned values match the replacement request body.
		expect(responseBody).toMatchObject(testCase.expectedBody);
		// Level 4: the replacement was processed and has a valid update timestamp.
		expect(Number.isNaN(Date.parse(responseBody.updatedAt))).toBe(false);
	});
}
