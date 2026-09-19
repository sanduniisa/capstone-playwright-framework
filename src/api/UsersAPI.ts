import { BaseAPI, RequestHeaders } from "./BaseAPI";

/** Payload for creating or fully updating a user. */
export interface UserPayload {
  name: string;
  job: string;
}

export interface CreateUserResponse {
  name: string;
  job: string;
  id: string;
  createdAt: string;
}

export interface UpdateUserResponse {
  name?: string;
  job?: string;
  updatedAt: string;
}

export interface UserData {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

export interface SingleUserResponse {
  data: UserData;
  support: {
    url: string;
    text: string;
  };
}

export interface UserListResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: UserData[];
  support: {
    url: string;
    text: string;
  };
}

/** UsersAPI provides domain-specific methods for the ReqRes users resource. */
export class UsersAPI extends BaseAPI {
  private readonly basePath = "/api/users";

  /** GET /api/users?page={page}; Playwright serializes the ? query parameter. */
  async getUsers(page = 1, headers?: RequestHeaders) {
    return this.get(this.basePath, { page }, headers);
  }

  /** GET /api/users/{id}; / separates the path parameter. */
  async getUserById(id: number, headers?: RequestHeaders) {
    return this.get(`${this.basePath}/${id}`, undefined, headers);
  }

  /** POST /api/users. */
  async createUser(payload: UserPayload, headers?: RequestHeaders) {
    return this.post(this.basePath, payload, headers);
  }

  /** PUT /api/users/{id}; replaces the resource representation. */
  async updateUser(id: number, payload: UserPayload, headers?: RequestHeaders) {
    return this.put(`${this.basePath}/${id}`, payload, headers);
  }

  /** PATCH /api/users/{id}; updates only the supplied fields. */
  async patchUser(
    id: number,
    payload: Partial<UserPayload>,
    headers?: RequestHeaders,
  ) {
    return this.patch(`${this.basePath}/${id}`, payload, headers);
  }

  /** DELETE /api/users/{id}. */
  async deleteUser(id: number, headers?: RequestHeaders) {
    return this.delete(`${this.basePath}/${id}`, headers);
  }

  /** Get and parse a paginated user list. */
  async getUserList(page = 1): Promise<UserListResponse> {
    const response = await this.getUsers(page);
    return this.getResponseBody<UserListResponse>(response);
  }

  /** Get and parse one user. */
  async getUser(id: number): Promise<SingleUserResponse> {
    const response = await this.getUserById(id);
    return this.getResponseBody<SingleUserResponse>(response);
  }
}
