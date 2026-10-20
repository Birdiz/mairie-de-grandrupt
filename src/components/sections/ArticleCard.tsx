import { useTranslations } from "next-intl";
import Link from "next/link";
import type { Article } from "@/lib/actualites";
import { formatDate } from "@/lib/dates";
import { cn } from "@/lib/utils";

type Props = {
  article: Article;
  /** Niveau du titre, pour garder une hiérarchie correcte selon la page. */
  headingLevel?: "h2" | "h3";
  /** « featured » : article mis en avant (titre en Playfair, plus grand). */
  variant?: "default" | "featured" | "compact";
};

/**
 * Carte d'actualité de la charte v2 : un filet marine en tête, comme une page de bulletin
 * municipal. Pas d'ombre ni de coins arrondis. Toute la carte est cliquable : le lien est
 * sur le titre, étendu à la carte.
 */
export function ArticleCard({ article, headingLevel = "h3", variant = "default" }: Props) {
  const t = useTranslations("actualites");
  const Heading = headingLevel;
  const type = article.type === "proces-verbal" ? t("typePv") : t("typeStandard");

  return (
    <article
      className={cn(
        "group border-brand-marine hover:bg-accent hover:text-accent-foreground has-[a:focus-visible]:outline-ring relative -mx-4 flex flex-col gap-2.5 border-t-[3px] px-4 pt-5 pb-6 has-[a:focus-visible]:outline-3 has-[a:focus-visible]:outline-offset-3",
        variant === "featured" && "gap-3.5",
      )}
    >
      <p className="text-muted-foreground group-hover:text-accent-foreground text-small order-first">
        <time dateTime={article.date}>{formatDate(article.date)}</time> · {type}
      </p>
      <Heading
        className={cn(
          "text-primary group-hover:text-accent-foreground",
          variant === "featured" ? "text-h3" : "text-[1.3125rem] leading-[1.3] font-bold",
        )}
      >
        <Link
          href={`/actualites/${article.slug}`}
          className="after:absolute after:inset-0 focus-visible:outline-none"
        >
          {article.title}
        </Link>
      </Heading>
      {variant !== "compact" && article.excerpt && (
        <p className={variant === "featured" ? "text-body" : "text-lg leading-[1.55]"}>
          {article.excerpt}
        </p>
      )}
      {article.document && (
        <p className="border-secondary-foreground text-secondary-foreground self-start border-[1.5px] px-2 py-0.5 text-base font-semibold">
          {t("pdfTag")}
        </p>
      )}
    </article>
  );
}
