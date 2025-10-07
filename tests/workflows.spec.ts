import { test, expect } from "@playwright/test";

import { TripPlannerTestHelpers, loginWithTestUser, ensureLoggedOut } from "./helpers";

test.describe("Trip Management Workflows", () => {
  let helpers: TripPlannerTestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TripPlannerTestHelpers(page);
  });

  test("should handle unauthenticated user flow", async ({ page }) => {
    await ensureLoggedOut(page);
    await helpers.goToHomepage();

    // Should show "Get Started" for unauthenticated users
    await expect(page.getByRole("link", { name: "Get Started" })).toBeVisible();

    // Clicking should try to navigate to trips page but redirect to login
    await page.getByRole("link", { name: "Get Started" }).click();
    await expect(page).toHaveURL("/login");
  });

  test("should handle authenticated user flow", async ({ page }) => {
    await loginWithTestUser(page);
    await helpers.goToHomepage();

    // Should show "View Trips" for authenticated users
    const viewTripsBtn = page.getByRole("link", { name: "View Trips" });
    await expect(viewTripsBtn).toBeVisible();

    // Clicking should navigate to trips page
    await viewTripsBtn.click();
    await expect(page).toHaveURL("/trips");
  });

  test("should load trips page without errors for authenticated users", async ({ page }) => {
    await loginWithTestUser(page);
    await helpers.goToTripsPage();
    await helpers.waitForPageLoad();
    await helpers.checkForErrors();

    // Verify the page structure
    await expect(page.getByText("Plan and manage your trips")).toBeVisible();
  });

  test("should handle API failures gracefully", async ({ page }) => {
    await loginWithTestUser(page);

    // Mock network failure for API calls (except auth)
    await page.route("**/api/trips**", (route) => {
      route.abort("failed");
    });

    await helpers.goToTripsPage();

    // Page should still load even if trips API calls fail
    await expect(page.getByRole("heading", { name: "Trips" })).toBeVisible();
  });

  test("should maintain auth state during navigation", async ({ page }) => {
    await loginWithTestUser(page);
    await helpers.goToTripsPage();

    // Navigate away and back
    await helpers.goToHomepage();
    await expect(page.getByRole("link", { name: "View Trips" })).toBeVisible();

    await helpers.goToTripsPage();
    await expect(page.getByRole("heading", { name: "Trips" })).toBeVisible();
  });
});
