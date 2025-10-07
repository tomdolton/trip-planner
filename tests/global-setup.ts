import { chromium, FullConfig } from "@playwright/test";

/**
 * Global setup that runs before all tests
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function globalSetup(config: FullConfig) {
  console.log("🚀 Starting global setup for Trip Planner E2E tests");

  // Add global setup logic here, e.g.:
  // - Database seeding
  // - Authentication setup
  // - Environment validation

  // Verify the test environment is ready
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Check if the app is running on the expected URL
    await page.goto("http://localhost:3000", {
      waitUntil: "networkidle",
      timeout: 30000,
    });
    console.log("✅ Application is running and accessible");
  } catch (error) {
    console.error("❌ Application is not accessible:", error);
    console.log("💡 Make sure to run 'npm run dev' before running E2E tests");
    // Don't throw error to allow tests to run and show more specific failures
  } finally {
    await browser.close();
  }

  console.log("✅ Global setup completed successfully");
}

export default globalSetup;
