import { test, expect } from "@playwright/test";

import { ensureLoggedOut, loginWithTestUser } from "./helpers";

test.describe("Simplified Authentication Tests", () => {
  test("can visit login page", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: /sign in/i })).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test("can visit homepage and see Get Started when logged out", async ({ page }) => {
    await ensureLoggedOut(page);
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Wait for auth state to resolve (useUser hook)
    await page.waitForTimeout(5000);

    await expect(page.getByRole("heading", { name: "Trip Planner" })).toBeVisible();

    // Check that the link to /trips contains "Get Started" text
    const tripLink = page.locator('a[href="/trips"]');
    await expect(tripLink).toBeVisible();
    await expect(tripLink).toContainText("Get Started");
  });

  test("can login with test credentials", async ({ page }) => {
    await ensureLoggedOut(page);

    try {
      await loginWithTestUser(page);
      // Should redirect to trips page after login
      await expect(page).toHaveURL("/trips");
    } catch (error) {
      // If login fails, let's see what page we're on
      console.log("Login failed, current URL:", page.url());
      console.log("Login error:", error);

      // Check if we're still on login page with an error
      if (page.url().includes("/login")) {
        // Look for error messages
        const errorText = await page.textContent("body");
        console.log("Page content:", errorText);
      }

      throw error;
    }
  });

  test("can access trips page when authenticated", async ({ page }) => {
    await loginWithTestUser(page);
    await page.goto("/trips");
    await expect(page.getByRole("heading", { name: "Trips" })).toBeVisible();
  });
});
