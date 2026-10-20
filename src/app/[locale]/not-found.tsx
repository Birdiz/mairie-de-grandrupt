import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/lib/button-variants";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <p
        className="font-heading text-brand-sapin-clair text-7xl font-bold select-none"
        aria-hidden="true"
      >
        404
      </p>
      <h1 className="text-h2 mt-4">{t("title")}</h1>
      <p className="mt-3 max-w-[50ch]">{t("description")}</p>
      <Link href="/" className={buttonVariants({ className: "mt-8" })}>
        {t("backHome")}
      </Link>
    </div>
  );
}
