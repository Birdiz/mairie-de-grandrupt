import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { EtagesPuce } from "@/components/ui/EtagesPuce";

const SERVICES = ["etatCivil", "urbanisme", "elections", "aideSociale", "cimetiere", "contact"];

export function ServicesSection() {
  const t = useTranslations("home.services");

  return (
    <section aria-labelledby="services-title">
      <div className="mx-auto grid max-w-6xl gap-x-14 gap-y-4 px-4 py-9 sm:px-6 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:py-16 lg:px-8">
        <div className="flex flex-col gap-4">
          <h2 id="services-title" className="text-h2">
            {t("title")}
          </h2>
          <p>{t("intro")}</p>
        </div>
        <ul className="grid gap-x-10 sm:grid-cols-2">
          {SERVICES.map((key) => (
            <li key={key}>
              <Link
                href="/contact"
                className="border-border text-foreground hover:bg-accent hover:text-accent-foreground group -mx-2 flex min-h-15 gap-3.5 border-t px-2 py-4.5 no-underline"
              >
                <EtagesPuce className="mt-1.5" />
                <span className="flex flex-col gap-1">
                  <span className="text-primary group-hover:text-accent-foreground text-[1.3125rem] leading-[1.3] font-bold underline decoration-[1.5px] underline-offset-4 group-hover:decoration-[3px]">
                    {t(key)}
                  </span>
                  <span className="text-lg leading-normal">{t(`${key}Text`)}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
