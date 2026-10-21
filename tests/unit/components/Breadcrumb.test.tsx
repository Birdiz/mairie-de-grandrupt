import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock("@/i18n/navigation", () => ({
  Link: ({ children, href, ...props }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("Breadcrumb", () => {
  it("starts at the homepage and names the trail", () => {
    render(<Breadcrumb items={[{ label: "Actualités", href: "/actualites" }, { label: "PV" }]} />);
    expect(screen.getByRole("navigation", { name: "breadcrumb" })).toBeDefined();
    expect(screen.getByRole("link", { name: "home" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Actualités" })).toHaveAttribute("href", "/actualites");
  });

  it("marks the current page without making it a link", () => {
    render(<Breadcrumb items={[{ label: "Contact" }]} />);
    expect(screen.queryByRole("link", { name: "Contact" })).toBeNull();
    expect(screen.getByText("Contact")).toHaveAttribute("aria-current", "page");
  });
});
