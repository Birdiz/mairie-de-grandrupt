import path from "path";
import { describe, it, expect, vi } from "vitest";
import {
  enforcePublishPermission,
  fillFromProcesVerbal,
  slugify,
  slugifyFromTitle,
} from "@/hooks/actualites";

const t = ((k: string) => k) as any;
const changeArgs = (status: string, user: unknown) =>
  ({ data: { _status: status }, req: { user, t }, operation: "create" }) as any;
const fieldArgs = (value: unknown, title?: string) =>
  ({ value, data: title ? { title } : {} }) as any;

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
  it("derives an accent-free, hyphenated slug from the title", () => {
    expect(slugifyFromTitle(fieldArgs("", "Fête du Village 2026 !"))).toBe("fete-du-village-2026");
  });

  it("keeps an explicit slug when provided", () => {
    expect(slugifyFromTitle(fieldArgs("mon-slug", "Un Titre"))).toBe("mon-slug");
  });

  it("strips accents", () => {
    expect(slugifyFromTitle(fieldArgs("", "Réunion à l'école"))).toBe("reunion-a-l-ecole");
  });
});

const FIXTURES = path.resolve(__dirname, "../../fixtures");

/** Minimal stand-in for the bits of `req` the hook actually touches. */
function makeReq(doc: unknown = { filename: "proces-verbal.pdf" }) {
  return {
    payload: {
      collections: { documents: { config: { upload: { staticDir: FIXTURES } } } },
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
