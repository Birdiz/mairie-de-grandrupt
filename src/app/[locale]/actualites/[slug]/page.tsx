import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllArticles, getArticleBySlug } from "@/lib/actualites";
import { formatDate } from "@/lib/dates";
import { RichTextContent } from "@/components/ui/RichTextContent";
import { DocumentDownload } from "@/components/ui/DocumentDownload";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { telHref } from "@/lib/phone";
import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};
  return { title: article.title };
}

export default async function ArticlePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const article = await getArticleBySlug(slug);

  if (!article) notFound();

  const t = await getTranslations("actualites");
  const tAddress = await getTranslations("contact.address");
  const isPv = article.type === "proces-verbal";
  // Les 3 articles du même type publiés avant celui-ci (liste déjà triée du plus récent au plus ancien)
  const all = await getAllArticles();
  const index = all.findIndex((a) => a.slug === article.slug);
  const related = all
    .slice(index + 1)
    .filter((a) => a.type === article.type)
    .slice(0, 3);
  const phone = tAddress("phoneNumber");

  return (
    <div className="mx-auto max-w-6xl px-4 pt-5 pb-16 sm:px-6 md:pt-7 md:pb-20 lg:px-8">
      <Breadcrumb items={[{ label: t("title"), href: "/actualites" }, { label: article.title }]} />

      <div className="mt-6 grid gap-14 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-[72px]">
        <article className="flex max-w-[720px] flex-col gap-6">
          <div className="text-muted-foreground text-small flex flex-wrap items-center gap-3">
            <span className="border-secondary-foreground text-secondary-foreground border-[1.5px] px-2.5 py-0.5 font-bold">
              {isPv ? t("typePv") : t("typeStandard")}
            </span>
            <span>
              {t("published")} <time dateTime={article.date}>{formatDate(article.date)}</time>
            </span>
          </div>
          <h1 className="text-h1 text-pretty">{article.title}</h1>
          {article.excerpt && <p className="text-chapo text-pretty">{article.excerpt}</p>}

          {article.document && (
            <DocumentDownload
              document={article.document}
              label={t(isPv ? "downloadPv" : "downloadDocument")}
              meta={t("uploadedOn", { date: formatDate(article.date) })}
              typeLabel={t("documentPdf")}
            />
          )}

          <RichTextContent content={article.content} className="mt-4" />

          <div className="border-border mt-4 border-t pt-6">
            <Link
              href="/actualites"
              className="text-primary inline-flex min-h-11 items-center gap-2 text-[1.1875rem] font-semibold"
            >
              <span aria-hidden="true">←</span>
              {t("backToList")}
            </Link>
          </div>
        </article>

        <aside className="flex flex-col gap-8">
          {related.length > 0 && (
            <section
              aria-labelledby="related-title"
              className="border-brand-marine flex flex-col gap-1 border-t-[3px] pt-4.5"
            >
              <h2 id="related-title" className="text-h4 mb-2">
                {isPv ? t("previousPv") : t("otherNews")}
              </h2>
              <ul>
                {related.map((a) => (
                  <li key={a.slug} className="border-border border-b py-3">
                    <Link
                      href={`/actualites/${a.slug}`}
                      className="text-primary text-[1.1875rem] font-semibold"
                    >
                      {a.title}
                    </Link>
                    <p className="text-muted-foreground text-base">{formatDate(a.date)}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {isPv && (
            <section aria-labelledby="paper-title" className="bg-secondary flex flex-col gap-3 p-6">
              <h2 id="paper-title" className="text-secondary-foreground text-xl font-bold">
                {t("paperTitle")}
              </h2>
              <p className="text-lg leading-[1.55]">{t("paperText")}</p>
              <a
                href={telHref(phone)}
                className="text-secondary-foreground flex min-h-11 items-center self-start text-xl font-bold"
              >
                {phone}
              </a>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}
