import type { CollectionConfig } from "payload";
import { isLoggedIn, isPublisherOrAdmin } from "../access/index.ts";
import {
  enforcePublishPermission,
  revalidateActualite,
  revalidateActualiteDelete,
  slugifyFromTitle,
} from "../hooks/actualites.ts";

export const Actualites: CollectionConfig = {
  slug: "actualites",
  labels: { singular: "Actualité", plural: "Actualités" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "date", "_status", "updatedAt"],
    group: "Contenu",
  },
  access: {
    // Public (unauthenticated) reads are limited to published articles;
    // logged-in staff can see drafts too.
    read: ({ req: { user } }) => {
      if (user) return true;
      return { _status: { equals: "published" } };
    },
    create: isLoggedIn,
    update: isLoggedIn,
    delete: isPublisherOrAdmin,
  },
  versions: {
    drafts: { autosave: false },
    maxPerDoc: 20,
  },
  hooks: {
    beforeChange: [enforcePublishPermission],
    afterChange: [revalidateActualite],
    afterDelete: [revalidateActualiteDelete],
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      label: "Titre",
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      label: "Identifiant URL",
      admin: {
        position: "sidebar",
        description: "Généré depuis le titre. Ex : fete-du-village-2026",
      },
      hooks: {
        beforeValidate: [slugifyFromTitle],
      },
    },
    {
      name: "date",
      type: "date",
      required: true,
      label: "Date",
      defaultValue: () => new Date().toISOString(),
      admin: {
        position: "sidebar",
        date: { pickerAppearance: "dayOnly", displayFormat: "dd/MM/yyyy" },
      },
    },
    {
      name: "excerpt",
      type: "textarea",
      required: true,
      maxLength: 300,
      label: "Résumé",
      admin: { description: "Court résumé affiché dans la liste des actualités." },
    },
    {
      name: "coverImage",
      type: "upload",
      relationTo: "media",
      required: false,
      label: "Image de couverture",
    },
    {
      name: "content",
      type: "richText",
      required: true,
      label: "Contenu",
    },
  ],
};
