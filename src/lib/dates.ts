/** Format an ISO date string as a French long date, e.g. "8 mars 2026". */
export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateStr));
}
