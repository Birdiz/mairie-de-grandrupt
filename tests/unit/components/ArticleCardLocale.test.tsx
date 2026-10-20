import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ArticleCard } from "@/components/sections/ArticleCard";
import type { Article } from "@/lib/actualites";

// Page en allemand, article resté en français
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => "de",
}));

vi.mock("@/i18n/navigation", () => ({
  Link: ({ children, href, ...props }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const article: Article = {
  slug: "fete",
  contentLocale: "fr",
  title: "Fête du village",
  date: "2026-07-04T00:00:00.000Z",
  type: "standard",
  excerpt: "Programme à venir.",
  content: {} as Article["content"],
  coverImage: null,
  document: null,
};

describe("ArticleCard on a page in another language", () => {
  it("says the article is in French and marks its title and excerpt", () => {
    render(<ArticleCard article={article} />);
    expect(screen.getByText(/inFrench/)).toBeDefined();
    expect(screen.getByRole("link", { name: "Fête du village" })).toHaveAttribute("lang", "fr");
    expect(screen.getByText("Programme à venir.")).toHaveAttribute("lang", "fr");
  });

  it("adds nothing once the article is translated", () => {
    render(<ArticleCard article={{ ...article, contentLocale: "de", title: "Dorffest" }} />);
    expect(screen.queryByText(/inFrench/)).toBeNull();
    expect(screen.getByRole("link", { name: "Dorffest" })).not.toHaveAttribute("lang");
  });
});
