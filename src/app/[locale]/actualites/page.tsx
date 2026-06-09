import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ActualitesHero } from "@/components/sections/ActualitesHero";
import { ActualitesList } from "@/components/sections/ActualitesList";
import { getAllArticles } from "@/lib/actualites";

// Rendered at request time: no SQLite DB exists during `next build`, and a single
// local query per request is negligible for this site's traffic.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("actualites");
  return { title: t("title") };
}

export default async function ActualitesPage() {
  const articles = await getAllArticles();
  return (
    <>
      <ActualitesHero />
      <ActualitesList articles={articles} />
    </>
  );
}
