import { useTranslations } from "next-intl";

export function SkipLink() {
  const t = useTranslations("nav");

  return (
    <a
      href="#main-content"
      className="focus:bg-primary focus:text-primary-foreground focus:ring-ring sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:px-4 focus:py-2 focus:ring-2 focus:outline-none"
    >
      {t("skipToContent")}
    </a>
  );
}
