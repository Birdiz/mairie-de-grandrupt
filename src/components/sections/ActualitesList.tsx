import { useTranslations } from "next-intl";
import type { Article } from "@/lib/actualites";
import { ArticleCard } from "./ArticleCard";

export function ActualitesList({ articles }: { articles: Article[] }) {
  const t = useTranslations("actualites");

  return (
    <section aria-labelledby="actualites-list-title">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 pb-16 sm:px-6 lg:px-8">
        <h2 id="actualites-list-title" className="text-h3">
          {t("count", { count: articles.length })}
        </h2>
        <div className="grid gap-x-14 md:grid-cols-2">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}
