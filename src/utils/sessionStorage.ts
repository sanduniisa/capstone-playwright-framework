import type { BrowserContext, Page } from "@playwright/test";

export type SessionStorageSnapshot = Record<string, string>;

export async function captureSessionStorage(
  page: Page,
): Promise<SessionStorageSnapshot> {
  return page.evaluate(() => {
    const snapshot: SessionStorageSnapshot = {};

    for (let index = 0; index < window.sessionStorage.length; index += 1) {
      const key = window.sessionStorage.key(index);
      if (key) {
        snapshot[key] = window.sessionStorage.getItem(key) ?? "";
      }
    }

    return snapshot;
  });
}

export async function seedSessionStorage(
  context: BrowserContext,
  snapshot: SessionStorageSnapshot,
): Promise<void> {
  await context.addInitScript((entries: SessionStorageSnapshot) => {
    for (const [key, value] of Object.entries(entries)) {
      window.sessionStorage.setItem(key, value);
    }
  }, snapshot);
}

export async function setSessionStorageValue(
  page: Page,
  key: string,
  value: string,
): Promise<void> {
  await page.evaluate(
    ([storageKey, storageValue]) => {
      window.sessionStorage.setItem(storageKey, storageValue);
    },
    [key, value] as const,
  );
}

export async function getSessionStorageValue(
  page: Page,
  key: string,
): Promise<string | null> {
  return page.evaluate(
    (storageKey) => window.sessionStorage.getItem(storageKey),
    key,
  );
}