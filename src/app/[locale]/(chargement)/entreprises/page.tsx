import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/sections/PageHeader";
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
      <PageHeader ns="entreprises" />
      <EntreprisesContentSection />
      <EntreprisesCta />
    </>
  );
}
