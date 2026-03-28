import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type Entreprise = {
  slug: string;
  name: string;
  activity: string;
  icon: string;
  phone?: string;
  content: string;
};

const CONTENT_DIR = path.join(process.cwd(), "src/content/entreprises");

export function getAllEntreprises(): Entreprise[] {
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md"));

  return files
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf-8");
      const { data, content } = matter(raw);
      return {
        slug,
        name: data.name as string,
        activity: data.activity as string,
        icon: data.icon as string,
        phone: data.phone as string | undefined,
        content: content.trim(),
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name, "fr"));
}
