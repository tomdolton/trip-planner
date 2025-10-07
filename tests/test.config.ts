import { defineConfig } from "@playwright/test";

/**
 * Global setup for Playwright tests
 * This file runs before all tests
 */
export default defineConfig({
  // Global setup
  globalSetup: require.resolve("./global-setup"),

  // Global teardown
  globalTeardown: require.resolve("./global-teardown"),

  // Test configuration
  timeout: 30 * 1000, // 30 seconds per test
  expect: {
    timeout: 5 * 1000, // 5 seconds for assertions
  },

  // Retry configuration
  retries: process.env.CI ? 2 : 0,

  // Workers configuration
  workers: process.env.CI ? 1 : undefined,
});
