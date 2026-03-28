import { useTranslations } from "next-intl";
import { Trees, House, Hammer, type LucideProps } from "lucide-react";
import { getAllEntreprises } from "@/lib/entreprises";
import { FadeIn } from "@/components/ui/FadeIn";

type IconComponent = React.ComponentType<LucideProps>;

const ICON_MAP: Record<string, IconComponent> = {
  Trees,
  House,
  Hammer,
};

export function EntreprisesContentSection() {
  const t = useTranslations("entreprises");
  const entreprises = getAllEntreprises();

  return (
    <section className="bg-background py-24" aria-labelledby="entreprises-list-title">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <FadeIn>
          <p
            id="entreprises-list-title"
            className="text-muted-foreground mb-14 max-w-2xl font-sans text-base leading-relaxed"
          >
            {t("intro")}
          </p>
        </FadeIn>

        <FadeIn delay="delay-150">
          <ul
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            aria-label="Liste des entreprises"
          >
            {entreprises.map((entreprise) => {
              const Icon = ICON_MAP[entreprise.icon] ?? Trees;
              return (
                <li key={entreprise.slug} className="bg-card flex flex-col gap-4 rounded-2xl p-8">
                  <Icon size={32} className="text-primary shrink-0" aria-hidden="true" />
                  <div className="flex flex-col gap-2">
                    <h2 className="font-heading text-foreground text-xl">{entreprise.name}</h2>
                    <span className="bg-primary/10 text-primary w-fit rounded-full px-3 py-0.5 font-sans text-xs font-semibold">
                      {entreprise.activity}
                    </span>
                  </div>
                  <p className="text-muted-foreground font-sans text-sm leading-relaxed">
                    {entreprise.content}
                  </p>
                  {entreprise.phone && (
                    <a
                      href={`tel:${entreprise.phone.replace(/\s/g, "")}`}
                      className="text-primary hover:text-primary/80 mt-auto font-sans text-sm font-semibold transition-colors"
                    >
                      {entreprise.phone}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </FadeIn>
      </div>
    </section>
  );
}
