import { getPayload } from "payload";
import config from "@payload-config";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";

export type ArticleMedia = {
  url: string;
  alt: string;
};

export type ArticleType = "standard" | "proces-verbal";

export type ArticleDocument = {
  url: string;
  filename: string;
  /** Size in bytes, so the download link can announce its weight (RGAA 13.3). */
  filesize: number | null;
  title: string;
};

export type Locale = "fr" | "de" | "en";

export type Article = {
  slug: string;
  /** Language the title, excerpt and content are actually in (French when not translated). */
  contentLocale: Locale;
  title: string;
  date: string;
  type: ArticleType;
  excerpt: string;
  content: SerializedEditorState;
  coverImage: ArticleMedia | null;
  document: ArticleDocument | null;
};

function toDateString(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  return String(value);
}

/**
 * Value of a localized field in one language. Payload returns `{ fr, de, en }`
 * when queried with `locale: "all"`, and a plain value otherwise.
 */
function inLocale(value: unknown, locale: Locale): unknown {
  if (value && typeof value === "object" && !Array.isArray(value) && "fr" in value) {
    return (value as Record<string, unknown>)[locale];
  }
  return locale === "fr" ? value : undefined;
}

function isFilled(value: unknown): boolean {
  if (typeof value === "string") return value.trim().length > 0;
  return value !== null && value !== undefined;
}

/**
 * Builds the article shown in `locale`. An article counts as translated when
 * its title and content exist in that language; otherwise the whole article is
 * shown in French, so languages are never mixed. Procès-verbaux are official
 * documents and always stay in French.
 */
export function toArticle(doc: any, locale: Locale = "fr"): Article {
  const cover = doc?.coverImage && typeof doc.coverImage === "object" ? doc.coverImage : null;
  const file = doc?.document && typeof doc.document === "object" ? doc.document : null;
  const type: ArticleType = doc.type === "proces-verbal" ? "proces-verbal" : "standard";
  const translated =
    locale !== "fr" &&
    type !== "proces-verbal" &&
    isFilled(inLocale(doc.title, locale)) &&
    isFilled(inLocale(doc.content, locale));
  const contentLocale: Locale = translated ? locale : "fr";
  const excerpt = inLocale(doc.excerpt, contentLocale);
  return {
    slug: doc.slug,
    contentLocale,
    title: String(inLocale(doc.title, contentLocale) ?? ""),
    date: toDateString(doc.date),
    type,
    excerpt: String((isFilled(excerpt) ? excerpt : inLocale(doc.excerpt, "fr")) ?? ""),
    content: inLocale(doc.content, contentLocale) as SerializedEditorState,
    coverImage:
      cover && typeof cover.url === "string"
        ? { url: cover.url, alt: typeof cover.alt === "string" ? cover.alt : "" }
        : null,
    document:
      file && typeof file.url === "string"
        ? {
            url: file.url,
            filename: typeof file.filename === "string" ? file.filename : "",
            filesize: typeof file.filesize === "number" ? file.filesize : null,
            title: typeof file.title === "string" ? file.title : "",
          }
        : null,
  };
}

async function getClient() {
  return getPayload({ config });
}

/** All published articles, newest first, in `locale` when translated. */
export async function getAllArticles(locale: Locale = "fr"): Promise<Article[]> {
  const payload = await getClient();
  const { docs } = await payload.find({
    collection: "actualites",
    where: { _status: { equals: "published" } },
    sort: "-date",
    depth: 1,
    limit: 200,
    overrideAccess: true,
    locale: "all",
  });
  return docs.map((doc) => toArticle(doc, locale));
}

/** A single published article by slug, or null, in `locale` when translated. */
export async function getArticleBySlug(
  slug: string,
  locale: Locale = "fr",
): Promise<Article | null> {
  const payload = await getClient();
  const { docs } = await payload.find({
    collection: "actualites",
    where: {
      and: [{ slug: { equals: slug } }, { _status: { equals: "published" } }],
    },
    depth: 1,
    limit: 1,
    overrideAccess: true,
    locale: "all",
  });
  return docs[0] ? toArticle(docs[0], locale) : null;
}
