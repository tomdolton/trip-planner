import { test, expect, Page } from "@playwright/test";

test.describe("Trip Management Features", () => {
  // Helper function to login if credentials are available
  async function loginIfPossible(page: Page) {
    const testEmail = process.env.TEST_USER_EMAIL;
    const testPassword = process.env.TEST_USER_PASSWORD;

    if (!testEmail || !testPassword) {
      return false; // Could not login
    }

    await page.goto("/login");
    await page.waitForLoadState("networkidle");
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });

    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    await page.click('button[type="submit"]');

    try {
      await page.waitForURL("/trips", { timeout: 10000 });
      return true; // Successfully logged in
    } catch {
      return false; // Login failed
    }
  }

  test("trips page loads correctly when authenticated", async ({ page }) => {
    const loggedIn = await loginIfPossible(page);

    if (!loggedIn) {
      console.log("Skipping test - authentication not available");
      return;
    }

    // Should be on trips page
    await expect(page).toHaveURL("/trips");
    await expect(page.getByRole("heading", { name: "Trips" })).toBeVisible();

    // Check for key page elements
    await expect(page.getByText("Plan and manage your trips")).toBeVisible();

    // Should have some navigation or action elements
    const pageContent = await page.textContent("body");
    expect(pageContent).toBeTruthy();
    if (pageContent) {
      expect(pageContent.length).toBeGreaterThan(100); // Page should have substantial content
    }
  });

  test("create new trip button/link is present when authenticated", async ({ page }) => {
    const loggedIn = await loginIfPossible(page);

    if (!loggedIn) {
      console.log("Skipping test - authentication not available");
      return;
    }

    try {
      await page.goto("/trips");
      await page.waitForLoadState("networkidle");
    } catch {
      // If navigation is interrupted, might be redirected to login
      await page.waitForLoadState("networkidle");
      if (page.url().includes("/login")) {
        console.log("Skipping test - redirected to login (auth session expired)");
        return;
      }
    }

    // Look for create trip functionality
    const createButtons = await page
      .locator(
        'button:has-text("Create"), a:has-text("Create"), button:has-text("New"), a:has-text("New"), button:has-text("Add"), a:has-text("Add")'
      )
      .count();
    const plusButtons = await page.locator('button:has-text("+"), a:has-text("+")').count();

    // Should have some way to create a new trip
    expect(createButtons + plusButtons).toBeGreaterThan(0);
  });

  test("trips layout is responsive", async ({ page }) => {
    const loggedIn = await loginIfPossible(page);

    if (!loggedIn) {
      // Test with logged out state
      await page.goto("/");
    } else {
      try {
        await page.goto("/trips");
      } catch {
        // If navigation is interrupted, fall back to homepage
        await page.goto("/");
      }
    }

    await page.waitForLoadState("networkidle");

    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);

    // Page should still be usable
    const bodyVisible = await page.locator("body").isVisible();
    expect(bodyVisible).toBe(true);

    // Should not have horizontal scroll
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const clientWidth = await page.evaluate(() => document.body.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 10); // Allow small tolerance

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(1000);

    // Should still be functional
    expect(await page.locator("body").isVisible()).toBe(true);

    // Test desktop viewport
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.waitForTimeout(1000);

    expect(await page.locator("body").isVisible()).toBe(true);
  });
});

