import { useTranslations } from "next-intl";

const STATS = ["population", "altitude", "superficie", "origine"] as const;

export function HistoireContentSection() {
  const t = useTranslations("histoire");

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-14 px-4 pb-16 sm:px-6 lg:px-8">
      {/* Présentation + chiffres clés */}
      <section
        aria-labelledby="histoire-presentation-title"
        className="grid gap-12 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-16"
      >
        <div className="flex max-w-[66ch] flex-col gap-4">
          <h2 id="histoire-presentation-title" className="text-h2">
            {t("presentation.title")}
          </h2>
          <p className="text-pretty">{t("presentation.p1")}</p>
          <p className="text-pretty">{t("presentation.p2")}</p>
        </div>

        <div className="border-border bg-card flex flex-col gap-4 self-start border p-6 md:p-8">
          <h3 className="text-h4">{t("stats.title")}</h3>
          <dl className="grid grid-cols-2 gap-x-8">
            {STATS.map((key) => (
              <div key={key} className="border-brand-marine flex flex-col border-t-[3px] pt-3 pb-5">
                <dt className="text-muted-foreground text-small order-last">
                  {t(`stats.${key}Label`)}
                </dt>
                <dd className="font-heading text-primary text-[2rem] leading-tight font-bold">
                  {t(`stats.${key}`)}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <div aria-hidden="true" className="motif-rupt" />

      {/* Histoire */}
      <section
        aria-labelledby="histoire-history-title"
        className="flex max-w-[66ch] flex-col gap-4"
      >
        <h2 id="histoire-history-title" className="text-h2">
          {t("history.title")}
        </h2>
        <p className="text-pretty">{t("history.p1")}</p>
        <p className="text-pretty">{t("history.p2")}</p>
        <p className="text-pretty">{t("history.p3")}</p>
      </section>
    </div>
  );
}
