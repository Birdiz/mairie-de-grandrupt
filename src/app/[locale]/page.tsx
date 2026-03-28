import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { HeroSection } from "@/components/sections/HeroSection";
import { ActualitesSection } from "@/components/sections/ActualitesSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { VillageSection } from "@/components/sections/VillageSection";
import { ContactBandeau } from "@/components/sections/ContactBandeau";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("home");
  return {
    description: t("meta.description"),
  };
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ActualitesSection />
      <ServicesSection />
      <VillageSection />
      <ContactBandeau />
    </>
  );
}
