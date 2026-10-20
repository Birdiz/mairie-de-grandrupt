import { useTranslations } from "next-intl";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

type Namespace = "histoire" | "actualites" | "contact" | "entreprises";

/** En-tête des pages intérieures : fil d'Ariane, titre et chapô, sur le fond papier. */
export function PageHeader({ ns }: { ns: Namespace }) {
  const t = useTranslations(ns);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 pt-5 pb-8 sm:px-6 md:pt-7 md:pb-12 lg:px-8">
      <Breadcrumb items={[{ label: t("title") }]} />
      <h1 className="text-h1">{t("title")}</h1>
      <p className="text-chapo max-w-[60ch] text-pretty">{t("hero.subtitle")}</p>
    </div>
  );
}
