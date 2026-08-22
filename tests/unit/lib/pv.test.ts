import { describe, it, expect } from "vitest";
import {
  buildExcerpt,
  buildLexicalFromParagraphs,
  hideArrayPrototypePollution,
  normalizePdfText,
} from "@/lib/pv";

describe("normalizePdfText", () => {
  it("rejoins lines wrapped by the PDF into a single paragraph", () => {
    const page = [
      "Le conseil municipal s'est réuni le 12 mars 2026",
      "sous la présidence du maire.",
    ];
    expect(normalizePdfText([page.join("\n")])).toEqual([
      "Le conseil municipal s'est réuni le 12 mars 2026 sous la présidence du maire.",
    ]);
  });

  it("splits paragraphs on blank lines", () => {
    const page = "Premier point.\n\nSecond point.";
    expect(normalizePdfText([page])).toEqual(["Premier point.", "Second point."]);
  });

  it("drops bare page numbers and separator rules", () => {
    const page = "Délibération n°1.\n3\nPage 2\n2/7\n--------\nDélibération n°2.";
    expect(normalizePdfText([page])).toEqual(["Délibération n°1.", "Délibération n°2."]);
  });

  it("drops headers repeated across pages", () => {
    const header = "COMMUNE DE GRANDRUPT";
    const pages = [1, 2, 3, 4].map((n) => `${header}\nPoint numéro ${n}.`);
    expect(normalizePdfText(pages)).toEqual([
      "Point numéro 1.",
      "Point numéro 2.",
      "Point numéro 3.",
      "Point numéro 4.",
    ]);
  });

  it("keeps a repeated line when there are too few pages to be sure", () => {
    const pages = ["COMMUNE DE GRANDRUPT\nPoint un.", "COMMUNE DE GRANDRUPT\nPoint deux."];
    expect(normalizePdfText(pages)).toContain("COMMUNE DE GRANDRUPT Point un.");
  });

  it("stitches a sentence split across a page break", () => {
    expect(
      normalizePdfText(["Le conseil approuve le budget", "primitif 2026 à l'unanimité."]),
    ).toEqual(["Le conseil approuve le budget primitif 2026 à l'unanimité."]);
  });

  it("collapses runs of whitespace", () => {
    expect(normalizePdfText(["Le   conseil\t\tmunicipal."])).toEqual(["Le conseil municipal."]);
  });

  it("returns an empty array for a PDF with no text layer", () => {
    expect(normalizePdfText(["", "  \n \n "])).toEqual([]);
  });
});

describe("buildLexicalFromParagraphs", () => {
  it("wraps each paragraph in a paragraph node holding one text node", () => {
    const state = buildLexicalFromParagraphs(["Un.", "Deux."]);
    expect(state.root.type).toBe("root");
    expect(state.root.children).toHaveLength(2);

    const [first] = state.root.children as any[];
    expect(first.type).toBe("paragraph");
    expect(first.children[0]).toMatchObject({ type: "text", text: "Un." });
  });

  it("produces a valid empty document when there is nothing to render", () => {
    expect(buildLexicalFromParagraphs([]).root.children).toEqual([]);
  });
});

describe("buildExcerpt", () => {
  it("returns the whole text when it already fits", () => {
    expect(buildExcerpt(["Court résumé."])).toBe("Court résumé.");
  });

  it("never exceeds the excerpt field's maximum length", () => {
    const long = ["Le conseil municipal délibère sur de nombreux sujets. ".repeat(30)];
    expect(buildExcerpt(long).length).toBeLessThanOrEqual(300);
  });

  it("cuts on a sentence boundary when one is available", () => {
    const text = `${"a".repeat(150)}. ${"b".repeat(300)}`;
    expect(buildExcerpt([text])).toBe(`${"a".repeat(150)}.`);
  });

  it("cuts on a word boundary and ellipsizes when no sentence ends in range", () => {
    const result = buildExcerpt([`${"mot ".repeat(200)}`]);
    expect(result.endsWith("…")).toBe(true);
    expect(result).not.toMatch(/mo…$/);
  });
});

describe("hideArrayPrototypePollution", () => {
  it("makes prototype extensions non-enumerable without breaking them", () => {
    // What drizzle-kit does, and what makes pdf.js refuse to parse.
    (Array.prototype as unknown as { random: () => unknown }).random = function () {
      return "still callable";
    };
    try {
      expect(Object.keys(Array.prototype)).toContain("random");

      hideArrayPrototypePollution();

      expect(Object.keys(Array.prototype)).not.toContain("random");
      expect((["a"] as unknown as { random: () => unknown }).random()).toBe("still callable");
    } finally {
      delete (Array.prototype as unknown as { random?: unknown }).random;
    }
  });
});
