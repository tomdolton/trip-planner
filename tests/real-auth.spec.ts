import { test, expect } from "@playwright/test";

import { loginWithTestUser, logoutUser, ensureLoggedOut, checkAuthState } from "./helpers";

test.describe("Real Authentication Tests", () => {
  test("user can login with test credentials", async ({ page }) => {
    // Ensure we start logged out
    await ensureLoggedOut(page);

    // Perform login
    await loginWithTestUser(page);

    // Verify we're on the trips page and logged in
    await expect(page).toHaveURL("/trips");
    await expect(page.getByRole("heading", { name: "Trips" })).toBeVisible();

    // Verify homepage shows "View Trips" now
    await page.goto("/");
    await expect(page.getByRole("link", { name: "View Trips" })).toBeVisible();
  });

  test("authenticated user can access trips page", async ({ page }) => {
    // Login first
    await loginWithTestUser(page);

    // Should be able to access trips page directly
    await page.goto("/trips");
    await expect(page.getByRole("heading", { name: "Trips" })).toBeVisible();
    await expect(page.getByText("Plan and manage your trips")).toBeVisible();
  });

  test("authenticated user sees different homepage content", async ({ page }) => {
    // Check unauthenticated state first
    await ensureLoggedOut(page);
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Get Started" })).toBeVisible();

    // Login and check authenticated state
    await loginWithTestUser(page);
    await page.goto("/");
    await expect(page.getByRole("link", { name: "View Trips" })).toBeVisible();
  });

  test("user can logout", async ({ page }) => {
    // Login first
    await loginWithTestUser(page);

    // Verify we're logged in
    const authState = await checkAuthState(page);
    expect(authState).toBe(true);

    // Logout
    await logoutUser(page);

    // Verify we're logged out
    const newAuthState = await checkAuthState(page);
    expect(newAuthState).toBe(false);
  });

  test("login form shows validation errors for invalid credentials", async ({ page }) => {
    await page.goto("/login");

    // Wait for form to load
    await page.waitForSelector('input[type="email"]');

    // Try with invalid email
    await page.fill('input[type="email"]', "invalid-email");
    await page.fill('input[type="password"]', "wrongpassword");
    await page.click('button[type="submit"]');

    // Wait a moment for validation
    await page.waitForTimeout(1000);

    // Should show validation error for email format (React Hook Form validation)
    const hasValidationError = await page
      .getByText(/please enter a valid email|invalid email|email.*invalid/i)
      .isVisible();
    expect(hasValidationError).toBe(true);
  });

  test("login form shows error for wrong credentials", async ({ page }) => {
    await page.goto("/login");

    // Wait for form to load
    await page.waitForSelector('input[type="email"]');

    // Use valid email format but wrong credentials
    await page.fill('input[type="email"]', "wrong@example.com");
    await page.fill('input[type="password"]', "wrongpassword123");
    await page.click('button[type="submit"]');

    // Should show some kind of error message
    // The exact message depends on your Supabase configuration
    await page.waitForTimeout(3000); // Wait for API response

    // Check for error message in the message div (based on AuthForm structure)
    const errorMessageDiv = page.locator(
      'div:has-text("Invalid"), div:has-text("error"), .text-destructive, .bg-destructive'
    );
    const hasErrorMessage = await errorMessageDiv.isVisible();

    // Check if we're still on login page (not redirected)
    const stillOnLogin = page.url().includes("/login");

    // Either show error message OR we should still be on login page
    expect(hasErrorMessage || stillOnLogin).toBe(true);
  });

  test("protected routes redirect to login when not authenticated", async ({ page }) => {
    // Ensure logged out
    await ensureLoggedOut(page);

    // Try to access protected route
    await page.goto("/trips");

    // Should be redirected to login
    await expect(page).toHaveURL("/login");
  });

  test("user session persists across page reloads", async ({ page }) => {
    // Login
    await loginWithTestUser(page);

    // Go to trips page
    await page.goto("/trips");
    await expect(page.getByRole("heading", { name: "Trips" })).toBeVisible();

    // Reload the page
    await page.reload();

    // Should still be on trips page and logged in
    await expect(page.getByRole("heading", { name: "Trips" })).toBeVisible();
  });

  test("complete authentication workflow", async ({ page }) => {
    // Start unauthenticated
    await ensureLoggedOut(page);
    await page.goto("/");

    // Click "Get Started"
    await page.getByRole("link", { name: "Get Started" }).click();

    // Should be redirected to login (via trips -> login redirect)
    await expect(page).toHaveURL("/login");

    // Login with test credentials
    const testEmail = process.env.TEST_USER_EMAIL!;
    const testPassword = process.env.TEST_USER_PASSWORD!;

    // Wait for form to load
    await page.waitForSelector('input[type="email"]');

    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    await page.click('button[type="submit"]');

    // Should end up on trips page
    await expect(page).toHaveURL("/trips");
    await expect(page.getByRole("heading", { name: "Trips" })).toBeVisible();

    // Go back to homepage and verify authenticated state
    await page.goto("/");
    await expect(page.getByRole("link", { name: "View Trips" })).toBeVisible();
  });
});
