import { validations } from "payload";
import type { CollectionConfig } from "payload";
import { isLoggedIn, isPublisherOrAdmin } from "../access/index.ts";
import {
  enforcePublishPermission,
  fillFromProcesVerbal,
  revalidateActualite,
  revalidateActualiteDelete,
  slugifyFromTitle,
  validateSlug,
} from "../hooks/actualites.ts";

/** An article can be just a PDF: its summary and text are then optional. */
const requiredWithoutPdf = (data: unknown) => !(data as { document?: unknown })?.document;

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
    beforeValidate: [fillFromProcesVerbal],
    beforeChange: [enforcePublishPermission],
    afterChange: [revalidateActualite],
    afterDelete: [revalidateActualiteDelete],
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      localized: true,
      label: "Titre",
      admin: {
        description:
          "Pour traduire l'article, choisissez Deutsch ou English en haut de page. Les procès-verbaux restent en français.",
      },
    },
    {
      name: "type",
      type: "select",
      required: true,
      defaultValue: "standard",
      label: "Type",
      options: [
        { label: "Actualité", value: "standard" },
        { label: "Procès-verbal du conseil municipal", value: "proces-verbal" },
      ],
      admin: {
        position: "sidebar",
        description:
          "« Procès-verbal » remplit automatiquement titre, résumé et contenu à partir du PDF joint.",
      },
    },
    {
      name: "slug",
      type: "text",
      unique: true,
      index: true,
      label: "Identifiant URL",
      admin: {
        position: "sidebar",
        description:
          "Généré depuis le titre à l'enregistrement, et mis à jour s'il change, sauf si vous le saisissez vous-même. Attention : l'adresse d'un article publié change alors, et ses anciens liens ne fonctionnent plus.",
      },
      hooks: {
        beforeValidate: [slugifyFromTitle],
      },
      validate: validateSlug,
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
      maxLength: 300,
      localized: true,
      label: "Résumé",
      admin: {
        description:
          "Court résumé affiché dans la liste des actualités. Facultatif si un PDF est joint.",
      },
      validate: (value, options) =>
        validations.textarea(value, { ...options, required: requiredWithoutPdf(options.data) }),
    },
    {
      name: "coverImage",
      type: "upload",
      relationTo: "media",
      required: false,
      label: "Image de couverture",
    },
    {
      name: "document",
      type: "upload",
      relationTo: "documents",
      required: false,
      label: "Document PDF joint",
      admin: {
        description:
          "Proposé au téléchargement dans l'article. Un PDF seul suffit : le résumé et le contenu deviennent facultatifs. Obligatoire pour un procès-verbal.",
      },
      // A procès-verbal without its PDF would not satisfy the commune's legal
      // publication duty (art. L2121-25 CGCT), so the file is required there.
      validate: (value: unknown, { data }: { data?: { type?: string } }) =>
        !value && data?.type === "proces-verbal"
          ? "Un procès-verbal doit être accompagné de son PDF."
          : true,
    },
    {
      name: "content",
      type: "richText",
      localized: true,
      label: "Contenu",
      admin: { description: "Facultatif si un PDF est joint." },
      validate: (value, options) =>
        validations.richText(value, { ...options, required: requiredWithoutPdf(options.data) }),
    },
  ],
};
