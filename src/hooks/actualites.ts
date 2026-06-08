import { Forbidden } from "payload";
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionBeforeChangeHook,
  FieldHook,
} from "payload";
import { roleOf } from "../access/index.ts";

/**
 * Publish gate: writers may save drafts but may NOT publish/unpublish.
 * Only publishers and admins can transition a document to `published`.
 * Enforced server-side so it holds for the admin UI, the REST/GraphQL API,
 * and any future client.
 */
export const enforcePublishPermission: CollectionBeforeChangeHook = ({ data, req }) => {
  // Only enforce for authenticated users. Unauthenticated requests can never
  // reach create/update (blocked earlier by `isLoggedIn` access), so a missing
  // user here means a trusted server-side local-API call (seeds/migrations).
  if (data?._status === "published" && req.user) {
    const role = roleOf(req.user);
    if (role !== "admin" && role !== "publisher") {
      throw new Forbidden(req.t);
    }
  }
  return data;
};

/** Auto-derive a URL slug from the title when none is provided. */
export const slugifyFromTitle: FieldHook = ({ value, data }) => {
  if (typeof value === "string" && value.length > 0) return value;
  const title = data?.title;
  if (typeof title !== "string") return value;
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

/**
 * Refresh the public pages whenever an article changes, so edits appear
 * without a rebuild (ISR-style on-demand revalidation).
 *
 * `next/cache` is imported dynamically so it stays out of the static module
 * graph loaded by the standalone Payload CLI (where the Next runtime — and the
 * `next/cache` conditional export — is unavailable).
 */
async function revalidateArticlePaths(slug?: string): Promise<void> {
  try {
    const { revalidatePath } = await import("next/cache");
    revalidatePath("/actualites");
    revalidatePath("/"); // homepage preview
    if (slug) revalidatePath(`/actualites/${slug}`);
  } catch {
    // No-op outside a Next request context (e.g. seed/migration scripts).
  }
}

export const revalidateActualite: CollectionAfterChangeHook = async ({ doc }) => {
  await revalidateArticlePaths(doc?.slug);
  return doc;
};

export const revalidateActualiteDelete: CollectionAfterDeleteHook = async ({ doc }) => {
  await revalidateArticlePaths(doc?.slug);
  return doc;
};
