import path from "path";
import { Forbidden } from "payload";
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionBeforeChangeHook,
  CollectionBeforeValidateHook,
  FieldHook,
  PayloadRequest,
} from "payload";
import { roleOf } from "../access/index.ts";
import { formatDate } from "../lib/dates.ts";
import {
  buildExcerpt,
  buildLexicalFromParagraphs,
  hideArrayPrototypePollution,
  normalizePdfText,
} from "../lib/pv.ts";

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

/** Turn a human title into a URL-safe slug. */
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Turn `base` into a slug no other article uses, adding -2, -3… when it is taken. */
async function uniqueSlug(
  base: string,
  req: PayloadRequest,
  id?: string | number,
): Promise<string> {
  for (let n = 1; ; n++) {
    const candidate = n === 1 ? base : `${base}-${n}`;
    const { totalDocs } = await req.payload.count({
      collection: "actualites",
      where: {
        and: [
          { slug: { equals: candidate } },
          ...(id !== undefined ? [{ id: { not_equals: id } }] : []),
        ],
      },
      overrideAccess: true,
      req,
    });
    if (totalDocs === 0) return candidate;
  }
}

/**
 * Auto-derive a URL slug from the title when none is provided, and keep a typed
 * one URL-safe. The slug then stays as it is when the title changes, so that
 * links to a published article keep working; clearing the field derives it anew.
 */
export const slugifyFromTitle: FieldHook = async ({ value, data, originalDoc, req }) => {
  const typed = typeof value === "string" ? slugify(value) : "";
  if (typed) return typed;
  // Partial API update that does not touch the slug.
  if (value === undefined && originalDoc?.slug) return originalDoc.slug;
  const base = typeof data?.title === "string" ? slugify(data.title) : "";
  return base ? uniqueSlug(base, req, originalDoc?.id) : value;
};

/**
 * The slug field may be left blank, as `slugifyFromTitle` fills it on save. It is
 * refused only when neither it nor the title holds a character usable in a URL.
 * A blank title is left to the title field's own error.
 */
export const validateSlug = (value: unknown, { data }: { data?: { title?: unknown } }) => {
  const title = typeof data?.title === "string" ? data.title : "";
  if (title.trim().length === 0) return true;
  return slugify(typeof value === "string" ? value : "") || slugify(title)
    ? true
    : "Le titre ne permet pas de générer un identifiant URL : saisissez-en un.";
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
    // Every language version of the pages ("" = French without prefix, as served).
    for (const prefix of ["", "/fr", "/de", "/en"]) {
      revalidatePath(`${prefix}/actualites`);
      revalidatePath(prefix || "/"); // homepage preview
      if (slug) revalidatePath(`${prefix}/actualites/${slug}`);
    }
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

/** Resolve the on-disk path of an uploaded document, using the collection's
 *  configured `staticDir` rather than a hardcoded location. */
function documentPath(req: PayloadRequest, filename: string): string | null {
  const uploadConfig = req.payload.collections?.documents?.config?.upload;
  const staticDir = typeof uploadConfig?.staticDir === "string" ? uploadConfig.staticDir : null;
  return staticDir ? path.join(staticDir, filename) : null;
}

/**
 * The "routine" behind procès-verbaux: turn an uploaded PDF into a ready-to-read
 * article so the secretary only has to attach the file and pick the meeting date.
 *
 * Fills `title`, `slug`, `excerpt` and `content` from the PDF's text layer —
 * but only where the editor left them blank, so a manual wording always wins.
 *
 * Runs as a *collection* `beforeValidate` hook: that phase is the last one before
 * Payload validates `required` fields, so the auto-filled values satisfy them.
 * Note it runs *after* the field-level `slugifyFromTitle` (which therefore saw an
 * empty title), hence the explicit slug derivation below.
 *
 * Extraction failures (scanned PDF with no text layer, unreadable file) are
 * deliberately swallowed: the article is then saved with its PDF alone, which is
 * enough to publish it, and the summary and text can be typed in by hand.
 */
export const fillFromProcesVerbal: CollectionBeforeValidateHook = async ({
  data,
  originalDoc,
  req,
}) => {
  if (!data || data.type !== "proces-verbal" || !data.document) return data;
  // Procès-verbaux are French only: never fill a German or English version
  // with the French title and text extracted from the PDF.
  if (req.locale && req.locale !== "fr") return data;

  const isBlank = (value: unknown) => typeof value !== "string" || value.trim().length === 0;
  const seanceDate = data.date ?? originalDoc?.date;

  if (isBlank(data.title) && seanceDate) {
    data.title = `Procès-verbal du conseil municipal du ${formatDate(String(seanceDate))}`;
  }
  if (isBlank(data.slug) && typeof data.title === "string" && data.title.length > 0) {
    const base = slugify(data.title);
    if (base) data.slug = await uniqueSlug(base, req, originalDoc?.id);
  }

  const needsBody = isBlank(data.excerpt) || !data.content;
  if (!needsBody) return data;

  try {
    const documentId =
      typeof data.document === "object" ? (data.document as { id: unknown }).id : data.document;
    const doc = await req.payload.findByID({
      collection: "documents",
      id: documentId as string | number,
      depth: 0,
      overrideAccess: true,
    });

    const filename = typeof doc?.filename === "string" ? doc.filename : null;
    const filePath = filename ? documentPath(req, filename) : null;
    if (!filePath) return data;

    const { readFile } = await import("node:fs/promises");
    const { extractText } = await import("unpdf");
    const buffer = await readFile(filePath);
    hideArrayPrototypePollution();
    const { text } = await extractText(new Uint8Array(buffer), { mergePages: false });

    const paragraphs = normalizePdfText(text);
    if (paragraphs.length === 0) return data;

    if (isBlank(data.excerpt)) data.excerpt = buildExcerpt(paragraphs);
    if (!data.content) data.content = buildLexicalFromParagraphs(paragraphs);
  } catch (error) {
    req.payload.logger.warn(
      { err: error },
      "Extraction du texte du procès-verbal impossible : les champs restent à saisir manuellement.",
    );
  }

  return data;
};
