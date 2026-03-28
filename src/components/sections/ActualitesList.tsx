import { useTranslations } from "next-intl";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAllArticles, formatDate } from "@/lib/actualites";
import { FadeIn } from "@/components/ui/FadeIn";

export function ActualitesList() {
  const t = useTranslations("actualites");
  const articles = getAllArticles();

  return (
    <section className="bg-background py-24" aria-labelledby="actualites-list-title">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <FadeIn className="mb-14">
          <h2
            id="actualites-list-title"
            className="font-heading text-foreground text-4xl md:text-5xl"
          >
            {articles.length} {articles.length > 1 ? "articles" : "article"}
          </h2>
        </FadeIn>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, i) => (
            <FadeIn
              key={article.slug}
              delay={i === 0 ? undefined : i === 1 ? "delay-150" : "delay-300"}
            >
              <article className="border-border bg-card flex h-full flex-col rounded-xl border p-8 transition-shadow hover:shadow-md">
                <time
                  dateTime={article.date}
                  className="text-muted-foreground mb-3 font-sans text-sm"
                >
                  {formatDate(article.date)}
                </time>
                <h3 className="font-heading text-foreground mb-3 text-xl leading-snug">
                  {article.title}
                </h3>
                <p className="text-muted-foreground mb-6 line-clamp-3 flex-1 font-sans text-sm leading-relaxed">
                  {article.excerpt}
                </p>
                <Link
                  href={`/actualites/${article.slug}`}
                  className="text-primary focus-visible:ring-ring inline-flex items-center gap-1 font-sans text-sm font-semibold hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  {t("readMore")}
                  <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
