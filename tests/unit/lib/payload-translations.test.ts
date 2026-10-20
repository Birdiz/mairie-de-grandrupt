import { describe, it, expect } from "vitest";
import { frTranslations } from "@payloadcms/translations/languages/fr";

import { frOverrides } from "@/payload-translations";

const placeholders = (s: string) => [...s.matchAll(/\{\{(\w+)\}\}/g)].map((m) => m[1]).sort();

const entries = Object.entries(frOverrides).flatMap(([section, keys]) =>
  Object.entries(keys).map(([key, value]) => ({ section, key, value })),
);

/**
 * Payload deep-merges these overrides silently: a misspelt key, or one renamed
 * in a Payload upgrade, would just leave the clumsy stock string in place.
 */
describe("frOverrides", () => {
  it.each(entries)("$section:$key overrides an existing Payload key", ({ section, key }) => {
    const stock = frTranslations[section as keyof typeof frTranslations] as Record<string, string>;
    expect(stock?.[key]).toBeTypeOf("string");
  });

  it.each(entries)(
    "$section:$key only uses placeholders Payload provides",
    ({ section, key, value }) => {
      const stock = frTranslations[section as keyof typeof frTranslations] as Record<
        string,
        string
      >;
      for (const name of placeholders(value)) {
        expect(placeholders(stock[key])).toContain(name);
      }
    },
  );

  it("leaves no gender hedging such as un(e) or « de ou du »", () => {
    for (const { value } of entries) {
      expect(value).not.toMatch(/\(e\)|\(s\)| ou nouvelle|de ou du|ce ou cette/);
    }
  });
});
