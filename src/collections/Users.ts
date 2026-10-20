import type { CollectionConfig } from "payload";
import {
  canAccessAdminPanel,
  isAdmin,
  isAdminOrSelf,
  isLoggedIn,
  isAdminFieldLevel,
} from "../access/index.ts";

export const Users: CollectionConfig = {
  slug: "users",
  labels: { singular: "Utilisateur", plural: "Utilisateurs" },
  auth: {
    // In production the site is HTTPS-only (Caddy), so the session cookie gets
    // the Secure flag and is never sent over plain HTTP. Off in development,
    // which runs on http://localhost.
    cookies: { secure: process.env.NODE_ENV === "production" },
  },
  admin: {
    useAsTitle: "email",
    defaultColumns: ["name", "email", "role"],
    group: "Administration",
  },
  access: {
    // Any logged-in user can access the admin panel...
    admin: canAccessAdminPanel,
    // ...but only admins manage accounts.
    create: isAdmin,
    read: isLoggedIn,
    update: isAdminOrSelf,
    delete: isAdmin,
  },
  hooks: {
    // Bootstrap: the very first user created (via the create-first-user screen,
    // where no authenticated user exists yet) is forced to admin.
    beforeChange: [
      async ({ req, operation, data }) => {
        if (operation === "create") {
          const { totalDocs } = await req.payload.count({ collection: "users" });
          if (totalDocs === 0) {
            return { ...data, role: "admin" };
          }
        }
        return data;
      },
    ],
  },
  fields: [
    { name: "name", type: "text", label: "Nom" },
    {
      name: "role",
      type: "select",
      label: "Rôle",
      required: true,
      defaultValue: "writer",
      options: [
        { label: "Rédacteur", value: "writer" },
        { label: "Publicateur", value: "publisher" },
        { label: "Administrateur", value: "admin" },
      ],
      // Only admins can assign or change roles.
      access: {
        create: isAdminFieldLevel,
        update: isAdminFieldLevel,
      },
      admin: {
        description:
          "Rédacteur : rédige des brouillons. Publicateur : publie. Administrateur : gère les comptes.",
      },
    },
  ],
};
