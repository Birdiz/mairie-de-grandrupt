import path from "path";
import { describe, it, expect, vi } from "vitest";
import {
  enforcePublishPermission,
  fillFromProcesVerbal,
  slugify,
  slugifyFromTitle,
  validateSlug,
} from "@/hooks/actualites";

const t = ((k: string) => k) as any;
const changeArgs = (status: string, user: unknown) =>
  ({ data: { _status: status }, req: { user, t }, operation: "create" }) as any;
/** `taken` lists the slugs other articles already use. */
const fieldArgs = (
  value: unknown,
  title?: string,
  { taken = [], originalDoc }: { taken?: string[]; originalDoc?: unknown } = {},
) => {
  const count = vi.fn(async ({ where }: any) => ({
    totalDocs: taken.includes(where.and[0].slug.equals) ? 1 : 0,
  }));
  return { value, data: title ? { title } : {}, originalDoc, req: { payload: { count } } } as any;
};

describe("enforcePublishPermission (publish gate)", () => {
  it("blocks a writer from publishing", () => {
    expect(() => enforcePublishPermission(changeArgs("published", { role: "writer" }))).toThrow();
  });

  it("allows a publisher to publish", () => {
    expect(() =>
      enforcePublishPermission(changeArgs("published", { role: "publisher" })),
    ).not.toThrow();
  });

  it("allows an admin to publish", () => {
    expect(() =>
      enforcePublishPermission(changeArgs("published", { role: "admin" })),
    ).not.toThrow();
  });

  it("allows a writer to save a draft", () => {
    expect(() => enforcePublishPermission(changeArgs("draft", { role: "writer" }))).not.toThrow();
  });

  it("allows trusted server-side (no user) to publish — e.g. seeds/migrations", () => {
    expect(() => enforcePublishPermission(changeArgs("published", null))).not.toThrow();
  });
});

describe("slugifyFromTitle", () => {
  it("derives an accent-free, hyphenated slug from the title", async () => {
    expect(await slugifyFromTitle(fieldArgs("", "Fête du Village 2026 !"))).toBe(
      "fete-du-village-2026",
    );
  });

  it("keeps an explicit slug when provided", async () => {
    expect(await slugifyFromTitle(fieldArgs("mon-slug", "Un Titre"))).toBe("mon-slug");
  });

  it("strips accents", async () => {
    expect(await slugifyFromTitle(fieldArgs("", "Réunion à l'école"))).toBe("reunion-a-l-ecole");
  });

  it("makes a typed slug URL-safe", async () => {
    expect(await slugifyFromTitle(fieldArgs("Fête du village", "Un Titre"))).toBe(
      "fete-du-village",
    );
  });

  it("falls back to the title when the typed slug has nothing usable", async () => {
    expect(await slugifyFromTitle(fieldArgs("!!!", "Un Titre"))).toBe("un-titre");
  });

  it("adds a suffix when another article has the same title", async () => {
    const args = fieldArgs("", "Avis", { taken: ["avis", "avis-2"] });
    expect(await slugifyFromTitle(args)).toBe("avis-3");
  });

  it("does not count the article being saved as a duplicate", async () => {
    const args = fieldArgs("", "Avis", { originalDoc: { id: 7 } });
    await slugifyFromTitle(args);
    expect(args.req.payload.count.mock.calls[0][0].where.and[1]).toEqual({
      id: { not_equals: 7 },
    });
  });

  it("keeps the slug when a partial update only changes the title", async () => {
    const args = fieldArgs(undefined, "Nouveau titre", { originalDoc: { slug: "ancien-titre" } });
    expect(await slugifyFromTitle(args)).toBe("ancien-titre");
  });

  it("derives the slug anew when the field is cleared", async () => {
    const args = fieldArgs("", "Nouveau titre", { originalDoc: { slug: "ancien-titre" } });
    expect(await slugifyFromTitle(args)).toBe("nouveau-titre");
  });
});

describe("validateSlug", () => {
  it("accepts a blank slug when the title can provide one", () => {
    expect(validateSlug("", { data: { title: "Un Titre" } })).toBe(true);
  });

  it("accepts a typed slug when the title cannot provide one", () => {
    expect(validateSlug("avis", { data: { title: "!!!" } })).toBe(true);
  });

  it("refuses when neither the slug nor the title can provide one", () => {
    expect(validateSlug("", { data: { title: "!!!" } })).toEqual(expect.any(String));
  });

  it("leaves a blank title to the title field's own error", () => {
    expect(validateSlug("", { data: {} })).toBe(true);
  });
});

