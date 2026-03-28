import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("homepage loads and has main heading", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Grandrupt/i);
    await expect(page.getByRole("main")).toBeVisible();
  });

  test("navigation links are accessible", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation");
    await expect(nav).toBeVisible();
  });

  test("skip link is present and functional", async ({ page }) => {
    await page.goto("/");
    const skipLink = page.getByRole("link", { name: /aller au contenu/i });
    await expect(skipLink).toBeAttached();
  });

  test("contact page loads", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});
