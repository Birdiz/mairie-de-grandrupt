import { useTranslations } from "next-intl";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAllArticles, formatDate } from "@/lib/actualites";
import { FadeIn } from "@/components/ui/FadeIn";

export function ActualitesSection() {
  const t = useTranslations("home.actualites");
  const articles = getAllArticles().slice(0, 3);
  const delays = [undefined, "delay-150", "delay-300"] as const;

  return (
    <section className="bg-background py-24" aria-labelledby="actualites-title">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <FadeIn className="mb-14 text-center">
          <h2 id="actualites-title" className="font-heading text-foreground text-4xl md:text-5xl">
            {t("title")}
          </h2>
        </FadeIn>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, i) => (
            <FadeIn key={article.slug} delay={delays[i]}>
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
                <p className="text-muted-foreground flex-1 font-sans text-sm leading-relaxed">
                  {article.excerpt}
                </p>
                <Link
                  href={`/actualites/${article.slug}`}
                  className="text-primary focus-visible:ring-ring mt-6 inline-flex items-center gap-1 font-sans text-sm font-semibold hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  {t("readMore")}
                  <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </article>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay="delay-500" className="mt-12 text-center">
          <Link
            href="/actualites"
            className="text-primary focus-visible:ring-ring font-sans text-sm font-semibold hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            {t("seeAll")} →
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
