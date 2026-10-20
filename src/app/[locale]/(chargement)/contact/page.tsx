import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ContactHero } from "@/components/sections/ContactHero";
import { ContactContentSection } from "@/components/sections/ContactContentSection";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("contact");
  return { title: t("title") };
}

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactContentSection />
    </>
  );
}
