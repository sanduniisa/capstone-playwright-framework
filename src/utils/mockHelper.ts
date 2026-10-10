import type { Page, Route } from "@playwright/test";
import * as path from "node:path";
import * as fs from "node:fs";

export interface MockRouteConfig {
  url: string | RegExp | ((url: URL) => boolean);
  json?: unknown;
  status?: number;
  headers?: Record<string, string>;
  body?: string;
  contentType?: string;
}

export interface MockHelper {
  mockRoute(config: MockRouteConfig): Promise<void>;
  loadMockData<T = unknown>(fileName: string): T;
  blockRequests(urlPattern: string | RegExp): Promise<void>;
  collectRequests(urlPattern: string | RegExp): string[];
}

export function createMockHelper(page: Page): MockHelper {
  const collectedRequests = new Map<string, string[]>();

  return {
    async mockRoute(config): Promise<void> {
      await page.route(config.url, async (route: Route) => {
        const fulfillOptions: Record<string, unknown> = {
          status: config.status ?? 200,
        };

        if (config.json !== undefined) {
          fulfillOptions.json = config.json;
        } else if (config.body !== undefined) {
          fulfillOptions.body = config.body;
          fulfillOptions.contentType = config.contentType ?? "text/plain";
        }

        if (config.headers) {
          fulfillOptions.headers = config.headers;
        }

        await route.fulfill(fulfillOptions);
      });
    },

    loadMockData<T = unknown>(fileName: string): T {
      const filePath = path.resolve(
        process.cwd(),
        "test-data",
        "mock-responses",
        fileName,
      );
      return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T;
    },

    async blockRequests(urlPattern): Promise<void> {
      await page.route(urlPattern, (route) => route.abort());
    },

    collectRequests(urlPattern): string[] {
      const key = typeof urlPattern === "string" ? urlPattern : urlPattern.source;
      if (!collectedRequests.has(key)) {
        collectedRequests.set(key, []);
        page.on("request", (request) => {
          const url = request.url();
          const matches =
            typeof urlPattern === "string"
              ? url.includes(urlPattern)
              : urlPattern.test(url);
          if (matches) collectedRequests.get(key)!.push(url);
        });
      }
      return collectedRequests.get(key)!;
    },
  };
}