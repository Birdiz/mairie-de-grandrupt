import { useTranslations } from "next-intl";
import { FadeIn } from "@/components/ui/FadeIn";

export function HistoireContentSection() {
  const t = useTranslations("histoire");

  return (
    <section className="bg-background py-24" aria-labelledby="histoire-presentation-title">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        {/* Présentation + chiffres clés */}
        <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
          {/* Colonne texte (3/5) */}
          <FadeIn className="lg:col-span-3">
            <h2
              id="histoire-presentation-title"
              className="font-heading text-foreground text-4xl md:text-5xl"
            >
              {t("presentation.title")}
            </h2>
            <p className="text-muted-foreground mt-6 font-sans text-base leading-relaxed">
              {t("presentation.p1")}
            </p>
            <p className="text-muted-foreground mt-4 font-sans text-base leading-relaxed">
              {t("presentation.p2")}
            </p>
          </FadeIn>

          {/* Colonne chiffres clés (2/5) */}
          <FadeIn delay="delay-200" className="lg:col-span-2">
            <div className="bg-secondary h-full rounded-2xl p-8">
              <h3 className="font-heading text-foreground mb-6 text-xl">{t("stats.title")}</h3>
              <dl className="grid grid-cols-2 gap-6">
                <div>
                  <dd className="font-heading text-primary text-3xl font-bold">
                    {t("stats.population")}
                  </dd>
                  <dt className="text-muted-foreground mt-1 font-sans text-sm">
                    {t("stats.populationLabel")}
                  </dt>
                </div>
                <div>
                  <dd className="font-heading text-primary text-3xl font-bold">
                    {t("stats.altitude")}
                  </dd>
                  <dt className="text-muted-foreground mt-1 font-sans text-sm">
                    {t("stats.altitudeLabel")}
                  </dt>
                </div>
                <div>
                  <dd className="font-heading text-primary text-3xl font-bold">
                    {t("stats.superficie")}
                  </dd>
                  <dt className="text-muted-foreground mt-1 font-sans text-sm">
                    {t("stats.superficieLabel")}
                  </dt>
                </div>
                <div>
                  <dd className="font-heading text-primary text-3xl font-bold">
                    {t("stats.origine")}
                  </dd>
                  <dt className="text-muted-foreground mt-1 font-sans text-sm">
                    {t("stats.origineLabel")}
                  </dt>
                </div>
              </dl>
            </div>
          </FadeIn>
        </div>

        {/* Histoire */}
        <FadeIn>
          <hr className="border-border my-16" />
        </FadeIn>

        <FadeIn>
          <div className="grid lg:grid-cols-5 lg:gap-16">
            <div className="lg:col-span-3">
              <h2
                id="histoire-history-title"
                className="font-heading text-foreground text-3xl md:text-4xl"
              >
                {t("history.title")}
              </h2>
              <p className="text-muted-foreground mt-6 font-sans text-base leading-relaxed">
                {t("history.p1")}
              </p>
              <p className="text-muted-foreground mt-4 font-sans text-base leading-relaxed">
                {t("history.p2")}
              </p>
              <p className="text-muted-foreground mt-4 font-sans text-base leading-relaxed">
                {t("history.p3")}
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
