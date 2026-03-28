import { useTranslations } from "next-intl";
import { CtaBandeau } from "@/components/sections/CtaBandeau";

export function ContactBandeau() {
  const t = useTranslations("home.contactBandeau");

  return (
    <CtaBandeau
      title={t("title")}
      subtitle={t("subtitle")}
      buttonLabel={t("cta")}
      href="/contact"
      sectionId="contact-bandeau-title"
    />
  );
}
