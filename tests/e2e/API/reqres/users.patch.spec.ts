import { test, expect } from "../../../../fixtures/api-fixtures";
import type { UserPayload } from "../../../src/api/UsersAPI";

const patchTestCases: Array<{
	id: string;
	description: string;
	userId: number;
	requestBody: Record<string, unknown>;
	expectedBody: Record<string, unknown>;
}> = [
	{
		id: "TC019",
		description: "updates only the user's name",
		userId: 2,
		requestBody: { name: "Sanduni" },
		expectedBody: { name: "Sanduni" },
	},
	{
		id: "TC020",
		description: "updates only the user's job",
		userId: 2,
		requestBody: { job: "Senior QA Engineer" },
		expectedBody: { job: "Senior QA Engineer" },
	},
	{
		id: "TC021",
		description: "accepts an empty name and an additional field",
		userId: 2,
		requestBody: { name: "", team: "Testing" },
		expectedBody: { name: "", team: "Testing" },
	},
];

for (const testCase of patchTestCases) {
	test(`${testCase.id} PATCH user ${testCase.description}`, async ({ usersAPI }) => {
		const response = await usersAPI.patchUser(
			testCase.userId,
			testCase.requestBody as Partial<UserPayload>,
		);

		expect(response.status()).toBe(200);
		expect(response.ok()).toBe(true);
		expect(response.headers()["content-type"]).toContain("application/json");

		const responseBody = await response.json();

		// Level 2: response structure.
		expect(responseBody).toEqual(
			expect.objectContaining({ updatedAt: expect.any(String) }),
		);
		// Level 3: returned values match the partial update request body.
		expect(responseBody).toMatchObject(testCase.expectedBody);
		// Level 4: the partial update was processed and has a valid timestamp.
		expect(Number.isNaN(Date.parse(responseBody.updatedAt))).toBe(false);
	});
}
