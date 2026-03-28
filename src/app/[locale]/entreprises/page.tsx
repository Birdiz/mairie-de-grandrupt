import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { EntreprisesHero } from "@/components/sections/EntreprisesHero";
import { EntreprisesContentSection } from "@/components/sections/EntreprisesContentSection";
import { EntreprisesCta } from "@/components/sections/EntreprisesCta";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("entreprises");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function EntreprisesPage() {
  return (
    <>
      <EntreprisesHero />
      <EntreprisesContentSection />
      <EntreprisesCta />
    </>
  );
}
