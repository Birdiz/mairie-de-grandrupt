import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Logo } from "./Logo";

export function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background">
      {/* Les trois plans du logo : la signature, une seule fois par page */}
      <div aria-hidden="true" className="motif-plans" />
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between md:py-10 lg:px-8">
        <div className="flex items-center gap-3.5">
          <span className="flex size-13 flex-none items-center justify-center rounded-full bg-white">
            <Logo className="h-10 w-auto" />
          </span>
          <span className="flex flex-col">
            <span className="font-heading text-2xl font-bold">{t("mairie")}</span>
            <span className="text-base text-[#c6ccd6]">Vosges · 88210</span>
          </span>
        </div>
        <div className="flex flex-col gap-2 md:items-end">
          <nav aria-label={t("legalNav")}>
            <ul className="flex flex-col text-lg md:flex-row md:gap-7">
              <li>
                <Link
                  href="/mentions-legales"
                  className="text-background flex min-h-12 items-center md:min-h-11"
                >
                  {t("legalNotice")}
                </Link>
              </li>
              <li>
                <Link
                  href="/accessibilite"
                  className="text-background flex min-h-12 items-center md:min-h-11"
                >
                  {t("accessibility")}
                </Link>
              </li>
            </ul>
          </nav>
          <p className="text-small text-[#c6ccd6]">{t("copyright", { year })}</p>
        </div>
      </div>
    </footer>
  );
}
