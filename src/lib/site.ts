/**
 * Public base URL of the site, without a trailing slash.
 *
 * Deliberately *not* prefixed with `NEXT_PUBLIC_`: that prefix would make Next
 * inline the value at build time, freezing the domain into the Docker image and
 * silently ignoring `.env.local`. Read at request time instead, so the same
 * image can serve any domain.
 */
export function siteUrl(): string {
  return (process.env.SITE_URL ?? "https://www.village-de-grandrupt.fr").replace(/\/$/, "");
}
