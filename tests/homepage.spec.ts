import { test, expect } from "@playwright/test";

import { loginWithTestUser, ensureLoggedOut } from "./helpers";

test.describe("Homepage", () => {
  test("should display the homepage with correct title and content", async ({ page }) => {
    await page.goto("/");

    // Check the page title
    await expect(page).toHaveTitle(/Trip Planner/);

    // Check main heading
    await expect(page.getByRole("heading", { name: "Trip Planner" })).toBeVisible();

    // Check that there's a button to get started or view trips
    const ctaButton = page.getByRole("link", { name: /Get Started|View Trips/ });
    await expect(ctaButton).toBeVisible();

    // Verify the button links to trips page
    await expect(ctaButton).toHaveAttribute("href", "/trips");
  });

  test("should show 'Get Started' for unauthenticated users", async ({ page }) => {
    await ensureLoggedOut(page);
    await page.goto("/");

    // Should show "Get Started" for unauthenticated users
    await expect(page.getByRole("link", { name: "Get Started" })).toBeVisible();
  });

  test("should show 'View Trips' for authenticated users", async ({ page }) => {
    await loginWithTestUser(page);
    await page.goto("/");

    // Should show "View Trips" for authenticated users
    await expect(page.getByRole("link", { name: "View Trips" })).toBeVisible();
  });

  test("should navigate to login when unauthenticated user clicks CTA", async ({ page }) => {
    await ensureLoggedOut(page);
    await page.goto("/");

    // Click the main CTA button
    await page.getByRole("link", { name: "Get Started" }).click();

    // For unauthenticated users, should be redirected to login when accessing trips
    await expect(page).toHaveURL("/login");
  });
});
