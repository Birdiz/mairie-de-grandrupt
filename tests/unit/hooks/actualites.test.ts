import { describe, it, expect } from "vitest";
import { enforcePublishPermission, slugifyFromTitle } from "@/hooks/actualites";

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
