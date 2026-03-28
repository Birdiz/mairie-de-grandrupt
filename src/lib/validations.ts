import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Le nom doit comporter au moins 2 caractères.")
    .max(100, "Le nom ne peut pas dépasser 100 caractères."),
  email: z.string().email("Veuillez saisir une adresse e-mail valide."),
  subject: z
    .string()
    .min(3, "Le sujet doit comporter au moins 3 caractères.")
    .max(200, "Le sujet ne peut pas dépasser 200 caractères."),
  message: z
    .string()
    .min(10, "Le message doit comporter au moins 10 caractères.")
    .max(2000, "Le message ne peut pas dépasser 2000 caractères."),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