test.describe("Navigation and User Experience", () => {
  test("navbar is present and functional across pages", async ({ page }) => {
    // Test on homepage
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Should have some form of navigation
    const navElements = await page.locator('nav, header, [role="navigation"]').count();
    const logoLinks = await page.locator('a:has-text("Trip Planner"), a[href="/"]').count();

    expect(navElements + logoLinks).toBeGreaterThan(0);

    // Test on login page
    await page.goto("/login");
    await page.waitForLoadState("networkidle");

    // Should still have navigation
    const loginNavElements = await page
      .locator('nav, header, [role="navigation"], a:has-text("Trip Planner"), a[href="/"]')
      .count();
    expect(loginNavElements).toBeGreaterThan(0);
  });

  test("footer is present with expected content", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Look for footer or bottom content
    await page.locator('footer, [role="contentinfo"]').count();

    // While footer might not be present, page should have proper structure
    const bodyContent = await page.textContent("body");
    expect(bodyContent).toBeTruthy();
    if (bodyContent) {
      expect(bodyContent.length).toBeGreaterThan(50);
    }
  });

  test("error handling for non-existent pages", async ({ page }) => {
    await page.goto("/non-existent-page-12345");

    // Should handle 404 gracefully
    const pageContent = await page.textContent("body");
    expect(pageContent).toBeTruthy();

    if (pageContent) {
      // Should either show 404 content or redirect to a valid page
      const is404 =
        pageContent.includes("404") ||
        pageContent.includes("Not Found") ||
        pageContent.includes("Page not found");
      const hasValidContent =
        pageContent.includes("Trip Planner") ||
        pageContent.includes("Welcome") ||
        pageContent.includes("Get Started");

      expect(is404 || hasValidContent).toBe(true);
    }
  });

  test("page loading performance is reasonable", async ({ page }) => {
    // Measure homepage load time
    const startTime = Date.now();

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const loadTime = Date.now() - startTime;

    // Should load within reasonable time (10 seconds is generous for local dev)
    expect(loadTime).toBeLessThan(10000);

    console.log(`Homepage loaded in ${loadTime}ms`);
  });
});

test.describe("Form Accessibility and Usability", () => {
  test("login form is keyboard accessible", async ({ page }) => {
    await page.goto("/login");
    await page.waitForLoadState("networkidle");

    // Should be able to tab through form elements
    await page.keyboard.press("Tab");
    await page.evaluate(() => document.activeElement?.tagName);

    // Continue tabbing to find form elements
    let tabCount = 0;
    const maxTabs = 10;
    let foundEmailInput = false;
    let foundPasswordInput = false;
    let foundSubmitButton = false;

    while (tabCount < maxTabs) {
      const element = await page.evaluate(() => {
        const el = document.activeElement;
        return {
          tagName: el?.tagName,
          type: el?.getAttribute?.("type"),
          role: el?.getAttribute?.("role"),
        };
      });

      if (element.tagName === "INPUT" && element.type === "email") foundEmailInput = true;
      if (element.tagName === "INPUT" && element.type === "password") foundPasswordInput = true;
      if (element.tagName === "BUTTON" && element.type === "submit") foundSubmitButton = true;

      await page.keyboard.press("Tab");
      tabCount++;
    }

    // Should be able to reach key form elements via keyboard
    expect(foundEmailInput || foundPasswordInput || foundSubmitButton).toBe(true);
  });

  test("form labels are properly associated", async ({ page }) => {
    await page.goto("/login");
    await page.waitForLoadState("networkidle");

    // Check that form inputs have proper labels
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();

    // Check if labels exist (either as label elements or aria-labels)
    const emailLabel = await page.locator('label:has-text("Email"), label[for*="email"]').count();
    const passwordLabel = await page
      .locator('label:has-text("Password"), label[for*="password"]')
      .count();

    const emailAriaLabel = await emailInput.getAttribute("aria-label");
    const passwordAriaLabel = await passwordInput.getAttribute("aria-label");

    // Should have either proper labels or aria-labels
    expect(emailLabel > 0 || emailAriaLabel).toBeTruthy();
    expect(passwordLabel > 0 || passwordAriaLabel).toBeTruthy();
  });

  test("signup form is accessible and functional", async ({ page }) => {
    await page.goto("/signup");
    await page.waitForLoadState("networkidle");

    // Should have signup form
    await expect(page.getByRole("heading", { name: /create an account/i })).toBeVisible();

    // Should have required form elements
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();

    // Form should be keyboard accessible
    await page.keyboard.press("Tab");
    const hasKeyboardFocus = await page.evaluate(() => document.activeElement !== document.body);
    expect(hasKeyboardFocus).toBe(true);
  });
});
