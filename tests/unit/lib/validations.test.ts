import { describe, it, expect } from "vitest";
import { contactSchema } from "@/lib/validations";

const valid = {
  name: "Jean Dupont",
  email: "jean@exemple.fr",
  subject: "Question",
  message: "Ceci est un message de test suffisamment long.",
};

describe("contactSchema", () => {
  it("accepts valid data", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  describe("name", () => {
    it("rejects name shorter than 2 chars", () => {
      const r = contactSchema.safeParse({ ...valid, name: "A" });
      expect(r.success).toBe(false);
      if (!r.success) {
        expect(r.error.flatten().fieldErrors.name).toContain(
          "Le nom doit comporter au moins 2 caractères.",
        );
      }
    });

    it("accepts name of exactly 2 chars", () => {
      expect(contactSchema.safeParse({ ...valid, name: "AB" }).success).toBe(true);
    });

    it("rejects name longer than 100 chars", () => {
      const r = contactSchema.safeParse({ ...valid, name: "A".repeat(101) });
      expect(r.success).toBe(false);
      if (!r.success) {
        expect(r.error.flatten().fieldErrors.name).toContain(
          "Le nom ne peut pas dépasser 100 caractères.",
        );
      }
    });
  });

  describe("email", () => {
    it("rejects invalid email", () => {
      const r = contactSchema.safeParse({ ...valid, email: "pas-un-email" });
      expect(r.success).toBe(false);
      if (!r.success) {
        expect(r.error.flatten().fieldErrors.email).toContain(
          "Veuillez saisir une adresse e-mail valide.",
        );
      }
    });

    it("rejects email without domain", () => {
      expect(contactSchema.safeParse({ ...valid, email: "user@" }).success).toBe(false);
    });
  });

  describe("subject", () => {
    it("rejects subject shorter than 3 chars", () => {
      const r = contactSchema.safeParse({ ...valid, subject: "AB" });
      expect(r.success).toBe(false);
      if (!r.success) {
        expect(r.error.flatten().fieldErrors.subject).toContain(
          "Le sujet doit comporter au moins 3 caractères.",
        );
      }
    });

    it("rejects subject longer than 200 chars", () => {
      const r = contactSchema.safeParse({ ...valid, subject: "A".repeat(201) });
      expect(r.success).toBe(false);
      if (!r.success) {
        expect(r.error.flatten().fieldErrors.subject).toContain(
          "Le sujet ne peut pas dépasser 200 caractères.",
        );
      }
    });
  });

  describe("message", () => {
    it("rejects message shorter than 10 chars", () => {
      const r = contactSchema.safeParse({ ...valid, message: "Court" });
      expect(r.success).toBe(false);
      if (!r.success) {
        expect(r.error.flatten().fieldErrors.message).toContain(
          "Le message doit comporter au moins 10 caractères.",
        );
      }
    });

    it("accepts message of exactly 10 chars", () => {
      expect(contactSchema.safeParse({ ...valid, message: "1234567890" }).success).toBe(true);
    });

    it("rejects message longer than 2000 chars", () => {
      const r = contactSchema.safeParse({ ...valid, message: "A".repeat(2001) });
      expect(r.success).toBe(false);
      if (!r.success) {
        expect(r.error.flatten().fieldErrors.message).toContain(
          "Le message ne peut pas dépasser 2000 caractères.",
        );
      }
    });
  });
});
