import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ActualitesHero } from "@/components/sections/ActualitesHero";
import { ActualitesList } from "@/components/sections/ActualitesList";
import { getAllArticles } from "@/lib/actualites";

// Reads published articles from the CMS database at request time.
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
