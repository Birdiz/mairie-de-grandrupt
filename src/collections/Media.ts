import path from "path";
import { fileURLToPath } from "url";
import type { CollectionConfig } from "payload";
import { isLoggedIn, isPublisherOrAdmin } from "../access/index.ts";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export const Media: CollectionConfig = {
  slug: "media",
  labels: { singular: "Média", plural: "Médias" },
  admin: { group: "Contenu" },
  access: {
    read: () => true, // public site needs to display images
    create: isLoggedIn,
    update: isLoggedIn,
    delete: isPublisherOrAdmin,
  },
  upload: {
    // Stored outside the build output so it can live on a persistent Docker volume.
    staticDir: path.resolve(dirname, "../../media"),
    mimeTypes: ["image/*"],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      label: "Texte alternatif",
      admin: {
        description: "Description de l'image pour les lecteurs d'écran (accessibilité).",
      },
    },
  ],
};
