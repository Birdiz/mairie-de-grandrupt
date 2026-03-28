import { describe, it, expect } from "vitest";
import { formatDate, getAllArticles, getArticleBySlug, getAllSlugs } from "@/lib/actualites";

describe("formatDate", () => {
  it("returns a non-empty string", () => {
    expect(formatDate("2026-01-15").length).toBeGreaterThan(0);
  });

  it("includes the year", () => {
    expect(formatDate("2026-03-08")).toContain("2026");
  });

  it("includes the French month name", () => {
    // "mars" for month 3 in fr-FR
    expect(formatDate("2026-03-08")).toMatch(/mars/i);
  });

  it("formats day and year for January", () => {
    const result = formatDate("2026-01-01");
    expect(result).toContain("2026");
    expect(result).toMatch(/janvier/i);
  });
});

describe("getAllArticles", () => {
  it("returns a non-empty array", () => {
    const articles = getAllArticles();
    expect(Array.isArray(articles)).toBe(true);
    expect(articles.length).toBeGreaterThan(0);
  });

  it("each article has the required fields", () => {
    for (const article of getAllArticles()) {
      expect(typeof article.slug).toBe("string");
      expect(typeof article.title).toBe("string");
      expect(typeof article.date).toBe("string");
      expect(typeof article.excerpt).toBe("string");
      expect(typeof article.content).toBe("string");
    }
  });

  it("is sorted by date descending (newest first)", () => {
    const articles = getAllArticles();
    for (let i = 0; i < articles.length - 1; i++) {
      expect(new Date(articles[i].date).getTime()).toBeGreaterThanOrEqual(
        new Date(articles[i + 1].date).getTime(),
      );
    }
  });

  it("slugs have no .md extension", () => {
    for (const article of getAllArticles()) {
      expect(article.slug).not.toMatch(/\.md$/);
    }
  });
});

describe("getArticleBySlug", () => {
  it("returns the article for a known slug", () => {
    const article = getArticleBySlug("conseil-municipal-mars-2026");
    expect(article).not.toBeNull();
    expect(article?.slug).toBe("conseil-municipal-mars-2026");
    expect(article?.title).toBeTruthy();
  });

  it("returns null for an unknown slug", () => {
    expect(getArticleBySlug("article-qui-n-existe-pas")).toBeNull();
  });

  it("returned article has all required fields", () => {
    const article = getArticleBySlug("conseil-municipal-mars-2026");
    expect(article).toMatchObject({
      slug: "conseil-municipal-mars-2026",
      title: expect.any(String),
      date: expect.any(String),
      excerpt: expect.any(String),
      content: expect.any(String),
    });
  });
});

describe("getAllSlugs", () => {
  it("returns a non-empty array", () => {
    const slugs = getAllSlugs();
    expect(Array.isArray(slugs)).toBe(true);
    expect(slugs.length).toBeGreaterThan(0);
  });

  it("slugs have no .md extension", () => {
    for (const slug of getAllSlugs()) {
      expect(slug).not.toMatch(/\.md$/);
    }
  });

  it("includes known articles", () => {
    const slugs = getAllSlugs();
    expect(slugs).toContain("conseil-municipal-mars-2026");
    expect(slugs).toContain("nouveau-defibrillateur");
  });

  it("count matches getAllArticles", () => {
    expect(getAllSlugs().length).toBe(getAllArticles().length);
  });
});
