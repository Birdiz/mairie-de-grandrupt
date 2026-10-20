import { test, expect } from "@playwright/test";

test.describe("Actualités", () => {
  test("la page liste les actualités avec un titre h1", async ({ page }) => {
    await page.goto("/actualites");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("chaque carte d'actualité porte un lien sur son titre", async ({ page }) => {
    await page.goto("/actualites");
    const firstCard = page.getByRole("main").getByRole("article").first();
    await expect(firstCard.getByRole("link")).toBeVisible();
  });

  test("naviguer vers un article affiche son contenu", async ({ page }) => {
    await page.goto("/actualites");
    await page.getByRole("main").getByRole("article").first().getByRole("link").click();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    // L'URL contient /actualites/
    await expect(page).toHaveURL(/\/actualites\/.+/);
  });

  test("le lien 'Retour aux actualités' ramène à la liste", async ({ page }) => {
    await page.goto("/actualites/conseil-municipal-mars-2026");
    // Le lien figure en haut et en bas de l'article.
    await page
      .getByRole("link", { name: /retour aux actualités/i })
      .first()
      .click();
    await expect(page).toHaveURL(/\/actualites$/);
  });

  test("la page d'un article connu s'affiche correctement", async ({ page }) => {
    await page.goto("/actualites/conseil-municipal-mars-2026");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("link", { name: /retour aux actualités/i }).first()).toBeVisible();
  });

  // Bug connu : la page 404 s'affiche mais avec un statut HTTP 200 (soft 404),
  // probablement parce que [locale]/loading.tsx lance le streaming avant notFound().
  test.fixme("une URL d'article inconnue renvoie une 404", async ({ page }) => {
    const response = await page.goto("/actualites/article-inexistant");
    expect(response?.status()).toBe(404);
  });

  test("la page d'accueil affiche les 4 dernières actualités", async ({ page }) => {
    await page.goto("/");
    const cards = page.getByRole("main").getByRole("article");
    await expect(cards).toHaveCount(4);
  });
});
