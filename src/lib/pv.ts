import type {
  SerializedEditorState,
  SerializedLexicalNode,
} from "@payloadcms/richtext-lexical/lexical";

/** Lines that are page furniture rather than content: bare page numbers,
 *  "Page 3", "3/7", or a lone separator rule. */
const PAGE_NUMBER = /^(page\s*)?\d{1,3}\s*(\/\s*\d{1,3})?$/i;
const SEPARATOR = /^[-–—_.·•*=]{2,}$/;

/** A line ending mid-sentence: the PDF wrapped it, it is not a paragraph break. */
function continuesNextLine(line: string): boolean {
  return !/[.!?:;)\]»"]$/.test(line);
}

/**
 * Turn raw per-page PDF text into clean paragraphs.
 *
 * PDF extraction emits a hard newline at every *visual* line end, so a single
 * paragraph arrives as a dozen fragments. It also repeats headers and footers
 * on every page. This re-joins wrapped lines, splits on blank lines, and drops
 * the furniture.
 *
 * @param pages text of each page, in order (`extractText(..., { mergePages: false })`)
 */
export function normalizePdfText(pages: string[]): string[] {
  const repeated = findRepeatedLines(pages);

  const paragraphs: string[] = [];
  let current = "";

  const flush = () => {
    const text = current.replace(/\s+/g, " ").trim();
    if (text.length > 0) paragraphs.push(text);
    current = "";
  };

  for (const page of pages) {
    for (const rawLine of page.split(/\r?\n/)) {
      const line = rawLine.trim();

      if (line.length === 0) {
        flush();
        continue;
      }
      if (PAGE_NUMBER.test(line) || SEPARATOR.test(line) || repeated.has(line)) {
        continue;
      }

      current = current.length > 0 ? `${current} ${line}` : line;
      if (!continuesNextLine(line)) flush();
    }
    // A page break is not necessarily a paragraph break: keep `current` so a
    // sentence split across two pages is stitched back together.
  }
  flush();

  return paragraphs;
}

/**
 * Lines appearing on (nearly) every page are headers/footers, not content.
 * Requires at least 3 pages so a 2-page PV does not lose a real repeated line.
 */
function findRepeatedLines(pages: string[]): Set<string> {
  if (pages.length < 3) return new Set();

  const counts = new Map<string, number>();
  for (const page of pages) {
    const seen = new Set(
      page
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter((l) => l.length > 0 && l.length < 120),
    );
    for (const line of seen) counts.set(line, (counts.get(line) ?? 0) + 1);
  }

  const threshold = Math.ceil(pages.length * 0.8);
  return new Set([...counts].filter(([, n]) => n >= threshold).map(([line]) => line));
}

/**
 * pdf.js aborts with "Array.prototype contains unexpected enumerable property"
 * if anything has extended the array prototype by plain assignment. drizzle-kit
 * — pulled in by the SQLite adapter — does exactly that with
 * `Array.prototype.random`.
 *
 * Re-flagging those properties as non-enumerable keeps them callable for
 * whoever added them while satisfying pdf.js's sanity check. Idempotent.
 */
export function hideArrayPrototypePollution(): void {
  for (const key of Object.keys(Array.prototype)) {
    const descriptor = Object.getOwnPropertyDescriptor(Array.prototype, key);
    if (descriptor?.configurable) {
      Object.defineProperty(Array.prototype, key, { ...descriptor, enumerable: false });
    }
  }
}

/** Build a Payload Lexical document from plain paragraphs. */
export function buildLexicalFromParagraphs(paragraphs: string[]): SerializedEditorState {
  const children = paragraphs.map((text) => ({
    type: "paragraph",
    version: 1,
    format: "" as const,
    indent: 0,
    direction: "ltr" as const,
    textFormat: 0,
    textStyle: "",
    children: [
      {
        type: "text",
        version: 1,
        detail: 0,
        format: 0,
        mode: "normal",
        style: "",
        text,
      },
    ],
  }));

  return {
    root: {
      type: "root",
      version: 1,
      format: "",
      indent: 0,
      direction: "ltr",
      children: children as unknown as SerializedLexicalNode[],
    },
  } as SerializedEditorState;
}

/**
 * A summary that fits the `excerpt` field (300 chars max), cut on a sentence
 * or word boundary rather than mid-word.
 */
export function buildExcerpt(paragraphs: string[], maxLength = 300): string {
  const text = paragraphs.join(" ").trim();
  if (text.length <= maxLength) return text;

  const window = text.slice(0, maxLength);
  const sentenceEnd = Math.max(
    window.lastIndexOf(". "),
    window.lastIndexOf("! "),
    window.lastIndexOf("? "),
  );
  if (sentenceEnd > maxLength * 0.4) return window.slice(0, sentenceEnd + 1).trim();

  const lastSpace = window.lastIndexOf(" ");
  return `${window.slice(0, lastSpace > 0 ? lastSpace : maxLength - 1).trim()}\u2026`;
}
