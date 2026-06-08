import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { HeroSection } from "@/components/sections/HeroSection";
import { ActualitesSection } from "@/components/sections/ActualitesSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { VillageSection } from "@/components/sections/VillageSection";
import { ContactBandeau } from "@/components/sections/ContactBandeau";
import { getAllArticles } from "@/lib/actualites";

// Reads published articles from the CMS database at request time.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("home");
  return {
    description: t("meta.description"),
  };
}

export default async function HomePage() {
  const articles = await getAllArticles();
  return (
    <>
      <HeroSection />
      <ActualitesSection articles={articles} />
      <ServicesSection />
      <VillageSection />
      <ContactBandeau />
    </>
  );
}
