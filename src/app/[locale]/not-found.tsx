import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <p className="text-muted-foreground/30 text-6xl font-bold select-none" aria-hidden="true">
        404
      </p>
      <h1 className="text-foreground mt-4 font-serif text-2xl font-bold">{t("title")}</h1>
      <p className="text-muted-foreground mt-3">{t("description")}</p>
      <Link
        href="/"
        className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring mt-8 inline-flex items-center rounded-md px-5 py-2.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
      >
        {t("backHome")}
      </Link>
    </div>
  );
}
