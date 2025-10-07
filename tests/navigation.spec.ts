import { test, expect } from "@playwright/test";

import { loginWithTestUser } from "./helpers";

test.describe("Navigation and Layout", () => {
  test("should have consistent layout across public pages", async ({ page }) => {
    // Test homepage
    await page.goto("/");
    await expect(page.locator("body")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Trip Planner" })).toBeVisible();

    // Test login page
    await page.goto("/login");
    await expect(page.locator("body")).toBeVisible();
    await expect(page.getByRole("heading", { name: /sign in/i })).toBeVisible();

    // Test signup page
    await page.goto("/signup");
    await expect(page.locator("body")).toBeVisible();
    await expect(page.getByRole("heading", { name: /create an account/i })).toBeVisible();
  });

  test("should handle 404 pages gracefully", async ({ page }) => {
    await page.goto("/non-existent-page");

    // Should either redirect to a 404 page or handle gracefully
    // Check if the page loads without errors
    await expect(page.locator("body")).toBeVisible();
  });

  test("should be responsive on mobile viewport", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto("/");

    // Check that main content is visible on mobile
    await expect(page.getByRole("heading", { name: "Trip Planner" })).toBeVisible();

    // Test auth pages on mobile
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: /sign in/i })).toBeVisible();
  });

  test("should maintain accessibility standards", async ({ page }) => {
    await page.goto("/");

    // Check that interactive elements are keyboard accessible
    await page.keyboard.press("Tab");
    const focusedElement = page.locator(":focus");
    await expect(focusedElement).toBeVisible();
  });

  test("should navigate properly for authenticated users", async ({ page }) => {
    await loginWithTestUser(page);

    // Test navigation to protected routes
    await page.goto("/trips");
    await expect(page.getByRole("heading", { name: "Trips" })).toBeVisible();

    // Navigate back to homepage
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Trip Planner" })).toBeVisible();
  });
});
