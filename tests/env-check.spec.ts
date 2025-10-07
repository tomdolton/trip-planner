import { test, expect } from "@playwright/test";

test.describe("Environment Variables Check", () => {
  test("should have test credentials available", async () => {
    const testEmail = process.env.TEST_USER_EMAIL;
    const testPassword = process.env.TEST_USER_PASSWORD;

    console.log("TEST_USER_EMAIL:", testEmail ? "✓ Set" : "✗ Not set");
    console.log("TEST_USER_PASSWORD:", testPassword ? "✓ Set" : "✗ Not set");

    expect(testEmail).toBeTruthy();
    expect(testPassword).toBeTruthy();
    expect(testEmail).toContain("@");
  });
});
