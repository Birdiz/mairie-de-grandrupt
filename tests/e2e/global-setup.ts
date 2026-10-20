import { randomUUID } from "crypto";
import { request, type FullConfig } from "@playwright/test";

// En CI, la base SQLite est neuve à chaque exécution : on y crée par l'API REST
// un admin jetable (mot de passe aléatoire, jamais réutilisé) et les actualités
// publiées dont les tests ont besoin. En local, on garde les données du dev.
const ARTICLES = [
  {
    title: "Conseil municipal de mars 2026",
    slug: "conseil-municipal-mars-2026",
    date: "2026-03-20T12:00:00.000Z",
  },
  {
    title: "Fête du village 2026",
    slug: "fete-du-village-2026",
    date: "2026-02-10T12:00:00.000Z",
  },
  {
    title: "Travaux de voirie rue principale",
    slug: "travaux-voirie-rue-principale",
    date: "2026-01-15T12:00:00.000Z",
  },
  // L'accueil n'en affiche que 4 : la cinquième vérifie la limite.
  {
    title: "Vœux du maire 2026",
    slug: "voeux-du-maire-2026",
    date: "2026-01-08T12:00:00.000Z",
  },
  {
    title: "Collecte des sapins de Noël",
    slug: "collecte-des-sapins-de-noel",
    date: "2025-12-28T12:00:00.000Z",
  },
];

function lexicalParagraph(text: string) {
  return {
    root: {
      type: "root",
      format: "",
      indent: 0,
      version: 1,
      direction: "ltr",
      children: [
        {
          type: "paragraph",
          format: "",
          indent: 0,
          version: 1,
          direction: "ltr",
          textFormat: 0,
          children: [
            { type: "text", text, format: 0, detail: 0, mode: "normal", style: "", version: 1 },
          ],
        },
      ],
    },
  };
}

export default async function globalSetup(config: FullConfig) {
  if (!process.env.CI) return;

  const baseURL = config.projects[0]?.use.baseURL ?? "http://localhost:3000";
  const api = await request.newContext({ baseURL });

  const register = await api.post("/api/users/first-register", {
    data: { email: "e2e-admin@example.com", password: randomUUID(), name: "Admin E2E" },
  });
  if (!register.ok()) {
    throw new Error(`Création de l'admin E2E : ${register.status()} ${await register.text()}`);
  }
  const { token } = (await register.json()) as { token: string };

  for (const article of ARTICLES) {
    const res = await api.post("/api/actualites", {
      headers: { Authorization: `JWT ${token}` },
      data: {
        ...article,
        type: "standard",
        excerpt: `Résumé : ${article.title}.`,
        content: lexicalParagraph(`Contenu de l'article « ${article.title} ».`),
        _status: "published",
      },
    });
    if (!res.ok()) {
      throw new Error(`Création de « ${article.title} » : ${res.status()} ${await res.text()}`);
    }
  }

  await api.dispose();
}
