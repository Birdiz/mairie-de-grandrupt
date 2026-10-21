const INTL_LOCALES: Record<string, string> = {
  fr: "fr-FR",
  de: "de-DE",
  en: "en-GB",
};

/** Format an ISO date string as a long date in the site's language, e.g. "8 mars 2026". */
export function formatDate(dateStr: string, locale = "fr"): string {
  return new Intl.DateTimeFormat(INTL_LOCALES[locale] ?? "fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateStr));
}
