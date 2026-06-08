import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Exclude Payload's admin (`/admin`) and API (`/api`) routes, Next internals
  // and static assets from next-intl's locale routing.
  matcher: ["/((?!api|admin|_next|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp)).*)"],
};
