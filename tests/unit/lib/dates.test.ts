import { describe, it, expect } from "vitest";
import { formatDate } from "@/lib/dates";

describe("formatDate", () => {
  it("returns a non-empty string", () => {
    expect(formatDate("2026-01-15").length).toBeGreaterThan(0);
  });

  it("includes the year", () => {
    expect(formatDate("2026-03-08")).toContain("2026");
  });

  it("includes the French month name", () => {
    expect(formatDate("2026-03-08")).toMatch(/mars/i);
  });

  it("formats day and year for January", () => {
    const result = formatDate("2026-01-01");
    expect(result).toContain("2026");
    expect(result).toMatch(/janvier/i);
  });

  it("handles full ISO datetime strings (as stored by Payload)", () => {
    expect(formatDate("2026-03-08T00:00:00.000Z")).toMatch(/2026/);
  });
});
