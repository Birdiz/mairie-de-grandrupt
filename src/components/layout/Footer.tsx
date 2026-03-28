import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-border bg-muted/40 border-t py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-muted-foreground flex flex-col items-center gap-3 text-center text-sm sm:flex-row sm:justify-between sm:text-left">
          <p>{t("copyright", { year })}</p>
          <nav aria-label="Liens légaux">
            <ul className="flex gap-4">
              <li>
                <Link
                  href="/mentions-legales"
                  className="hover:text-foreground focus-visible:ring-ring rounded-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
                >
                  {t("legalNotice")}
                </Link>
              </li>
              <li>
                <Link
                  href="/accessibilite"
                  className="hover:text-foreground focus-visible:ring-ring rounded-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
                >
                  {t("accessibility")}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
