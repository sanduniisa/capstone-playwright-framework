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

  /** Read contacts using a bearer token. */
  async getContacts(token: string) {
    return this.get(this.contactPath, undefined, this.authHeaders(token));
  }

  /** Create a contact using a bearer token. */
  async createContact(token: string, payload: ContactPayload) {
    return this.post(this.contactPath, payload, this.authHeaders(token));
  }

  private authHeaders(token: string): RequestHeaders {
    return { Authorization: `Bearer ${token}` };
  }
}
