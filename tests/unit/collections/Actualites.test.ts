import { describe, it, expect, vi } from "vitest";
import { Actualites } from "@/collections/Actualites";

const validateOf = (name: string) =>
  (Actualites.fields.find((f) => "name" in f && f.name === name) as any).validate;

const req = { payload: { config: {} }, t: (key: string) => key };

describe("article with or without a PDF", () => {
  describe("excerpt", () => {
    const options = (data: unknown) => ({ data, req, maxLength: 300 });

    it("is required without a PDF", () => {
      expect(validateOf("excerpt")("", options({}))).toBe("validation:required");
    });

    it("is optional with a PDF", () => {
      expect(validateOf("excerpt")("", options({ document: 1 }))).toBe(true);
    });

    it("keeps its maximum length with a PDF", () => {
      const tooLong = "x".repeat(301);
      expect(validateOf("excerpt")(tooLong, options({ document: 1 }))).not.toBe(true);
    });
  });

  describe("content", () => {
    const validate = vi.fn().mockResolvedValue(true);
    const options = (data: unknown) => ({ data, req, editor: { validate } });

    it("asks the editor to require it without a PDF", async () => {
      await validateOf("content")(null, options({}));
      expect(validate).toHaveBeenLastCalledWith(null, expect.objectContaining({ required: true }));
    });

    it("tells the editor it is optional with a PDF", async () => {
      await validateOf("content")(null, options({ document: 1 }));
      expect(validate).toHaveBeenLastCalledWith(null, expect.objectContaining({ required: false }));
    });
  });
});
