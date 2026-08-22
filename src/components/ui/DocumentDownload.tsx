import { FileText } from "lucide-react";
import type { ArticleDocument } from "@/lib/actualites";

/** Human-readable file size, e.g. "240 Ko". Returns null when unknown. */
function formatFileSize(bytes: number | null): string | null {
  if (bytes === null || bytes <= 0) return null;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1).replace(".", ",")} Mo`;
}

type Props = {
  document: ArticleDocument;
  label: string;
};

/**
 * Download link for a PDF attachment.
 *
 * The accessible name spells out the document, its format and its weight, as
 * RGAA criterion 13.3 requires for links to downloadable files.
 */
export function DocumentDownload({ document, label }: Props) {
  const size = formatFileSize(document.filesize);
  const details = size ? `PDF, ${size}` : "PDF";

  return (
    <a
      href={document.url}
      download
      className="border-border bg-card text-foreground hover:border-primary focus-visible:ring-ring inline-flex items-center gap-3 rounded-lg border px-5 py-4 font-sans text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      <FileText size={20} className="text-primary shrink-0" aria-hidden="true" />
      <span>
        {label} <span className="text-muted-foreground font-normal">({details})</span>
      </span>
    </a>
  );
}
