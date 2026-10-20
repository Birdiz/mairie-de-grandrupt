import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["fr", "de", "en"],
  defaultLocale: "fr",
  localePrefix: "as-needed",
  // Le public de la mairie est francophone : on ne redirige pas selon la
  // langue du navigateur (ni selon le cookie NEXT_LOCALE). /en et /de restent
  // accessibles par leur URL.
  localeDetection: false,
});
