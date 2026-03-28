import { useTranslations } from "next-intl";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";

export function VillageSection() {
  const t = useTranslations("home.village");

  return (
    <section className="bg-background py-24" aria-labelledby="village-title">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <div className="flex flex-col-reverse gap-12 lg:flex-row lg:items-center lg:gap-20">
          {/* Texte */}
          <FadeIn className="flex-1">
            <h2 id="village-title" className="font-heading text-foreground text-4xl md:text-5xl">
              {t("title")}
            </h2>
            <p className="text-muted-foreground mt-6 max-w-prose font-sans text-base leading-relaxed">
              {t("text")}
            </p>
            <Link
              href="/histoire"
              className="text-primary focus-visible:ring-ring mt-8 inline-flex items-center gap-2 font-sans text-sm font-semibold hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              {t("cta")}
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </FadeIn>

          {/* Placeholder image — à remplacer par next/image */}
          <FadeIn delay="delay-200" className="flex-1">
            <div
              className="from-primary/80 to-primary/40 aspect-[4/3] w-full rounded-2xl bg-gradient-to-br"
              role="img"
              aria-label="Vue du village de Grandrupt dans les Vosges"
            />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
