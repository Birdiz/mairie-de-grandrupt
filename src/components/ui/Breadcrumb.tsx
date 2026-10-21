import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type Crumb = { label: string; href?: string; lang?: string };

/** Fil d'Ariane : commence toujours par l'accueil, la page courante n'est pas un lien. */
export function Breadcrumb({ items }: { items: Crumb[] }) {
  const t = useTranslations("nav");
  const crumbs: Crumb[] = [{ label: t("home"), href: "/" }, ...items];

  return (
    <nav aria-label={t("breadcrumb")}>
      <ol className="text-muted-foreground text-small flex flex-wrap items-center gap-x-2.5">
        {crumbs.map((crumb, i) => (
          <li key={`${crumb.label}-${i}`} className="flex items-center gap-2.5">
            {i > 0 && <span aria-hidden="true">›</span>}
            {crumb.href ? (
              <Link href={crumb.href} className="text-primary flex min-h-11 items-center">
                {crumb.label}
              </Link>
            ) : (
              <span aria-current="page" lang={crumb.lang}>
                {crumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
