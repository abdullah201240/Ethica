import { defineConfig, devices } from "@playwright/test"

/**
 * Ethica — Playwright E2E Test Configuration
 *
 * Tests run against all 3 browser engines (Chromium, Firefox, WebKit)
 * to ensure cross-browser compatibility across the platform.
 *
 * Docs: https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Test directory
  testDir: "./e2e",

  // Run tests in parallel
  fullyParallel: true,

  // Disable retries in CI for faster feedback; enable locally if flaky
  retries: process.env.CI ? 2 : 0,

  // Limit workers in CI to avoid resource contention
  workers: process.env.CI ? 1 : undefined,

  // Reporter configuration — HTML report for local, list for CI
  reporter: process.env.CI
    ? [["list"], ["github"]]
    : [["html", { open: "never" }]],

  // Shared settings for all projects
  use: {
    // Base URL for all navigation actions
    baseURL: "http://localhost:3000",

    // Capture trace on first retry for debugging
    trace: "on-first-retry",

    // Capture screenshot on failure
    screenshot: "only-on-failure",

    // Collect video on failure (reduced storage)
    video: "retain-on-failure",
  },

  // Configure projects for major browser engines
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },

    // Mobile viewport testing
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 7"] },
    },
    {
      name: "mobile-safari",
      use: { ...devices["iPhone 15"] },
    },
  ],

  // Automatically start the Next.js dev server before running tests
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000, // 2 minutes for cold start
  },
})
