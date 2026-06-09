import { useTranslations } from "next-intl";
import { FadeIn } from "@/components/ui/FadeIn";

export function EntreprisesHero() {
  const t = useTranslations("entreprises");

  return (
    <section className="relative flex min-h-[55vh] items-end pb-16" aria-label={t("title")}>
      <div
        className="from-primary via-primary/85 absolute inset-0 bg-gradient-to-br to-[var(--amber)]"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-black/20" aria-hidden="true" />

      <div className="relative mx-auto w-full max-w-6xl px-6 py-16 sm:px-10">
        <FadeIn>
          <p className="mb-4 font-sans text-sm font-semibold tracking-widest text-white/70 uppercase">
            Grandrupt
          </p>
        </FadeIn>
        <FadeIn delay="delay-150">
          <h1 className="font-heading text-5xl leading-tight text-white md:text-6xl lg:text-7xl">
            {t("title")}
          </h1>
        </FadeIn>
        <FadeIn delay="delay-300">
          <p className="mt-5 max-w-xl font-sans text-lg text-white/80">{t("hero.subtitle")}</p>
        </FadeIn>
      </div>
    </section>
  );
}
