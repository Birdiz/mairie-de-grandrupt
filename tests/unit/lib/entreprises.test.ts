import { describe, it, expect } from "vitest";
import { getAllEntreprises } from "@/lib/entreprises";

describe("getAllEntreprises", () => {
  it("returns a non-empty array", () => {
    const entreprises = getAllEntreprises();
    expect(Array.isArray(entreprises)).toBe(true);
    expect(entreprises.length).toBeGreaterThan(0);
  });

  it("each entreprise has the required fields", () => {
    for (const entreprise of getAllEntreprises()) {
      expect(typeof entreprise.slug).toBe("string");
      expect(typeof entreprise.name).toBe("string");
      expect(typeof entreprise.activity).toBe("string");
      expect(typeof entreprise.icon).toBe("string");
      expect(typeof entreprise.content).toBe("string");
    }
  });

  it("phone field is a string when present", () => {
    for (const entreprise of getAllEntreprises()) {
      if (entreprise.phone !== undefined) {
        expect(typeof entreprise.phone).toBe("string");
      }
    }
  });

  it("slugs have no .md extension", () => {
    for (const entreprise of getAllEntreprises()) {
      expect(entreprise.slug).not.toMatch(/\.md$/);
    }
  });

  it("is sorted alphabetically by name", () => {
    const entreprises = getAllEntreprises();
    for (let i = 0; i < entreprises.length - 1; i++) {
      expect(entreprises[i].name.localeCompare(entreprises[i + 1].name, "fr")).toBeLessThanOrEqual(
        0,
      );
    }
  });

  it("includes known entreprises", () => {
    const slugs = getAllEntreprises().map((e) => e.slug);
    expect(slugs).toContain("exploitation-forestiere-schmitt");
    expect(slugs).toContain("gite-les-sapins");
    expect(slugs).toContain("menuiserie-muller");
  });
});
