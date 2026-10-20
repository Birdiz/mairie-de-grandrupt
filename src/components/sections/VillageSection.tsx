import { useTranslations } from "next-intl";
import Link from "next/link";

const STATS = ["population", "altitude", "superficie", "origine"] as const;

export function VillageSection() {
  const t = useTranslations("home.village");
  const tStats = useTranslations("histoire.stats");

  return (
    <section className="border-border bg-card border-y" aria-labelledby="village-title">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 py-9 sm:px-6 md:grid-cols-2 md:py-16 lg:px-8">
        <div className="flex flex-col gap-4.5">
          <h2 id="village-title" className="text-h2">
            {t("title")}
          </h2>
          <p className="text-pretty">{t("rupt")}</p>
          <p className="text-pretty">{t("text")}</p>
          <Link
            href="/histoire"
            className="text-primary flex min-h-11 items-center self-start text-[1.1875rem] font-semibold"
          >
            {t("cta")}
          </Link>
        </div>
        {/* Pas encore de photo : les chiffres clés du village tiennent la place */}
        <div className="flex flex-col gap-4">
          <h3 className="text-h4">{tStats("title")}</h3>
          <dl className="grid grid-cols-2 gap-x-8">
            {STATS.map((key) => (
              <div key={key} className="border-brand-marine flex flex-col border-t-[3px] pt-3 pb-5">
                <dt className="text-muted-foreground text-small order-last">
                  {tStats(`${key}Label`)}
                </dt>
                <dd className="font-heading text-primary text-[2rem] leading-tight font-bold">
                  {tStats(key)}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
