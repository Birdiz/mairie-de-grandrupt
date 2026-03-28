import { useTranslations } from "next-intl";
import Link from "next/link";
import { FileText, Building2, Vote, Heart, Flower2, Phone } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";

type Service = {
  key: string;
  icon: React.ElementType;
  href: string;
};

const SERVICES: Service[] = [
  { key: "etatCivil", icon: FileText, href: "/contact" },
  { key: "urbanisme", icon: Building2, href: "/contact" },
  { key: "elections", icon: Vote, href: "/contact" },
  { key: "aideSociale", icon: Heart, href: "/contact" },
  { key: "cimetiere", icon: Flower2, href: "/contact" },
  { key: "contact", icon: Phone, href: "/contact" },
];

export function ServicesSection() {
  const t = useTranslations("home.services");

  return (
    <section className="bg-secondary py-24" aria-labelledby="services-title">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <FadeIn className="mb-14 text-center">
          <h2 id="services-title" className="font-heading text-foreground text-4xl md:text-5xl">
            {t("title")}
          </h2>
        </FadeIn>

        <FadeIn delay="delay-150">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {SERVICES.map(({ key, icon: Icon, href }) => (
              <Link
                key={key}
                href={href}
                className="group bg-card hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring flex flex-col items-center gap-4 rounded-xl p-8 text-center transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                <Icon
                  size={32}
                  className="text-primary group-hover:text-accent-foreground transition-colors"
                  aria-hidden="true"
                />
                <span className="text-foreground group-hover:text-accent-foreground font-sans text-sm font-semibold transition-colors">
                  {t(key)}
                </span>
              </Link>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
