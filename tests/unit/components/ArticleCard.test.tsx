import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ArticleCard } from "@/components/sections/ArticleCard";
import type { Article } from "@/lib/actualites";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => "fr",
}));

vi.mock("@/i18n/navigation", () => ({
  Link: ({ children, href, ...props }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const article: Article = {
  slug: "pv-mars",
  contentLocale: "fr",
  title: "Procès-verbal du conseil du 12 mars",
  date: "2026-03-15T00:00:00.000Z",
  type: "proces-verbal",
  excerpt: "Budget, voirie, affouage.",
  content: {} as Article["content"],
  coverImage: null,
  document: { url: "/pv.pdf", filename: "pv.pdf", filesize: 1000, title: "PV" },
};

describe("ArticleCard", () => {
  it("links the title to the article", () => {
    render(<ArticleCard article={article} />);
    expect(screen.getByRole("link", { name: article.title })).toHaveAttribute(
      "href",
      "/actualites/pv-mars",
    );
  });

  it("writes the content type and the date in words", () => {
    render(<ArticleCard article={article} />);
    expect(screen.getByText(/typePv/)).toBeDefined();
    expect(screen.getByText("15 mars 2026")).toHaveAttribute("datetime", article.date);
  });

  it("announces a PDF to download only when there is one", () => {
    const { rerender } = render(<ArticleCard article={article} />);
    expect(screen.getByText("pdfTag")).toBeDefined();
    rerender(<ArticleCard article={{ ...article, document: null }} />);
    expect(screen.queryByText("pdfTag")).toBeNull();
  });
});
