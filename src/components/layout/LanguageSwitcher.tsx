"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

// Chaque langue est nommée dans sa propre langue : pas de traduction.
const LANGUAGES = [
  { code: "fr", short: "FR", name: "Français" },
  { code: "de", short: "DE", name: "Deutsch" },
  { code: "en", short: "EN", name: "English" },
] as const;

type Props = {
  /** « compact » : FR | DE | EN dans l'en-tête ; « full » : noms complets dans le menu mobile. */
  variant?: "compact" | "full";
  className?: string;
};

/** Sélecteur de langue : reste sur la même page, dans l'autre langue. */
export function LanguageSwitcher({ variant = "compact", className }: Props) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const compact = variant === "compact";

  return (
    <nav aria-label={t("language")} className={className}>
      {!compact && <p className="text-muted-foreground text-small mb-2.5">{t("language")}</p>}
      <ul className={cn("flex", compact ? "items-center" : "gap-2")}>
        {LANGUAGES.map(({ code, short, name }) => {
          const isCurrent = code === locale;
          const box = compact
            ? "flex min-h-11 min-w-11 items-center justify-center text-[1.0625rem]"
            : "flex min-h-12 items-center justify-center text-lg";
          const label = compact ? (
            <>
              {short} <span className="sr-only">{name}</span>
            </>
          ) : (
            name
          );
          return (
            <li key={code} className={compact ? undefined : "flex-1"}>
              {isCurrent ? (
                <span
                  aria-current="true"
                  lang={code}
                  className={cn(
                    box,
                    "border-secondary-foreground text-secondary-foreground border-2 font-bold",
                    !compact && "bg-secondary",
                  )}
                >
                  {label}
                </span>
              ) : (
                <Link
                  href={pathname}
                  locale={code}
                  lang={code}
                  hrefLang={code}
                  className={cn(
                    box,
                    "text-foreground no-underline underline-offset-[6px] hover:underline",
                    !compact && "border-border border",
                  )}
                >
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
