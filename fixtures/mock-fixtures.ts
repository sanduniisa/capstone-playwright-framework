import { test as base } from '@playwright/test';
import { createMockHelper, type MockHelper } from '../src/utils/mockHelper';

type BrowserLog = {
  type: string;
  text: string;
};

export const test = base.extend<{
  mockHelper: MockHelper;
  browserLogs: BrowserLog[];
}>({
  mockHelper: async ({ page }, use) => {
    await use(createMockHelper(page));
  },

  browserLogs: async ({ page }, use) => {
    const logs: BrowserLog[] = [];

    page.on('console', (msg) => {
      logs.push({
        type: msg.type(),
        text: msg.text(),
      });
    });

    page.on('pageerror', (err) => {
      logs.push({
        type: 'error',
        text: err.message,
      });
    });

    await use(logs);
  },
});

export { expect } from '@playwright/test';
