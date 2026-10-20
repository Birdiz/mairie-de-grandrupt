import { describe, it, expect } from "vitest";
import { telHref } from "@/lib/phone";

describe("telHref", () => {
  it("turns a French number into an international tel: link", () => {
    expect(telHref("03 29 41 03 74")).toBe("tel:+33329410374");
  });
});
