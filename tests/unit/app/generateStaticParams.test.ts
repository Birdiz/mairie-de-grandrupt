import { describe, it, expect } from "vitest";
import { routing } from "@/i18n/routing";

/**
 * Verifies the generateStaticParams logic used by the [locale] layout.
 * We test the underlying data directly rather than importing the page modules,
 * which pull in heavy Next.js + next-intl runtime dependencies.
 *
 * The layout's generateStaticParams:
 *   routing.locales.map((locale) => ({ locale }))
 *
 * Note: the [slug] article page no longer uses generateStaticParams — articles
 * are stored in Payload and rendered dynamically, so there is nothing to
 * pre-compute at build time for them.
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
