import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getArticleBySlug, getAllSlugs, formatDate } from "@/lib/actualites";
import { ProseContent } from "@/components/ui/ProseContent";
import { FadeIn } from "@/components/ui/FadeIn";
import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return { title: article.title };
}

export default async function ArticlePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const article = getArticleBySlug(slug);

  if (!article) notFound();

  const t = await getTranslations("actualites");

  return (
    <>
      {/* Mini hero */}
      <section className="bg-primary" aria-label={article.title}>
        <div className="mx-auto max-w-4xl px-6 py-16 sm:px-10">
          <FadeIn>
            <Link
              href="/actualites"
              className="inline-flex items-center gap-2 font-sans text-sm font-semibold text-white/70 transition-colors hover:text-white focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
            >
              <ArrowLeft size={14} aria-hidden="true" />
              {t("backToList")}
            </Link>
          </FadeIn>
          <FadeIn delay="delay-150">
            <h1 className="font-heading mt-6 text-4xl leading-tight text-white md:text-5xl">
              {article.title}
            </h1>
          </FadeIn>
          <FadeIn delay="delay-300">
            <time dateTime={article.date} className="mt-4 block font-sans text-sm text-white/70">
              {formatDate(article.date)}
            </time>
          </FadeIn>
        </div>
      </section>

      {/* Corps */}
      <section className="bg-background py-16">
        <div className="mx-auto max-w-4xl px-6 sm:px-10">
          <FadeIn>
            <ProseContent content={article.content} />
          </FadeIn>

          <div className="border-border mt-12 border-t pt-8">
            <Link
              href="/actualites"
              className="text-primary focus-visible:ring-ring inline-flex items-center gap-2 font-sans text-sm font-semibold hover:underline focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <ArrowLeft size={14} aria-hidden="true" />
              {t("backToList")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
