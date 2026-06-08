import { getPayload } from "payload";
import config from "@payload-config";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";

export type ArticleMedia = {
  url: string;
  alt: string;
};

export type Article = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: SerializedEditorState;
  coverImage: ArticleMedia | null;
};

function toDateString(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  return String(value);
}

function toArticle(doc: any): Article {
  const cover = doc?.coverImage && typeof doc.coverImage === "object" ? doc.coverImage : null;
  return {
    slug: doc.slug,
    title: doc.title,
    date: toDateString(doc.date),
    excerpt: doc.excerpt,
    content: doc.content as SerializedEditorState,
    coverImage:
      cover && typeof cover.url === "string"
        ? { url: cover.url, alt: typeof cover.alt === "string" ? cover.alt : "" }
        : null,
  };
}

async function getClient() {
  return getPayload({ config });
}

/** All published articles, newest first. */
export async function getAllArticles(): Promise<Article[]> {
  const payload = await getClient();
  const { docs } = await payload.find({
    collection: "actualites",
    where: { _status: { equals: "published" } },
    sort: "-date",
    depth: 1,
    limit: 200,
    overrideAccess: true,
  });
  return docs.map(toArticle);
}

/** A single published article by slug, or null. */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const payload = await getClient();
  const { docs } = await payload.find({
    collection: "actualites",
    where: {
      and: [{ slug: { equals: slug } }, { _status: { equals: "published" } }],
    },
    depth: 1,
    limit: 1,
    overrideAccess: true,
  });
  return docs[0] ? toArticle(docs[0]) : null;
}
