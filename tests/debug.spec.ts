import { test, expect } from "@playwright/test";

test.describe("Basic connectivity", () => {
  test("should be able to load the homepage", async ({ page }) => {
    await page.goto("/");

    // Wait longer for the page to load
    await page.waitForLoadState("networkidle");

    // Debug what we're getting
    const title = await page.title();
    console.log("Page title:", title);

    const content = await page.content();
    console.log("Page content length:", content.length);

    // Check if we have any visible content
    const bodyText = await page.locator("body").textContent();
    console.log("Body text preview:", bodyText?.substring(0, 200));

    // Look for any headings
    const headings = await page.locator("h1, h2, h3").allTextContents();
    console.log("Found headings:", headings);

    // At minimum, the page should load something
    await expect(page.locator("body")).toBeVisible();
  });

  test("should be able to access auth pages", async ({ page }) => {
    await page.goto("/login");
    await page.waitForLoadState("networkidle");

    const title = await page.title();
    console.log("Login page title:", title);

    // Should at least load the page
    await expect(page.locator("body")).toBeVisible();
  });
});