const FIXTURES = path.resolve(__dirname, "../../fixtures");

/** Minimal stand-in for the bits of `req` the hook actually touches. */
function makeReq(doc: unknown = { filename: "proces-verbal.pdf" }) {
  return {
    payload: {
      collections: { documents: { config: { upload: { staticDir: FIXTURES } } } },
      count: vi.fn().mockResolvedValue({ totalDocs: 0 }),
      findByID: vi.fn().mockResolvedValue(doc),
      logger: { warn: vi.fn() },
    },
  };
}

const run = (data: Record<string, unknown>, req = makeReq()) =>
  (fillFromProcesVerbal as (args: unknown) => Promise<Record<string, unknown>>)({
    data,
    operation: "create",
    req,
    collection: {},
    context: {},
  });

describe("slugify", () => {
  it("strips accents, lowercases and hyphenates", () => {
    expect(slugify("Procès-verbal du 12 mars 2026")).toBe("proces-verbal-du-12-mars-2026");
  });
});

describe("fillFromProcesVerbal", () => {
  it("fills title, slug, excerpt and content from the PDF", async () => {
    const data = await run({
      type: "proces-verbal",
      document: 1,
      date: "2026-03-12T00:00:00.000Z",
    });

    expect(data.title).toBe("Procès-verbal du conseil municipal du 12 mars 2026");
    expect(data.slug).toBe("proces-verbal-du-conseil-municipal-du-12-mars-2026");
    expect(String(data.excerpt)).toContain("conseil municipal");
    expect(String(data.excerpt).length).toBeLessThanOrEqual(300);

    const children = (data.content as { root: { children: unknown[] } }).root.children;
    expect(children.length).toBeGreaterThan(0);
    expect(JSON.stringify(children)).toContain("budget primitif 2026");
    // The header repeated on both pages is page furniture, not content.
    expect(JSON.stringify(children)).not.toContain("COMMUNE DE GRANDRUPT");
  });

  it("never overwrites what the editor typed", async () => {
    const data = await run({
      type: "proces-verbal",
      document: 1,
      date: "2026-03-12T00:00:00.000Z",
      title: "Conseil du 12 mars : le budget voté",
      slug: "budget-vote",
      excerpt: "Résumé écrit à la main.",
    });

    expect(data.title).toBe("Conseil du 12 mars : le budget voté");
    expect(data.slug).toBe("budget-vote");
    expect(data.excerpt).toBe("Résumé écrit à la main.");
    expect(data.content).toBeDefined(); // still filled: it was blank
  });

  it("accepts an already-populated document relation", async () => {
    const data = await run({
      type: "proces-verbal",
      document: { id: 1 },
      date: "2026-03-12T00:00:00.000Z",
    });
    expect(data.excerpt).toBeDefined();
  });

  it("never fills a German or English version with the French PDF text", async () => {
    const req = { ...makeReq(), locale: "de" };
    const data = await run({ type: "proces-verbal", document: 1, date: "2026-03-12" }, req);

    expect(data.title).toBeUndefined();
    expect(data.content).toBeUndefined();
    expect(req.payload.findByID).not.toHaveBeenCalled();
  });

  it("leaves ordinary actualités untouched", async () => {
    const req = makeReq();
    const data = await run({ type: "standard", document: 1, date: "2026-03-12" }, req);

    expect(data.title).toBeUndefined();
    expect(data.content).toBeUndefined();
    expect(req.payload.findByID).not.toHaveBeenCalled();
  });

  it("does nothing when no PDF is attached", async () => {
    const data = await run({ type: "proces-verbal", date: "2026-03-12" });
    expect(data.title).toBeUndefined();
  });

  it("degrades gracefully when the PDF cannot be read", async () => {
    const req = makeReq({ filename: "absent.pdf" });
    const data = await run(
      { type: "proces-verbal", document: 1, date: "2026-03-12T00:00:00.000Z" },
      req,
    );

    // Title still derived from the meeting date; body left for manual entry.
    expect(data.title).toBe("Procès-verbal du conseil municipal du 12 mars 2026");
    expect(data.excerpt).toBeUndefined();
    expect(data.content).toBeUndefined();
    expect(req.payload.logger.warn).toHaveBeenCalled();
  });
});
