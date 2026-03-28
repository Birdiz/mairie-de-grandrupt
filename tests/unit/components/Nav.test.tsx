import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Nav } from "@/components/layout/Nav";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

const mockUsePathname = vi.fn(() => "/");

vi.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("Nav", () => {
  it("renders a navigation landmark", () => {
    mockUsePathname.mockReturnValue("/");
    render(<Nav />);
    expect(screen.getByRole("navigation")).toBeDefined();
  });

  it("has aria-label 'Navigation principale'", () => {
    mockUsePathname.mockReturnValue("/");
    render(<Nav />);
    expect(screen.getByRole("navigation")).toHaveAttribute("aria-label", "Navigation principale");
  });

  it("renders 5 navigation links", () => {
    mockUsePathname.mockReturnValue("/");
    render(<Nav />);
    expect(screen.getAllByRole("link")).toHaveLength(5);
  });

  it("marks the home link active on /", () => {
    mockUsePathname.mockReturnValue("/");
    render(<Nav />);
    const homeLink = screen.getByRole("link", { name: "home" });
    expect(homeLink).toHaveAttribute("aria-current", "page");
  });

  it("only one link is active at a time on /", () => {
    mockUsePathname.mockReturnValue("/");
    render(<Nav />);
    const activeLinks = screen
      .getAllByRole("link")
      .filter((l) => l.getAttribute("aria-current") === "page");
    expect(activeLinks).toHaveLength(1);
  });

  it("marks /contact link active on /contact", () => {
    mockUsePathname.mockReturnValue("/contact");
    render(<Nav />);
    const contactLink = screen.getByRole("link", { name: "contact" });
    expect(contactLink).toHaveAttribute("aria-current", "page");
  });

  it("marks /actualites link active on /actualites/un-article (startsWith)", () => {
    mockUsePathname.mockReturnValue("/actualites/un-article");
    render(<Nav />);
    const link = screen.getByRole("link", { name: "actualites" });
    expect(link).toHaveAttribute("aria-current", "page");
  });

  it("home link is not active on /contact", () => {
    mockUsePathname.mockReturnValue("/contact");
    render(<Nav />);
    const homeLink = screen.getByRole("link", { name: "home" });
    expect(homeLink).not.toHaveAttribute("aria-current");
  });

  it("links have the correct hrefs", () => {
    mockUsePathname.mockReturnValue("/");
    render(<Nav />);
    const links = screen.getAllByRole("link");
    const hrefs = links.map((l) => l.getAttribute("href"));
    expect(hrefs).toContain("/");
    expect(hrefs).toContain("/histoire");
    expect(hrefs).toContain("/actualites");
    expect(hrefs).toContain("/entreprises");
    expect(hrefs).toContain("/contact");
  });
});
