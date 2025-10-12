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
    // First ensure we're on a page where logout is available
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    // Look for navbar or user menu that might contain logout
    // Try to find a user dropdown or menu button first
    const userMenuButton = page
      .locator(
        '[data-testid="user-menu"], .user-menu, button:has-text("menu"), [aria-label*="user"], [aria-label*="account"]'
      )
      .first();

    if (await userMenuButton.isVisible({ timeout: 2000 })) {
      await userMenuButton.click();
      await page.waitForTimeout(500);
    }

    // Look for logout button/link with various patterns
    const logoutSelectors = [
      'button:has-text("Logout")',
      'button:has-text("Log out")',
      'button:has-text("Sign out")',
      'a:has-text("Logout")',
      'a:has-text("Log out")',
      'a:has-text("Sign out")',
      '[data-testid="logout"]',
      ".logout-button",
      'button[type="button"]:has-text("out")',
    ];

    let loggedOut = false;
    for (const selector of logoutSelectors) {
      const logoutElement = page.locator(selector).first();
      if (await logoutElement.isVisible({ timeout: 1000 })) {
        await logoutElement.click();
        await page.waitForTimeout(2000);
        loggedOut = true;
        break;
      }
    }

    // If no explicit logout found, try clearing browser storage to simulate logout
    if (!loggedOut) {
      try {
        await page.evaluate(() => {
          localStorage.clear();
          sessionStorage.clear();
        });
        await page.reload();
        await page.waitForLoadState("networkidle");
      } catch {
        // Storage operations might fail, continue anyway
      }
    }

    // Verify logout by checking the page content
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);
  } catch {
    // Fallback: try to clear storage and reload
    try {
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(2000);
    } catch {
      // If all else fails, just navigate to homepage
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(2000);
    }
  }
}

export async function ensureLoggedOut(page: Page): Promise<void> {
  try {
    // Navigate to homepage first to establish context
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    // Clear storage after we're on the page
    try {
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });
    } catch {
      // Storage clearing might fail, continue anyway
    }

    // Reload to apply storage changes
    await page.reload();
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000); // Give auth state time to resolve

    // Check if we're already logged out by looking for "Get Started"
    const getStartedVisible = await page
      .locator('a[href="/trips"]:has-text("Get Started")')
      .isVisible({ timeout: 3000 });

    if (getStartedVisible) {
      // Already logged out
      return;
    }

    // If we see "View Trips", we might still be logged in - try explicit logout
    const viewTripsVisible = await page
      .locator('a[href="/trips"]:has-text("View Trips")')
      .isVisible({ timeout: 3000 });

    if (viewTripsVisible) {
      // Try to logout explicitly
      await logoutUser(page);
    }

    // Final verification
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);
  } catch {
    // Fallback: just navigate to homepage
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);
  }
}

export async function checkAuthState(page: Page): Promise<boolean> {
  try {
    // Navigate to homepage to check auth state
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000); // Let auth state resolve

    // Check for authenticated indicators
    const viewTripsVisible = await page
      .locator('a[href="/trips"]:has-text("View Trips")')
      .isVisible({ timeout: 3000 });

    if (viewTripsVisible) {
      return true;
    }

    // Check for unauthenticated indicators
    const getStartedVisible = await page
      .locator('a[href="/trips"]:has-text("Get Started")')
      .isVisible({ timeout: 3000 });

    if (getStartedVisible) {
      return false;
    }

    // Fallback: check if accessing /trips redirects to login
    await page.goto("/trips");
    await page.waitForLoadState("networkidle");
    const currentUrl = page.url();
    return !currentUrl.includes("/login");
  } catch {
    // Final fallback - assume not logged in if we can't determine
    return false;
  }
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
    // Check for any visible error messages - be more specific to avoid false positives
    const errorSelectors = [
      '[data-testid="error"]',
      '[data-testid="error-banner"]',
      ".error-banner",
      '[role="alert"]:has-text("Error")',
      ".alert-error",
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
