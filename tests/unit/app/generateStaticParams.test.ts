import { describe, it, expect } from "vitest";
import { routing } from "@/i18n/routing";
import { getAllSlugs, getArticleBySlug } from "@/lib/actualites";

/**
 * These tests verify the generateStaticParams logic used by the
 * [locale] layout and [slug] article page. We test the underlying
 * data directly rather than importing the page modules, which pull
 * in heavy Next.js + next-intl runtime dependencies.
 *
 * The layout's generateStaticParams:
 *   routing.locales.map((locale) => ({ locale }))
 *
 * The article page's generateStaticParams:
 *   getAllSlugs().map((slug) => ({ slug }))
 */

describe("generateStaticParams — [locale] layout", () => {
  const params = routing.locales.map((locale) => ({ locale }));

  it("returns one entry per configured locale", () => {
    expect(params).toHaveLength(routing.locales.length);
    for (const locale of routing.locales) {
      expect(params).toContainEqual({ locale });
    }
  });

  it("includes fr, de, and en", () => {
    const locales = params.map((p) => p.locale);
    expect(locales).toContain("fr");
    expect(locales).toContain("de");
    expect(locales).toContain("en");
  });
});

describe("generateStaticParams — [slug] article page", () => {
  const params = getAllSlugs().map((slug) => ({ slug }));

  it("returns one entry per article slug", () => {
    const expectedSlugs = getAllSlugs();
    expect(params).toHaveLength(expectedSlugs.length);
    for (const slug of expectedSlugs) {
      expect(params).toContainEqual({ slug });
    }
  });

  it("slugs have no .md extension", () => {
    for (const { slug } of params) {
      expect(slug).not.toMatch(/\.md$/);
    }
  });

  it("every slug maps to a valid article file", () => {
    for (const { slug } of params) {
      expect(getArticleBySlug(slug)).not.toBeNull();
    }
  });
});
