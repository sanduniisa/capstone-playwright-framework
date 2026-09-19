import {
  APIRequestContext,
  APIRequestOptions,
  APIResponse,
} from "@playwright/test";

export type RequestHeaders = Record<string, string>;
export type QueryParams = Record<string, string | number | boolean>;

interface BaseRequestOptions extends APIRequestOptions {
  headers?: RequestHeaders;
  params?: QueryParams;
  data?: object;
}

/**
 * BaseAPI is the common transport layer for API helpers.
 * It centralizes headers and wraps Playwright's APIRequestContext.
 */
export class BaseAPI {
  constructor(
    protected request: APIRequestContext,
    private defaultHeaders: RequestHeaders = {},
  ) {}

  /** Add or override headers used by every request from this helper. */
  setDefaultHeaders(headers: RequestHeaders): void {
    this.defaultHeaders = {
      ...this.defaultHeaders,
      ...headers,
    };
  }

  /** Remove all helper-level default headers. */
  clearDefaultHeaders(): void {
    this.defaultHeaders = {};
  }

  private buildOptions(options: BaseRequestOptions = {}): BaseRequestOptions {
    const headers = {
      ...this.defaultHeaders,
      ...options.headers,
    };

    return {
      ...options,
      headers: Object.keys(headers).length ? headers : undefined,
    };
  }

  private static readonly MAX_RATE_LIMIT_RETRIES = 3;
  private static readonly RETRY_BASE_DELAY_MS = 1000;

  /** Retry a request on 429 responses with backoff, since shared demo APIs rate-limit under parallel load. */
  private async withRetry(send: () => Promise<APIResponse>): Promise<APIResponse> {
    let response = await send();

    for (
      let attempt = 0;
      response.status() === 429 && attempt < BaseAPI.MAX_RATE_LIMIT_RETRIES;
      attempt++
    ) {
      const retryAfterSeconds = Number(response.headers()["retry-after"]);
      const delayMs =
        Number.isFinite(retryAfterSeconds) && retryAfterSeconds > 0
          ? retryAfterSeconds * 1000
          : BaseAPI.RETRY_BASE_DELAY_MS * 2 ** attempt;

      await new Promise((resolve) => setTimeout(resolve, delayMs));
      response = await send();
    }

    return response;
  }

  /** Send a GET request with optional query parameters. */
  async get(
    endpoint: string,
    params?: QueryParams,
    headers?: RequestHeaders,
  ): Promise<APIResponse> {
    return this.withRetry(() =>
      this.request.get(endpoint, this.buildOptions({ params, headers })),
    );
  }

  /** Send a JSON POST request. */
  async post(
    endpoint: string,
    data: object,
    headers?: RequestHeaders,
  ): Promise<APIResponse> {
    return this.withRetry(() =>
      this.request.post(endpoint, this.buildOptions({ data, headers })),
    );
  }

  /** Send a full resource replacement with PUT. */
  async put(
    endpoint: string,
    data: object,
    headers?: RequestHeaders,
  ): Promise<APIResponse> {
    return this.withRetry(() =>
      this.request.put(endpoint, this.buildOptions({ data, headers })),
    );
  }

  /** Send a partial resource update with PATCH. */
  async patch(
    endpoint: string,
    data: object,
    headers?: RequestHeaders,
  ): Promise<APIResponse> {
    return this.withRetry(() =>
      this.request.patch(endpoint, this.buildOptions({ data, headers })),
    );
  }

  /** Send a DELETE request. */
  async delete(
    endpoint: string,
    headers?: RequestHeaders,
  ): Promise<APIResponse> {
    return this.withRetry(() =>
      this.request.delete(endpoint, this.buildOptions({ headers })),
    );
  }

  /** Parse an API response as a typed JSON object. */
  async getResponseBody<T>(response: APIResponse): Promise<T> {
    return (await response.json()) as T;
  }

  /** Send any supported HTTP method with custom request options. */
  async requestWithHeaders(
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    endpoint: string,
    options: {
      headers?: RequestHeaders;
      data?: object;
      params?: QueryParams;
    } = {},
  ): Promise<APIResponse> {
    const requestOptions = this.buildOptions(options);

    return this.withRetry(() => {
      switch (method) {
        case "GET":
          return this.request.get(endpoint, requestOptions);
        case "POST":
          return this.request.post(endpoint, requestOptions);
        case "PUT":
          return this.request.put(endpoint, requestOptions);
        case "PATCH":
          return this.request.patch(endpoint, requestOptions);
        case "DELETE":
          return this.request.delete(endpoint, requestOptions);
        default:
          throw new Error(`Unsupported HTTP method: ${method}`);
      }
    });
  }
}
