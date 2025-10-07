import { Page, expect } from "@playwright/test";

/**
 * Common test utilities for the trip planner E2E tests
 */

export class TripPlannerTestHelpers {
  constructor(private page: Page) {}

  /**
   * Navigate to homepage and verify it loads correctly
   */
  async goToHomepage() {
    await this.page.goto("/");
    await expect(this.page.getByRole("heading", { name: "Trip Planner" })).toBeVisible();
  }

  /**
   * Navigate to trips page and verify it loads correctly
   */
  async goToTripsPage() {
    await this.page.goto("/trips");
    await expect(this.page.getByRole("heading", { name: "Trips" })).toBeVisible();
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
   * Wait for page to be fully loaded
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Take a screenshot with a custom name
   */
  async takeScreenshot(name: string) {
    await this.page.screenshot({ path: `test-results/${name}.png` });
  }

  /**
   * Check for common error messages
   */
  async checkForErrors() {
    const errorMessages = [
      "Error",
      "Failed to load",
      "Something went wrong",
      "Network error",
      "500",
      "404",
    ];

    for (const errorMsg of errorMessages) {
      const errorElement = this.page.getByText(errorMsg).first();
      if (await errorElement.isVisible()) {
        throw new Error(`Found error message: ${errorMsg}`);
      }
    }
  }
}

/**
 * Mock authentication state for testing
 */
/**
 * Mock authentication state for testing
 */
export async function mockAuthenticatedUser(page: Page) {
  // Mock Supabase client and auth methods
  await page.addInitScript(() => {
    // Create a mock user object
    const mockUser = {
      id: "mock-user-id",
      email: "test@example.com",
      aud: "authenticated",
      role: "authenticated",
      email_confirmed_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Mock the localStorage auth token
    const mockSession = {
      access_token: "mock-access-token",
      refresh_token: "mock-refresh-token",
      expires_in: 3600,
      expires_at: Date.now() / 1000 + 3600,
      token_type: "bearer",
      user: mockUser,
    };

    // Store in localStorage (Supabase format)
    const authKey = "sb-" + window.location.hostname.replace(/\./g, "-") + "-auth-token";
    localStorage.setItem(authKey, JSON.stringify(mockSession));

    // Override window.supabase methods if they exist
    if (window.supabase) {
      window.supabase.auth = {
        ...window.supabase.auth,
        getUser: () => Promise.resolve({ data: { user: mockUser }, error: null }),
        getSession: () => Promise.resolve({ data: { session: mockSession }, error: null }),
        onAuthStateChange: (callback: any) => {
          // Immediately call with mock session
          setTimeout(() => callback("SIGNED_IN", mockSession), 100);
          return { data: { subscription: { unsubscribe: () => {} } } };
        },
      };
    }
  });

  // Mock Supabase API responses
  await page.route("**/auth/v1/user**", (route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        user: {
          id: "mock-user-id",
          email: "test@example.com",
          aud: "authenticated",
          role: "authenticated",
        },
      }),
    });
  });
}

/**
 * Mock unauthenticated state for testing
 */
export async function mockUnauthenticatedUser(page: Page) {
  await page.addInitScript(() => {
    localStorage.clear();
  });

  // Mock Supabase API to return no user
  await page.route("**/auth/v1/user**", (route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ user: null }),
    });
  });
}
