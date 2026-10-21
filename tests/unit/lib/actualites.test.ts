import { describe, it, expect, vi } from "vitest";

// toArticle is pure; the Payload client is never reached in these tests.
vi.mock("payload", () => ({ getPayload: vi.fn() }));
vi.mock("@payload-config", () => ({ default: {} }));

import { toArticle } from "@/lib/actualites";

const content = (text: string) => ({ root: { children: [{ text }] } });

const doc = {
  slug: "fete",
  type: "standard",
  date: "2026-07-04T00:00:00.000Z",
  title: { fr: "Fête du village", de: "Dorffest", en: null },
  excerpt: { fr: "Programme à venir.", de: "Programm folgt.", en: null },
  content: { fr: content("fr"), de: content("de"), en: null },
};

describe("toArticle", () => {
  it("uses the translation when the article exists in that language", () => {
    const article = toArticle(doc, "de");
    expect(article.contentLocale).toBe("de");
    expect(article.title).toBe("Dorffest");
    expect(article.excerpt).toBe("Programm folgt.");
    expect(article.content).toEqual(content("de"));
  });

  it("falls back to French as a whole when there is no translation", () => {
    const article = toArticle(doc, "en");
    expect(article.contentLocale).toBe("fr");
    expect(article.title).toBe("Fête du village");
    expect(article.content).toEqual(content("fr"));
  });

  it("keeps French on the French site", () => {
    expect(toArticle(doc, "fr").title).toBe("Fête du village");
  });

  it("keeps procès-verbaux in French even if a translation exists", () => {
    const article = toArticle({ ...doc, type: "proces-verbal" }, "de");
    expect(article.contentLocale).toBe("fr");
    expect(article.title).toBe("Fête du village");
  });

  it("does not mix languages when only the title is translated", () => {
    const partial = { ...doc, content: { fr: content("fr"), de: null, en: null } };
    expect(toArticle(partial, "de").title).toBe("Fête du village");
  });

  it("still reads single-language documents", () => {
    const plain = { ...doc, title: "Titre", excerpt: "Résumé", content: content("x") };
    expect(toArticle(plain, "fr").title).toBe("Titre");
    expect(toArticle(plain, "de").contentLocale).toBe("fr");
  });
});
