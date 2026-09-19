import { test, expect } from "../../../fixtures/api-fixtures";

const deleteTestCases = [
	{
		id: "TC022",
		description: "deletes an existing user",
		userId: 2,
	},
	{
		id: "TC023",
		description: "deletes another existing user",
		userId: 1,
	},
	{
		id: "TC024",
		description: "handles a non-existent user",
		userId: 999,
	},
];

for (const testCase of deleteTestCases) {
	test(`${testCase.id} DELETE user ${testCase.description}`, async ({ usersAPI }) => {
		const response = await usersAPI.deleteUser(testCase.userId);

		// Level 1: DELETE returns the expected success status.
		expect(response.status()).toBe(204);
		// Level 2: a 204 response has no response payload.
		expect(response.headers()["content-type"] ?? "").toBe("");
		// Level 3: there is no returned data for a successful deletion.
		expect(await response.body()).toHaveLength(0);
		// Level 4: the deletion request completed successfully.
		expect(response.ok()).toBe(true);
	});
}
