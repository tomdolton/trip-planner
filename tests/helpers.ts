import { Page, expect } from "@playwright/test";

/**
 * Authentication helpers using real test credentials
 */
export async function loginWithTestUser(page: Page): Promise<void> {
  const email = process.env.TEST_USER_EMAIL;
  const password = process.env.TEST_USER_PASSWORD;

  if (!email || !password) {
    throw new Error("TEST_USER_EMAIL and TEST_USER_PASSWORD must be set in .env file");
  }

  // Navigate to login page
  await page.goto("/login");
  await page.waitForLoadState("networkidle");

  // Wait for form to load
  await page.waitForSelector('input[type="email"]', { timeout: 10000 });
  await page.waitForSelector('input[type="password"]', { timeout: 10000 });
  await page.waitForSelector('button[type="submit"]', { timeout: 10000 });

  // Fill in the login form using React Hook Form field structure
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);

  // Submit the form
  await page.click('button[type="submit"]');

  // Wait for authentication to complete - check for redirect or success indicators
  await page.waitForURL((url) => !url.pathname.includes("/login"), { timeout: 15000 });

  // Wait for the page to fully load after redirect
  await page.waitForLoadState("networkidle");

  // Give auth state time to update
  await page.waitForTimeout(2000);
}
export async function logoutUser(page: Page): Promise<void> {
  try {
    // Look for common logout patterns
    const logoutButton = page
      .locator(
        'button:has-text("logout"), button:has-text("log out"), button:has-text("sign out"), a:has-text("logout"), a:has-text("log out"), a:has-text("sign out")'
      )
      .first();

    if (await logoutButton.isVisible({ timeout: 2000 })) {
      await logoutButton.click();
      await page.waitForTimeout(1000);
    } else {
      // If no logout button found, navigate to homepage
      // The auth state should reset naturally
      await page.goto("/");
      await page.waitForLoadState("networkidle");
    }
  } catch {
    // Fallback: just navigate to homepage
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  }
}

export async function ensureLoggedOut(page: Page): Promise<void> {
  try {
    // Navigate to homepage first to establish context
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000); // Let auth state resolve

    // Check if we're already logged out by looking for "Get Started"
    const getStartedVisible = await page
      .locator('a[href="/trips"]:has-text("Get Started")')
      .isVisible({ timeout: 3000 });

    if (getStartedVisible) {
      // Already logged out
      return;
    }

    // If we see "View Trips", we're logged in and need to logout
    const viewTripsVisible = await page
      .locator('a[href="/trips"]:has-text("View Trips")')
      .isVisible({ timeout: 3000 });

    if (viewTripsVisible) {
      // Look for logout button
      const logoutButton = page.locator(
        'button:has-text("logout"), button:has-text("log out"), button:has-text("sign out"), a:has-text("logout"), a:has-text("log out"), a:has-text("sign out")'
      );
      if (await logoutButton.isVisible({ timeout: 2000 })) {
        await logoutButton.click();
        await page.waitForTimeout(1000);
      }
    }

    // Navigate to homepage again to ensure we're in a clean state
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000); // Let auth state resolve
  } catch (error) {
    // If all else fails, just navigate to homepage
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);
  }
}

export async function checkAuthState(page: Page): Promise<boolean> {
  // Check for authenticated UI elements
  const isLoggedIn = await page
    .locator('a:has-text("View Trips"), button:has-text("View Trips"), a[href="/trips"]')
    .isVisible({ timeout: 2000 });
  return isLoggedIn;
}

/**
 * Main test helper class
 */
export class TripPlannerTestHelpers {
  constructor(private page: Page) {}

  async goToHomepage(): Promise<void> {
    await this.page.goto("/");
    await this.waitForPageLoad();
  }

  async goToTripsPage(): Promise<void> {
    await this.page.goto("/trips");
    await this.waitForPageLoad();
  }

  async goToLoginPage(): Promise<void> {
    await this.page.goto("/login");
    await this.waitForPageLoad();
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForTimeout(1000); // Additional buffer
  }

  async checkForErrors(): Promise<void> {
    // Check for any visible error messages
    const errorSelectors = [
      '[data-testid="error"]',
      ".error",
      '[role="alert"]',
      ".alert-error",
      "text=/error/i",
      "text=/something went wrong/i",
    ];

    for (const selector of errorSelectors) {
      const errorElement = this.page.locator(selector);
      if (await errorElement.isVisible()) {
        const errorText = await errorElement.textContent();
        throw new Error(`Found error on page: ${errorText}`);
      }
    }
  }

  async fillTripForm(tripData: {
    name: string;
    description?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<void> {
    await this.page.fill('input[name="name"]', tripData.name);

    if (tripData.description) {
      await this.page.fill('textarea[name="description"]', tripData.description);
    }

    if (tripData.startDate) {
      await this.page.fill('input[name="startDate"]', tripData.startDate);
    }

    if (tripData.endDate) {
      await this.page.fill('input[name="endDate"]', tripData.endDate);
    }
  }

  async submitForm(): Promise<void> {
    await this.page.click('button[type="submit"]');
    await this.waitForPageLoad();
  }

  async expectToastMessage(message: string): Promise<void> {
    const toast = this.page.locator('.toast, [data-testid="toast"], [role="status"]');
    await expect(toast).toContainText(message);
  }

  /**
   * Check if user appears to be logged in
   */
  async isLoggedIn(): Promise<boolean> {
    await this.page.goto("/");
    const viewTripsLink = this.page.getByRole("link", { name: "View Trips" });
    const getStartedLink = this.page.getByRole("link", { name: "Get Started" });

    if (await viewTripsLink.isVisible()) {
      return true;
    } else if (await getStartedLink.isVisible()) {
      return false;
    }

    // Fallback - try to detect based on URL behavior
    await this.page.goto("/trips");
    const currentUrl = this.page.url();
    return !currentUrl.includes("/login");
  }

  /**
   * Take a screenshot with a custom name
   */
  async takeScreenshot(name: string) {
    await this.page.screenshot({ path: `test-results/${name}.png` });
  }
}
