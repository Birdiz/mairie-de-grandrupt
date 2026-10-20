"use client";

import { buttonVariants } from "@/lib/button-variants";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <h1 className="text-h2">Une erreur est survenue</h1>
      <p className="mt-3 max-w-[50ch]">
        Une erreur inattendue s&apos;est produite. Veuillez réessayer.
      </p>
      {error.digest && (
        <p className="text-muted-foreground text-small mt-2">Référence : {error.digest}</p>
      )}
      <button onClick={unstable_retry} className={buttonVariants({ className: "mt-8" })}>
        Réessayer
      </button>
    </div>
  );
}
