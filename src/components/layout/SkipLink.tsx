import { useTranslations } from "next-intl";

export function SkipLink() {
  const t = useTranslations("nav");

  return (
    <a
      href="#main-content"
      className="focus:bg-primary focus:text-primary-foreground sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:rounded-sm focus:px-5 focus:py-3 focus:font-semibold"
    >
      {t("skipToContent")}
    </a>
  );
}
