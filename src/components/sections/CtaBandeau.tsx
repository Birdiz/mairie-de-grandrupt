import { useTranslations } from "next-intl";
import Link from "next/link";
import { telHref } from "@/lib/phone";

type CtaBandeauProps = {
  title: string;
  subtitle: string;
  buttonLabel: string;
  href: string;
  sectionId: string;
};

/** Bandeau marine « Une question ? » : coordonnées de la mairie et appel à l'action. */
export function CtaBandeau({ title, subtitle, buttonLabel, href, sectionId }: CtaBandeauProps) {
  const tAddress = useTranslations("contact.address");
  const phone = tAddress("phoneNumber");

  return (
    <section className="bg-brand-marine text-white" aria-labelledby={sectionId}>
      {/* Le rupt, en vert clair, comme bord supérieur du bandeau */}
      <div aria-hidden="true" className="motif-rupt-clair bg-background" />
      <div className="mx-auto grid max-w-6xl gap-x-12 gap-y-4 px-4 py-9 sm:px-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_auto] md:items-center md:py-14 lg:px-8">
        <div className="flex flex-col gap-2.5">
          <h2 id={sectionId} className="text-h2">
            {title}
          </h2>
          <p>{subtitle}</p>
        </div>
        <div className="flex flex-col gap-1.5 leading-normal">
          <a
            href={telHref(phone)}
            className="flex min-h-11 items-center self-start text-[1.625rem] font-bold text-white md:text-[1.75rem]"
          >
            {phone}
          </a>
          <span>{tAddress("street")}</span>
          <span>{tAddress("city")}</span>
        </div>
        <Link
          href={href}
          className="text-brand-marine flex min-h-13 items-center justify-center rounded-sm bg-white px-6.5 text-[1.1875rem] font-semibold no-underline hover:underline focus-visible:outline-white"
        >
          {buttonLabel}
        </Link>
      </div>
    </section>
  );
}
