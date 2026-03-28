import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ActualitesHero } from "@/components/sections/ActualitesHero";
import { ActualitesList } from "@/components/sections/ActualitesList";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("actualites");
  return { title: t("title") };
}

export default function ActualitesPage() {
  return (
    <>
      <ActualitesHero />
      <ActualitesList />
    </>
  );
}
