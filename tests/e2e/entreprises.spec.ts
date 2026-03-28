import { test, expect } from "@playwright/test";

test.describe("Entreprises", () => {
  test("la page affiche un titre h1", async ({ page }) => {
    await page.goto("/entreprises");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("affiche les cartes des entreprises", async ({ page }) => {
    await page.goto("/entreprises");
    const cards = page.getByRole("listitem");
    await expect(cards).toHaveCount(3);
  });

  test("chaque carte affiche un lien téléphone cliquable", async ({ page }) => {
    await page.goto("/entreprises");
    const telLinks = page.locator('a[href^="tel:"]');
    await expect(telLinks).toHaveCount(3);
  });

  test("le CTA 'Contacter la mairie' pointe vers /contact", async ({ page }) => {
    await page.goto("/entreprises");
    const cta = page.getByRole("link", { name: /contacter la mairie/i });
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute("href", "/contact");
  });
});
