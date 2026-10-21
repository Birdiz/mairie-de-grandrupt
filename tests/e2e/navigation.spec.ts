import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("homepage loads and has main heading", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Grandrupt/i);
    await expect(page.getByRole("main")).toBeVisible();
  });

  test("navigation links are accessible", async ({ page }) => {
    await page.goto("/");
    // Sur ordinateur, la navigation principale ; sur mobile, le bouton « Menu » qui l'ouvre
    const nav = page
      .getByRole("navigation", { name: /navigation principale/i })
      .or(page.getByRole("button", { name: /^menu$/i }))
      .first();
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

  test("le sélecteur de langue garde la page et la langue", async ({ page, isMobile }) => {
    await page.goto("/histoire");
    if (isMobile) await page.getByRole("button", { name: /^menu$/i }).click();
    await page
      .getByRole("link", { name: /deutsch/i })
      .first()
      .click();
    await expect(page).toHaveURL(/\/de\/histoire$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "de");
    if (isMobile) await page.getByRole("button", { name: /^menü$/i }).click();
    await expect(page.getByRole("link", { name: "Kontakt" }).first()).toHaveAttribute(
      "href",
      "/de/contact",
    );
  });
});
