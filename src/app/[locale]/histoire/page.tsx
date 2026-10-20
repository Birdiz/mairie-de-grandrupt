import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/sections/PageHeader";
import { HistoireContentSection } from "@/components/sections/HistoireContentSection";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("histoire");
  return { title: t("title") };
}

export default function HistoirePage() {
  return (
    <>
      <PageHeader ns="histoire" />
      <HistoireContentSection />
    </>
  );
}
