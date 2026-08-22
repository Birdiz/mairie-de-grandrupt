import path from "path";
import { fileURLToPath } from "url";
import type { CollectionConfig } from "payload";
import { isLoggedIn, isPublisherOrAdmin } from "../access/index.ts";

const dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * PDF attachments (procès-verbaux de conseil municipal, arrêtés, formulaires…).
 *
 * Kept separate from `media` so the image picker stays image-only, but stored
 * *inside* `media/` so it rides the existing `mairie-media` Docker volume — no
 * extra volume to remember when deploying.
 */
export const Documents: CollectionConfig = {
  slug: "documents",
  labels: { singular: "Document", plural: "Documents" },
  admin: { useAsTitle: "title", group: "Contenu" },
  access: {
    read: () => true, // public site links to these files for download
    create: isLoggedIn,
    update: isLoggedIn,
    delete: isPublisherOrAdmin,
  },
  upload: {
    staticDir: path.resolve(dirname, "../../media/documents"),
    mimeTypes: ["application/pdf"],
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      label: "Intitulé",
      admin: {
        description:
          "Nom lisible du document, utilisé comme libellé du lien de téléchargement. Ex : Procès-verbal du 12 mars 2026.",
      },
    },
  ],
};
