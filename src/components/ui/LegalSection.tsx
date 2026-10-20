import type { ReactNode } from "react";

/** Section d'une page légale : titre H2 relié à la section, puis son contenu. */
export function LegalSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="flex max-w-[66ch] flex-col gap-3">
      <h2 id={id} className="text-h3">
        {title}
      </h2>
      {children}
    </section>
  );
}
