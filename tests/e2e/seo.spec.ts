import { test, expect } from "@playwright/test";

// robots.txt and sitemap.xml must stay out of next-intl's locale routing
// (src/proxy.ts): rewritten to /fr/robots.txt, they used to 404 in production.
test.describe("SEO files", () => {
  test("robots.txt is served and points to the sitemap", async ({ request }) => {
    const res = await request.get("/robots.txt");
    expect(res.status()).toBe(200);
    expect(await res.text()).toMatch(/Sitemap: .+\/sitemap\.xml/);
  });

  test("sitemap.xml is served", async ({ request }) => {
    const res = await request.get("/sitemap.xml");
    expect(res.status()).toBe(200);
    expect(await res.text()).toContain("<urlset");
  });
});
