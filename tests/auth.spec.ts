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
    
    // Wait for form to be fully loaded
    await page.waitForSelector('input[type="email"]');
    await page.waitForTimeout(500); // Small delay for form initialization

    // Fill in the form with slower typing
    const emailInput = page.getByLabel("Email");
    const passwordInput = page.getByLabel("Password");
    
    await emailInput.fill("test@example.com");
    await passwordInput.fill("password123");
    
    // Wait a bit for the form to process the input
    await page.waitForTimeout(200);

    // Verify the form was filled
    await expect(emailInput).toHaveValue("test@example.com");
    await expect(passwordInput).toHaveValue("password123");
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
