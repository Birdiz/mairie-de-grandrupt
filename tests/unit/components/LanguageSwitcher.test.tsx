import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => "fr",
}));

vi.mock("@/i18n/navigation", () => ({
  usePathname: () => "/histoire",
  Link: ({
    children,
    href,
    locale,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    locale: string;
    [key: string]: unknown;
  }) => (
    <a href={locale === "fr" ? href : `/${locale}${href}`} {...props}>
      {children}
    </a>
  ),
}));

describe("LanguageSwitcher", () => {
  it("shows the current language as text, not as a link", () => {
    render(<LanguageSwitcher />);
    expect(screen.queryByRole("link", { name: /FR/ })).toBeNull();
    expect(screen.getByText("FR").closest("[aria-current]")).toHaveAttribute(
      "aria-current",
      "true",
    );
  });

  it("links the other languages to the same page", () => {
    render(<LanguageSwitcher />);
    const de = screen.getByRole("link", { name: "DE Deutsch" });
    expect(de).toHaveAttribute("href", "/de/histoire");
    expect(de).toHaveAttribute("lang", "de");
    expect(de).toHaveAttribute("hreflang", "de");
    expect(screen.getByRole("link", { name: "EN English" })).toHaveAttribute(
      "href",
      "/en/histoire",
    );
  });

  it("spells out language names in the mobile variant", () => {
    render(<LanguageSwitcher variant="full" />);
    expect(screen.getByRole("navigation", { name: "language" })).toBeDefined();
    expect(screen.getByRole("link", { name: "Deutsch" })).toBeDefined();
    expect(screen.getByText("Français")).toHaveAttribute("aria-current", "true");
  });
});
