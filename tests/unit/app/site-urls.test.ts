import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// sitemap() reads published articles from Payload; stub the data layer so the
// test stays a pure URL check and never touches the database.
vi.mock("@/lib/actualites", () => ({
  getAllArticles: async () => [{ slug: "conseil-du-12-mars", date: "2026-03-12" }],
}));

import robots from "@/app/robots";
import sitemap from "@/app/sitemap";

/**
 * Guards the domain wiring: SITE_URL must be honoured at request time.
 *
 * The variable was previously named NEXT_PUBLIC_SITE_URL, which made Next inline
 * it at build time — the Docker image shipped the hardcoded fallback and the
 * value from .env.local was silently ignored in production.
 */
describe("SITE_URL", () => {
  const original = process.env.SITE_URL;

  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    if (original === undefined) delete process.env.SITE_URL;
    else process.env.SITE_URL = original;
  });

  it("robots.txt points the sitemap at the configured domain", () => {
    process.env.SITE_URL = "https://www.exemple.fr";
    expect(robots().sitemap).toBe("https://www.exemple.fr/sitemap.xml");
  });

  it("robots.txt falls back to the canonical www address", () => {
    delete process.env.SITE_URL;
    expect(robots().sitemap).toBe("https://www.grandrupt.fr/sitemap.xml");
  });

  it("every sitemap URL uses the configured domain", async () => {
    process.env.SITE_URL = "https://www.exemple.fr";
    const entries = await sitemap();

    expect(entries.length).toBeGreaterThan(1);
    for (const entry of entries) {
      expect(entry.url.startsWith("https://www.exemple.fr")).toBe(true);
    }
  });

  it("ignores a trailing slash so URLs never end up doubled", () => {
    process.env.SITE_URL = "https://www.exemple.fr/";
    expect(robots().sitemap).toBe("https://www.exemple.fr/sitemap.xml");
  });

  it("includes the article route in the sitemap", async () => {
    process.env.SITE_URL = "https://www.exemple.fr";
    const urls = (await sitemap()).map((entry) => entry.url);
    expect(urls).toContain("https://www.exemple.fr/actualites/conseil-du-12-mars");
  });
});
