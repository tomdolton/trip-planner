import { test, expect } from "@playwright/test";

test.describe("Working E2E Tests", () => {
  test("homepage loads correctly", async ({ page }) => {
    await page.goto("/");

    // Page loads with correct title
    await expect(page).toHaveTitle("Trip Planner");

    // Main heading is visible
    await expect(page.getByRole("heading", { name: "Trip Planner" })).toBeVisible();

    // CTA button exists (either "Get Started" or "View Trips")
    const ctaButton = page.getByRole("link").filter({ hasText: /Get Started|View Trips/ });
    await expect(ctaButton).toBeVisible();

    // Button links to trips page
    await expect(ctaButton).toHaveAttribute("href", "/trips");
  });

  test("login page loads and has correct form", async ({ page }) => {
    await page.goto("/login");

    // Page loads
    await expect(page).toHaveTitle("Trip Planner");

    // Form elements are present
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();

    // Has correct heading
    await expect(page.getByRole("heading", { name: /sign in to your account/i })).toBeVisible();
  });

  test("signup page loads and has correct form", async ({ page }) => {
    await page.goto("/signup");

    // Page loads
    await expect(page).toHaveTitle("Trip Planner");

    // Form elements are present
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByRole("button", { name: /create account/i })).toBeVisible();

    // Has correct heading
    await expect(page.getByRole("heading", { name: /create an account/i })).toBeVisible();
  });

  test("form validation works on login page", async ({ page }) => {
    await page.goto("/login");

    // Try to submit empty form
    await page.getByRole("button", { name: /sign in/i }).click();

    // Should show validation errors
    await expect(page.getByText(/please enter a valid email/i)).toBeVisible();
    await expect(page.getByText(/password must be at least 6 characters/i)).toBeVisible();
  });

  test("can fill out login form", async ({ page }) => {
    await page.goto("/login");
    
    // Wait for form to be fully loaded
    await page.waitForSelector('input[type="email"]');
    await page.waitForTimeout(500); // Small delay for form initialization

    // Fill out the form with slower typing
    const emailInput = page.getByLabel("Email");
    const passwordInput = page.getByLabel("Password");
    
    await emailInput.fill("test@example.com");
    await passwordInput.fill("password123");
    
    // Wait a bit for the form to process the input
    await page.waitForTimeout(200);

    // Form should accept the input
    await expect(emailInput).toHaveValue("test@example.com");
    await expect(passwordInput).toHaveValue("password123");
  });

  test("protected routes redirect to login", async ({ page }) => {
    // Try to access trips page without authentication
    await page.goto("/trips");

    // Should be redirected to login
    await expect(page).toHaveURL("/login");
  });

  test("navigation works on mobile viewport", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto("/");

    // Content should still be visible on mobile
    await expect(page.getByRole("heading", { name: "Trip Planner" })).toBeVisible();

    // Test login page on mobile
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: /sign in/i })).toBeVisible();
  });

  test("handles 404 pages gracefully", async ({ page }) => {
    await page.goto("/non-existent-page");

    // Should load something (either 404 page or redirect)
    await expect(page.locator("body")).toBeVisible();

    // Should have some content
    const content = await page.content();
    expect(content.length).toBeGreaterThan(1000);
  });

  test("basic accessibility with keyboard navigation", async ({ page }) => {
    await page.goto("/");

    // Should be able to tab to interactive elements
    await page.keyboard.press("Tab");

    // Some element should have focus
    const focusedElement = page.locator(":focus");
    await expect(focusedElement).toBeVisible();
  });

  test("handles network errors gracefully", async ({ page }) => {
    // Mock API failures
    await page.route("**/api/**", (route) => {
      route.abort("failed");
    });

    await page.goto("/");

    // Page should still load even with API failures
    await expect(page.getByRole("heading", { name: "Trip Planner" })).toBeVisible();
  });

  test("app loads without JavaScript errors", async ({ page }) => {
    const errors: string[] = [];

    // Capture console errors
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Filter out known/acceptable errors
    const significantErrors = errors.filter(
      (error) =>
        !error.includes("favicon") &&
        !error.includes("service-worker") &&
        !error.includes("manifest")
    );

    expect(significantErrors).toHaveLength(0);
  });
});
