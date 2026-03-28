import { useTranslations } from "next-intl";
import { CtaBandeau } from "@/components/sections/CtaBandeau";

export function EntreprisesCta() {
  const t = useTranslations("entreprises.cta");

  return (
    <CtaBandeau
      title={t("title")}
      subtitle={t("subtitle")}
      buttonLabel={t("button")}
      href="/contact"
      sectionId="entreprises-cta-title"
    />
  );
}
