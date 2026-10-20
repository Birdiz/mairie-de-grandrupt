import { useTranslations } from "next-intl";
import Link from "next/link";
import { buttonVariants } from "@/lib/button-variants";
import { Logo } from "@/components/layout/Logo";
import { cn } from "@/lib/utils";

export function HeroSection() {
  const t = useTranslations("home");

  return (
    <section aria-labelledby="home-title">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 pt-7 pb-8 sm:px-6 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:pt-16 md:pb-14 lg:px-8">
        <div className="flex flex-col gap-5 md:gap-6">
          <h1 id="home-title" className="text-h1">
            {t("title")}
          </h1>
          <p className="text-chapo text-pretty">{t("description")}</p>
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <Link href="/contact" className={buttonVariants()}>
              {t("hero.primaryCta")}
            </Link>
            <Link href="/contact" className={cn(buttonVariants({ variant: "secondary" }))}>
              {t("hero.secondaryCta")}
            </Link>
          </div>
        </div>
        {/* Pas encore de photo du village : le symbole du logo tient la place */}
        <div aria-hidden="true" className="hidden justify-center md:flex">
          <Logo className="h-80 w-auto" />
        </div>
      </div>
    </section>
  );
}
