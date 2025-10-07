import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("should display login page with correct form elements", async ({ page }) => {
    await page.goto("/login");

    // Check that we're on the login page
    await expect(page).toHaveURL("/login");

    // Check page title and heading
    await expect(page.getByRole("heading", { name: /sign in to your account/i })).toBeVisible();

    // Check form elements
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
  });

  test("should display signup page with correct form elements", async ({ page }) => {
    await page.goto("/signup");

    // Check that we're on the signup page
    await expect(page).toHaveURL("/signup");

    // Check page title and heading
    await expect(page.getByRole("heading", { name: /create an account/i })).toBeVisible();

    // Check form elements
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByRole("button", { name: /create account/i })).toBeVisible();
  });

  test("should show validation errors for empty form submission", async ({ page }) => {
    await page.goto("/login");

    // Try to submit empty form
    await page.getByRole("button", { name: /sign in/i }).click();

    // Should show validation errors
    await expect(page.getByText(/please enter a valid email/i)).toBeVisible();
    await expect(page.getByText(/password must be at least 6 characters/i)).toBeVisible();
  });

  test("should handle form input correctly", async ({ page }) => {
    await page.goto("/login");

    // Fill in the form
    await page.getByLabel("Email").fill("test@example.com");
    await page.getByLabel("Password").fill("password123");

    // Verify the form was filled
    await expect(page.getByLabel("Email")).toHaveValue("test@example.com");
    await expect(page.getByLabel("Password")).toHaveValue("password123");
  });

  test("should redirect unauthenticated users to login when accessing protected routes", async ({
    page,
  }) => {
    // Try to access trips page without authentication
    await page.goto("/trips");

    // Should be redirected to login
    await expect(page).toHaveURL("/login");
  });
});
