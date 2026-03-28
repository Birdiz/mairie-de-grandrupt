import { test, expect } from "@playwright/test";

test.describe("Contact — formulaire", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contact");
  });

  test("affiche les champs du formulaire avec leurs labels", async ({ page }) => {
    await expect(page.getByLabel(/votre nom/i)).toBeVisible();
    await expect(page.getByLabel(/adresse e-mail/i)).toBeVisible();
    await expect(page.getByLabel(/sujet/i)).toBeVisible();
    await expect(page.getByLabel(/votre message/i)).toBeVisible();
  });

  test("affiche des erreurs de validation sur soumission vide", async ({ page }) => {
    await page.getByRole("button", { name: /envoyer/i }).click();
    await expect(page.getByText(/au moins 2 caractères/i)).toBeVisible();
  });

  test("valide le format de l'e-mail", async ({ page }) => {
    await page.getByLabel(/votre nom/i).fill("Jean Dupont");
    await page.getByLabel(/adresse e-mail/i).fill("pas-un-email");
    await page.getByLabel(/sujet/i).fill("Mon sujet");
    await page.getByLabel(/votre message/i).fill("Ceci est un message de test.");
    await page.getByRole("button", { name: /envoyer/i }).click();
    await expect(page.getByText(/adresse e-mail valide/i)).toBeVisible();
  });

  test("valide la longueur minimale du message", async ({ page }) => {
    await page.getByLabel(/votre nom/i).fill("Jean Dupont");
    await page.getByLabel(/adresse e-mail/i).fill("jean@exemple.fr");
    await page.getByLabel(/sujet/i).fill("Sujet");
    await page.getByLabel(/votre message/i).fill("Court");
    await page.getByRole("button", { name: /envoyer/i }).click();
    await expect(page.getByText(/au moins 10 caractères/i)).toBeVisible();
  });

  test("le bouton d'envoi est accessible au clavier", async ({ page }) => {
    const button = page.getByRole("button", { name: /envoyer/i });
    await expect(button).toBeEnabled();
    await button.focus();
    await expect(button).toBeFocused();
  });
});
