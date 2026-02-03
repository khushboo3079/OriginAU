import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  timeout: 350 * 1000,
  testDir: "./tests",
  fullyParallel: false,

  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,

  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['junit', { outputFile: 'test-results/results.xml' }],
    ['list'],
  ],

  use: {
    headless: false,
    screenshot: 'on',
    video: 'retain-on-failure',
    trace: 'on',
  },

  projects: [
    // UI Tests - Chromium
    {
      name: 'chromium',
      testDir: './tests',
      use: {
        browserName: 'chromium',
        viewport: null,
        launchOptions: {
          args: ['--start-maximized'],
          slowMo: 500,
        },
      },
    },
    // UI Tests - Firefox
   /* {
      name: 'firefox',
      testDir: './tests',
      use: {
        browserName: 'firefox',
        viewport: null,
        launchOptions: {
          args: [],
          slowMo: 500,
        },
      },
    },
    // UI Tests - WebKit (Safari)
    {
      name: 'webkit',
      testDir: './tests',
      use: {
        browserName: 'webkit',
        viewport: null,
        launchOptions: {
          args: [],
          slowMo: 500,
        },
      },
    },
    // UI Tests - Legacy (backward compatibility with old testDir)
    {
      name: 'ui-tests',
      testDir: './tests',
      use: {
        browserName: 'chromium',
        viewport: null,
        launchOptions: {
          args: ['--start-maximized'],
          slowMo: 500,
        },
      },
    },*/
    // API Tests
    {
      name: 'api-tests',
      testDir: './tests/api-automation/tests',
      use: {
        baseURL: 'https://restful-booker.herokuapp.com',
        extraHTTPHeaders: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      },
    },
  ],
};

export default config;