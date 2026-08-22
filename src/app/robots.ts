import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// Reads SITE_URL at request time; without this the file is generated at build
// time and the domain would be frozen into the image.
export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
