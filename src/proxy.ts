import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Exclude Payload's admin (`/admin`) and API (`/api`) routes, Next internals,
  // the root metadata routes (`robots.txt`, `sitemap.xml`) and static assets
  // from next-intl's locale routing — otherwise they get rewritten to
  // `/fr/robots.txt` and 404.
  matcher: [
    "/((?!api|admin|_next|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp)).*)",
  ],
};
