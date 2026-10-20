import { useTranslations } from "next-intl";
import { Trees, House, Hammer, type LucideProps } from "lucide-react";
import { getAllEntreprises } from "@/lib/entreprises";

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
    <section aria-labelledby="entreprises-list-title">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 pb-16 sm:px-6 lg:px-8">
        <p id="entreprises-list-title" className="max-w-[66ch] text-pretty">
          {t("intro")}
        </p>

        <ul
          className="grid grid-cols-1 gap-x-10 gap-y-4 sm:grid-cols-2 lg:grid-cols-3"
          aria-label="Liste des entreprises"
        >
          {entreprises.map((entreprise) => {
            const Icon = ICON_MAP[entreprise.icon] ?? Trees;
            return (
              <li
                key={entreprise.slug}
                className="border-brand-marine flex flex-col gap-3 border-t-[3px] pt-5 pb-6"
              >
                <Icon size={30} className="text-brand-sapin shrink-0" aria-hidden="true" />
                <div className="flex flex-col gap-2">
                  <h2 className="text-h4">{entreprise.name}</h2>
                  <span className="border-secondary-foreground text-secondary-foreground w-fit border-[1.5px] px-2 py-0.5 text-base font-semibold">
                    {entreprise.activity}
                  </span>
                </div>
                <p className="text-lg leading-[1.55]">{entreprise.content}</p>
                {entreprise.phone && (
                  <a
                    href={`tel:${entreprise.phone.replace(/\s/g, "")}`}
                    className="text-primary mt-auto self-start font-semibold"
                  >
                    {entreprise.phone}
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
