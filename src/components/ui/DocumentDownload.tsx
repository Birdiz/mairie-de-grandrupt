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
  /** Titre affiché dans le bloc (le titre du document, à défaut celui de l'article). */
  title?: string;
  /** Ligne de détails déjà formatée, par exemple « mis en ligne le 15 septembre 2026 ». */
  meta?: string;
  /** Nature du fichier, traduite (« Document PDF »). */
  typeLabel?: string;
};

/**
 * Bloc de téléchargement d'un PDF.
 *
 * Le nom accessible du lien précise le document, son format et son poids, comme
 * l'exige le critère RGAA 13.3 pour les fichiers en téléchargement.
 */
export function DocumentDownload({
  document,
  label,
  title,
  meta,
  typeLabel = "Document PDF",
}: Props) {
  const size = formatFileSize(document.filesize);
  const details = size ? `PDF, ${size}` : "PDF";
  const heading = title || document.title;

  return (
    <div className="border-brand-marine bg-card grid grid-cols-[auto_minmax(0,1fr)] items-start gap-4 border-2 p-5 md:gap-5 md:p-6">
      {/* Pictogramme de page cornée */}
      <div
        aria-hidden="true"
        className="border-brand-marine text-brand-marine flex h-[72px] w-[58px] items-end justify-center border-2 pb-2 text-base font-bold [clip-path:polygon(0_0,70%_0,100%_22%,100%_100%,0_100%)] md:h-[88px] md:w-[72px] md:text-lg"
        style={{
          background: "linear-gradient(225deg, var(--brand-marine) 0 15%, transparent 15%)",
        }}
      >
        PDF
      </div>
      <div className="flex flex-col gap-3">
        {heading && <p className="text-h4">{heading}</p>}
        <p className="text-muted-foreground text-small">
          {[size ? `${typeLabel} · ${size}` : typeLabel, meta].filter(Boolean).join(" · ")}
        </p>
        <a
          href={document.url}
          download
          className="bg-primary text-primary-foreground hover:bg-primary-hover mt-1 inline-flex min-h-13 items-center gap-2.5 self-start rounded-sm px-6 text-[1.1875rem] font-semibold no-underline hover:underline"
        >
          <span aria-hidden="true">↓</span>
          {label} <span className="sr-only">({details})</span>
        </a>
      </div>
    </div>
  );
}
