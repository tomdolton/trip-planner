import { test, expect } from "@playwright/test";

import { mockAuthenticatedUser } from "./helpers";

test.describe("Trips Page", () => {
  test.beforeEach(async ({ page }) => {
    // All trips page tests require authentication
    await mockAuthenticatedUser(page);
  });

  test("should display the trips page with correct layout", async ({ page }) => {
    await page.goto("/trips");

    // Check the page title
    await expect(page).toHaveTitle(/Trip Planner/);

    // Check main heading
    await expect(page.getByRole("heading", { name: "Trips" })).toBeVisible();

    // Check subtitle
    await expect(page.getByText("Plan and manage your trips")).toBeVisible();
  });

  test("should have filter tabs for upcoming, past, and all trips", async ({ page }) => {
    await page.goto("/trips");

    // Wait for page to load
    await page.waitForLoadState("networkidle");

    // Check filter tabs - they might be implemented as buttons instead of tabs
    const upcomingFilter = page.getByText("Upcoming").first();
    const pastFilter = page.getByText("Past").first();
    const allFilter = page.getByText("All").first();

    await expect(upcomingFilter).toBeVisible();
    await expect(pastFilter).toBeVisible();
    await expect(allFilter).toBeVisible();
  });

  test("should be able to switch between filter tabs", async ({ page }) => {
    await page.goto("/trips");
    await page.waitForLoadState("networkidle");

    // Click on different filters
    await page.getByText("Past").first().click();
    await page.waitForTimeout(500);

    await page.getByText("All").first().click();
    await page.waitForTimeout(500);

    await page.getByText("Upcoming").first().click();
    await page.waitForTimeout(500);

    // Just verify the page is still functional after clicking
    await expect(page.getByRole("heading", { name: "Trips" })).toBeVisible();
  });
});
