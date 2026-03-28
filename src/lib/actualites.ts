import fs from "fs";
import path from "path";
import matter from "gray-matter";

function toDateString(value: unknown): string {
  if (value instanceof Date) return value.toISOString().split("T")[0];
  return String(value);
}

export type Article = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
};

const CONTENT_DIR = path.join(process.cwd(), "src/content/actualites");

export function getAllArticles(): Article[] {
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md"));

  return files
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf-8");
      const { data, content } = matter(raw);
      return {
        slug,
        title: data.title as string,
        date: toDateString(data.date),
        excerpt: data.excerpt as string,
        content,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getArticleBySlug(slug: string): Article | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title as string,
    date: toDateString(data.date),
    excerpt: data.excerpt as string,
    content,
  };
}

export function getAllSlugs(): string[] {
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateStr));
}
