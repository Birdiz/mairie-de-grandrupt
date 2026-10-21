import { describe, it, expect, vi } from "vitest";
import { render, screen, within, fireEvent } from "@testing-library/react";
import { Nav } from "@/components/layout/Nav";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => "fr",
}));

const mockUsePathname = vi.fn(() => "/");

vi.mock("@/i18n/navigation", () => ({
  usePathname: () => mockUsePathname(),
  Link: ({
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

/** Desktop and mobile main navs (the language switchers are separate, named navs). */
function getMainNavs() {
  return screen.getAllByRole("navigation", { name: "mainNav" });
}

/** The component renders both desktop + mobile navs. Scope to the desktop one. */
function getDesktopNav() {
  return within(getMainNavs()[0]);
}

describe("Nav", () => {
  it("renders desktop and mobile navigation landmarks", () => {
    mockUsePathname.mockReturnValue("/");
    render(<Nav />);
    expect(getMainNavs()).toHaveLength(2);
  });

  it("offers the language switcher on desktop and in the mobile menu", () => {
    mockUsePathname.mockReturnValue("/");
    render(<Nav />);
    expect(screen.getAllByRole("navigation", { name: "language" })).toHaveLength(2);
  });

  it("has aria-label on both navs", () => {
    mockUsePathname.mockReturnValue("/");
    render(<Nav />);
    for (const nav of getMainNavs()) {
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

  it("names the menu button by its visible label and toggles it", () => {
    mockUsePathname.mockReturnValue("/");
    render(<Nav />);
    const button = screen.getByRole("button", { name: "openMenu" });
    expect(button).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(button);
    expect(screen.getByRole("button", { name: "closeMenu" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("flags the current page in words in the mobile menu", () => {
    mockUsePathname.mockReturnValue("/histoire");
    render(<Nav />);
    const mobileNav = within(getMainNavs()[1]);
    expect(mobileNav.getByRole("link", { name: /histoire/ })).toHaveTextContent("currentPage");
  });

  it("offers a call link to the mairie in the mobile menu", () => {
    mockUsePathname.mockReturnValue("/");
    render(<Nav />);
    const mobileNav = within(getMainNavs()[1]);
    expect(mobileNav.getByRole("link", { name: "callMairie" }).getAttribute("href")).toMatch(
      /^tel:/,
    );
  });
});
