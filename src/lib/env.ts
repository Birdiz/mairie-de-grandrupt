import { z } from "zod";

const envSchema = z.object({
  RESEND_API_KEY: z.string().min(1, "RESEND_API_KEY est manquant"),
  CONTACT_EMAIL_TO: z
    .string()
    .email("CONTACT_EMAIL_TO doit être une adresse e-mail valide")
    .default("communedegrandrupt@orange.fr"),
  CONTACT_EMAIL_FROM: z
    .string()
    .email("CONTACT_EMAIL_FROM doit être une adresse e-mail valide")
    .default("noreply@grandrupt.fr"),
});

export const env = envSchema.parse({
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  CONTACT_EMAIL_TO: process.env.CONTACT_EMAIL_TO,
  CONTACT_EMAIL_FROM: process.env.CONTACT_EMAIL_FROM,
});
