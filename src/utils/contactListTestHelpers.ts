import { expect } from "@playwright/test";
import {
  ContactListAPI,
  ContactPayload,
  ContactUserCredentials,
  ContactUserResponse,
} from "../api/ContactListAPI";

// Reusable helper-driven data approach: the test data is generated dynamically here
// so each scenario gets unique, safe values without repeating the object structure.
const contactPassword = "QaPass!2025";

/** Build unique register credentials for a given test id. */
export function createCredentials(testId: string): ContactUserCredentials {
  const uniqueValue = `${Date.now()}-${testId.toLowerCase()}`;

  return {
    firstName: "API",
    lastName: "Tester",
    email: `api.${uniqueValue}@example.com`,
    password: contactPassword,
  };
}

/** Build a unique contact payload for a given test id. */
export function createContactPayload(testId: string): ContactPayload {
  return {
    firstName: "Combined",
    lastName: `Contact${testId}`,
    birthdate: "1990-01-01",
    email: `contact.${Date.now()}@example.com`,
    phone: "555-555-5555",
    street1: "1 Test Street",
    city: "Test City",
    stateProvince: "TS",
    postalCode: "12345",
    country: "Testland",
  };
}

/** Register and log in a new user through the API, asserting the responses along the way. */
export async function registerAndLogin(
  contactAPI: ContactListAPI,
  testId: string,
): Promise<{ credentials: ContactUserCredentials; auth: ContactUserResponse }> {
  const credentials = createCredentials(testId);
  const registerResponse = await contactAPI.registerUser(credentials);

  expect(registerResponse.status()).toBe(201);

  const loginResponse = await contactAPI.loginUser({
    email: credentials.email,
    password: credentials.password,
  });

  expect(loginResponse.status()).toBe(200);
  expect(loginResponse.ok()).toBe(true);

  const auth = await contactAPI.getResponseBody<ContactUserResponse>(loginResponse);

  expect(auth.token).toEqual(expect.any(String));
  expect(auth.user.email).toBe(credentials.email);

  return { credentials, auth };
}
