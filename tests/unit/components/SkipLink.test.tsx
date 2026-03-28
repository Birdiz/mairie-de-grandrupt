import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SkipLink } from "@/components/layout/SkipLink";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

describe("SkipLink", () => {
  it("renders a link", () => {
    render(<SkipLink />);
    expect(screen.getByRole("link")).toBeDefined();
  });

  it("points to #main-content", () => {
    render(<SkipLink />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "#main-content");
  });

  it("is visually hidden by default (sr-only)", () => {
    render(<SkipLink />);
    expect(screen.getByRole("link").className).toContain("sr-only");
  });

  it("displays the skip-to-content translation key", () => {
    render(<SkipLink />);
    expect(screen.getByRole("link").textContent).toBe("skipToContent");
  });
});
