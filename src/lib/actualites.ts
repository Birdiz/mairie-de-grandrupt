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

export type Article = {
  slug: string;
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

function toArticle(doc: any): Article {
  const cover = doc?.coverImage && typeof doc.coverImage === "object" ? doc.coverImage : null;
  const file = doc?.document && typeof doc.document === "object" ? doc.document : null;
  return {
    slug: doc.slug,
    title: doc.title,
    date: toDateString(doc.date),
    type: doc.type === "proces-verbal" ? "proces-verbal" : "standard",
    excerpt: doc.excerpt,
    content: doc.content as SerializedEditorState,
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
