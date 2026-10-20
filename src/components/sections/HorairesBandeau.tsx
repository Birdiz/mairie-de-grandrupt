import { useTranslations } from "next-intl";
import { telHref } from "@/lib/phone";

/** Bandeau des horaires d'ouverture, juste sous le hero de l'accueil. */
export function HorairesBandeau() {
  const t = useTranslations("home.horaires");
  const tAddress = useTranslations("contact.address");
  const hours = tAddress("hoursDetail").split("\n");
  const phone = tAddress("phoneNumber");

  return (
    <section aria-labelledby="horaires-title" className="bg-secondary">
      <div className="mx-auto flex max-w-6xl flex-col gap-1.5 px-4 py-5 sm:px-6 md:flex-row md:flex-wrap md:items-center md:gap-x-10 lg:px-8">
        <h2
          id="horaires-title"
          className="text-secondary-foreground text-lg font-bold md:text-[1.1875rem]"
        >
          {t("title")}
        </h2>
        <ul className="contents">
          {hours.map((line) => (
            <li key={line} className="text-lg md:text-[1.1875rem]">
              {line}
            </li>
          ))}
        </ul>
        <p className="text-lg md:text-[1.1875rem]">
          {t("phone")}{" "}
          <a href={telHref(phone)} className="text-secondary-foreground font-semibold">
            {phone}
          </a>
        </p>
      </div>
    </section>
  );
}
