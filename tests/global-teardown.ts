/**
 * Global teardown that runs after all tests
 */
async function globalTeardown() {
  console.log("🧹 Starting global teardown for Trip Planner E2E tests");

  // Add global cleanup logic here, e.g.:
  // - Database cleanup
  // - File cleanup
  // - Resource disposal

  console.log("✅ Global teardown completed successfully");
}

export default globalTeardown;
