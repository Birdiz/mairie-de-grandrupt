import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
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

/** The component renders both desktop + mobile navs. Scope to the desktop one. */
function getDesktopNav() {
  return within(screen.getAllByRole("navigation")[0]);
}

describe("Nav", () => {
  it("renders desktop and mobile navigation landmarks", () => {
    mockUsePathname.mockReturnValue("/");
    render(<Nav />);
    expect(screen.getAllByRole("navigation")).toHaveLength(2);
  });

  it("has aria-label on both navs", () => {
    mockUsePathname.mockReturnValue("/");
    render(<Nav />);
    for (const nav of screen.getAllByRole("navigation")) {
      expect(nav).toHaveAttribute("aria-label", "mainNav");
    }
  });

  it("renders 4 navigation links in the desktop nav", () => {
    mockUsePathname.mockReturnValue("/");
    render(<Nav />);
    expect(getDesktopNav().getAllByRole("link")).toHaveLength(4);
  });

  it("marks the home link active on /", () => {
    mockUsePathname.mockReturnValue("/");
    render(<Nav />);
    const homeLink = getDesktopNav().getByRole("link", { name: "home" });
    expect(homeLink).toHaveAttribute("aria-current", "page");
  });

  it("only one link is active at a time on /", () => {
    mockUsePathname.mockReturnValue("/");
    render(<Nav />);
    const activeLinks = getDesktopNav()
      .getAllByRole("link")
      .filter((l) => l.getAttribute("aria-current") === "page");
    expect(activeLinks).toHaveLength(1);
  });

  it("marks /contact link active on /contact", () => {
    mockUsePathname.mockReturnValue("/contact");
    render(<Nav />);
    const contactLink = getDesktopNav().getByRole("link", { name: "contact" });
    expect(contactLink).toHaveAttribute("aria-current", "page");
  });

  it("marks /actualites link active on /actualites/un-article (startsWith)", () => {
    mockUsePathname.mockReturnValue("/actualites/un-article");
    render(<Nav />);
    const link = getDesktopNav().getByRole("link", { name: "actualites" });
    expect(link).toHaveAttribute("aria-current", "page");
  });

  it("home link is not active on /contact", () => {
    mockUsePathname.mockReturnValue("/contact");
    render(<Nav />);
    const homeLink = getDesktopNav().getByRole("link", { name: "home" });
    expect(homeLink).not.toHaveAttribute("aria-current");
  });

  it("links have the correct hrefs", () => {
    mockUsePathname.mockReturnValue("/");
    render(<Nav />);
    const hrefs = getDesktopNav()
      .getAllByRole("link")
      .map((l) => l.getAttribute("href"));
    expect(hrefs).toContain("/");
    expect(hrefs).toContain("/histoire");
    expect(hrefs).toContain("/actualites");
    expect(hrefs).toContain("/contact");
  });

  it("does not expose the hidden Entreprises page in the nav", () => {
    mockUsePathname.mockReturnValue("/");
    render(<Nav />);
    const hrefs = getDesktopNav()
      .getAllByRole("link")
      .map((l) => l.getAttribute("href"));
    expect(hrefs).not.toContain("/entreprises");
  });
});
