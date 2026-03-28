import { useTranslations } from "next-intl";
import Link from "next/link";
import { buttonVariants } from "@/lib/button-variants";
import { FadeIn } from "@/components/ui/FadeIn";
import { cn } from "@/lib/utils";

export function HeroSection() {
  const t = useTranslations("home");

  return (
    <section className="relative flex min-h-[90vh] items-center" aria-label={t("title")}>
      {/* Fond gradient Vosges — à remplacer par une photo */}
      <div
        className="from-primary via-primary/85 absolute inset-0 bg-gradient-to-br to-[var(--amber)]"
        aria-hidden="true"
      />
      {/* Overlay sombre pour lisibilité */}
      <div className="absolute inset-0 bg-black/20" aria-hidden="true" />

      <div className="relative mx-auto w-full max-w-6xl px-6 py-24 sm:px-10">
        <FadeIn>
          <p className="mb-4 font-sans text-sm font-semibold tracking-widest text-white/70 uppercase">
            {t("subtitle")}
          </p>
        </FadeIn>
        <FadeIn delay="delay-150">
          <h1 className="font-heading text-5xl leading-tight text-white md:text-7xl lg:text-8xl">
            {t("title")}
          </h1>
        </FadeIn>
        <FadeIn delay="delay-300">
          <p className="mt-6 max-w-xl font-sans text-lg text-white/80">{t("description")}</p>
        </FadeIn>
        <FadeIn delay="delay-500" className="mt-10">
          <Link
            href="/histoire"
            className={cn(
              buttonVariants({ size: "lg" }),
              "text-primary bg-white font-sans font-semibold [a]:hover:text-white",
            )}
          >
            {t("hero.cta")}
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
