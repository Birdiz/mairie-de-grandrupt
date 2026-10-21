import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { HeroSection } from "@/components/sections/HeroSection";
import { ActualitesSection } from "@/components/sections/ActualitesSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { VillageSection } from "@/components/sections/VillageSection";
import { ContactBandeau } from "@/components/sections/ContactBandeau";
import { HorairesBandeau } from "@/components/sections/HorairesBandeau";
import { getAllArticles, type Locale } from "@/lib/actualites";

// Reads published articles from the CMS database at request time.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("home");
  return {
    description: t("meta.description"),
  };
}

export default async function HomePage() {
  const articles = await getAllArticles((await getLocale()) as Locale);
  return (
    <>
      <HeroSection />
      <HorairesBandeau />
      <ActualitesSection articles={articles} />
      {/* Le rupt : un seul séparateur sur la page */}
      <div aria-hidden="true" className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="motif-rupt" />
      </div>
      <ServicesSection />
      <VillageSection />
      <ContactBandeau />
    </>
  );
}
