import { useTranslations } from "next-intl";
import Link from "next/link";
import type { Article } from "@/lib/actualites";
import { ArticleCard } from "./ArticleCard";

export function ActualitesSection({ articles }: { articles: Article[] }) {
  const t = useTranslations("home.actualites");
  const [featured, ...others] = articles;

  return (
    <section aria-labelledby="actualites-title">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-9 sm:px-6 md:py-16 lg:px-8">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <h2 id="actualites-title" className="text-h2">
            {t("title")}
          </h2>
          <Link
            href="/actualites"
            className="text-primary hidden min-h-11 items-center text-[1.1875rem] font-semibold md:flex"
          >
            {t("seeAll")}
          </Link>
        </div>

        {featured ? (
          <div className="grid gap-x-14 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
            <ArticleCard article={featured} variant="featured" />
            <div className="flex flex-col">
              {others.slice(0, 3).map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground">{t("empty")}</p>
        )}

        <Link
          href="/actualites"
          className="border-secondary-foreground bg-card text-secondary-foreground hover:bg-secondary flex min-h-13 items-center justify-center rounded-sm border-2 text-[1.1875rem] font-semibold no-underline hover:underline md:hidden"
        >
          {t("seeAll")}
        </Link>
      </div>
    </section>
  );
}
