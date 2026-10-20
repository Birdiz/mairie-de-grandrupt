import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Header } from "@/components/layout/Header";

vi.mock("@/components/layout/Nav", () => ({
  Nav: () => null,
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

describe("Header", () => {
  it("links to the homepage with an accessible name", () => {
    render(<Header />);
    const home = screen.getByRole("link", { name: "Grandrupt — Accueil" });
    expect(home).toHaveAttribute("href", "/");
  });

  it("shows the village logo as decoration", () => {
    render(<Header />);
    const logo = screen.getByRole("link").querySelector("svg");
    expect(logo).not.toBeNull();
    expect(logo).toHaveAttribute("aria-hidden", "true");
  });
});
