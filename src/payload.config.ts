import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import sharp from "sharp";

import { Users } from "./collections/Users.ts";
import { Actualites } from "./collections/Actualites.ts";
import { Media } from "./collections/Media.ts";
import { migrations } from "./migrations/index.ts";

const dirname = path.dirname(fileURLToPath(import.meta.url));

// Fail fast: never run with an empty/weak secret, which would let auth JWTs and
// cookies be forged. A real value must be provided via the environment.
const secret = process.env.PAYLOAD_SECRET;
if (!secret || secret.length < 32) {
  throw new Error(
    "PAYLOAD_SECRET is missing or too short (need at least 32 characters). " +
      "Generate one with `openssl rand -base64 32`.",
  );
}

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: "— Grandrupt",
    },
  },
  collections: [Actualites, Media, Users],
  editor: lexicalEditor(),
  secret,
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || "file:./data/payload.db",
    },
    // Dev: schema auto-syncs via `push`. Prod: `push` is disabled by Payload,
    // so these bundled migrations are run automatically at startup.
    push: true,
    migrationDir: path.resolve(dirname, "migrations"),
    prodMigrations: migrations,
  }),
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
});
