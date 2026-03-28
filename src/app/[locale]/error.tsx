"use client";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <h1 className="text-foreground font-serif text-2xl font-bold">Une erreur est survenue</h1>
      <p className="text-muted-foreground mt-3">
        Une erreur inattendue s&apos;est produite. Veuillez réessayer.
      </p>
      {error.digest && (
        <p className="text-muted-foreground/60 mt-2 text-xs">Référence : {error.digest}</p>
      )}
      <button
        onClick={unstable_retry}
        className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring mt-8 inline-flex items-center rounded-md px-5 py-2.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
      >
        Réessayer
      </button>
    </div>
  );
}
