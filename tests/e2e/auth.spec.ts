import { expect, test } from "@playwright/test";

test.describe("Authentication flows", () => {
  test("homepage renders and has sign-in link", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Next Blog" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Log in" })).toBeVisible();
  });

  test("unauthenticated user is redirected from create to sign-in", async ({ page }) => {
    await page.goto("/create");
    // Should redirect to sign-in with callbackUrl
    await page.waitForURL(/\/sign-in/);
    await expect(page.getByRole("heading", { name: "Next Blog" })).toBeVisible();
  });

  test("sign-in page shows OAuth provider buttons", async ({ page }) => {
    await page.goto("/sign-in");
    await expect(page.getByRole("button", { name: /GitHub/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Google/i })).toBeVisible();
  });

  test("sign-up page links back to sign-in", async ({ page }) => {
    await page.goto("/sign-up");
    await expect(page.getByRole("heading", { name: "Next Blog" })).toBeVisible();
    const signInLink = page.getByRole("link", { name: "Sign in" });
    await expect(signInLink).toBeVisible();
    await signInLink.click();
    await page.waitForURL(/\/sign-in/);
  });

  test("404 page renders for unknown routes", async ({ page }) => {
    await page.goto("/this-does-not-exist");
    await expect(page.getByText("404")).toBeVisible();
  });
});
