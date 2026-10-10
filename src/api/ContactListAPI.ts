import { BaseAPI, RequestHeaders } from "./BaseAPI";

export interface ContactUserCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface ContactUserResponse {
  user: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  token: string;
}

export interface ContactPayload {
  firstName: string;
  lastName: string;
  birthdate: string;
  email: string;
  phone: string;
  street1: string;
  street2?: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
}

export interface Contact extends ContactPayload {
  _id: string;
  owner: string;
}

/** API helper for the open-source Contact List App. */
export class ContactListAPI extends BaseAPI {
  private readonly userPath = "/users";
  private readonly contactPath = "/contacts";

  /** Register a user and return the API token. */
  async registerUser(credentials: ContactUserCredentials) {
    return this.post(this.userPath, credentials);
  }

  /** Log in a user and return the API token. */
  async loginUser(credentials: Pick<ContactUserCredentials, "email" | "password">) {
    return this.post(`${this.userPath}/login`, credentials);
  }

  /** Configure this helper to authenticate requests with a saved bearer token. */
  setAuthToken(token: string): void {
    this.setDefaultHeaders(this.authHeaders(token));
  }

  /** Read contacts using a bearer token. */
  async getContacts(token?: string) {
    return this.get(
      this.contactPath,
      undefined,
      token ? this.authHeaders(token) : undefined,
    );
  }

  /** Create a contact using a bearer token. */
  async createContact(payload: ContactPayload): Promise<import("@playwright/test").APIResponse>;
  async createContact(
    token: string,
    payload: ContactPayload,
  ): Promise<import("@playwright/test").APIResponse>;
  async createContact(
    tokenOrPayload: string | ContactPayload,
    payload?: ContactPayload,
  ) {
    const token = typeof tokenOrPayload === "string" ? tokenOrPayload : undefined;
    const contactPayload =
      typeof tokenOrPayload === "string" ? payload! : tokenOrPayload;

    return this.post(
      this.contactPath,
      contactPayload,
      token ? this.authHeaders(token) : undefined,
    );
  }

  private authHeaders(token: string): RequestHeaders {
    return { Authorization: `Bearer ${token}` };
  }
}
