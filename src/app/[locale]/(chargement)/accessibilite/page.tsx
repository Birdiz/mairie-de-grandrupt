import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { LegalSection } from "@/components/ui/LegalSection";
import { formatDate } from "@/lib/dates";

/** Date à laquelle la déclaration d'accessibilité a été établie. */
const DECLARATION_DATE = "2026-03-27";

const MEASURES = [
  "skipLink",
  "keyboard",
  "focus",
  "aria",
  "contrast",
  "alt",
  "headings",
  "lang",
] as const;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("accessibilite");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function AccessibilitePage() {
  const t = await getTranslations("accessibilite");
  const tAddress = await getTranslations("contact.address");
  const locale = await getLocale();
  const email = tAddress("emailAddress");
  const rich = {
    strong: (chunks: React.ReactNode) => <strong>{chunks}</strong>,
    code: (chunks: React.ReactNode) => <code>{chunks}</code>,
    mail: (chunks: React.ReactNode) => (
      <a href={`mailto:${email}`} className="text-primary">
        {chunks}
      </a>
    ),
    contact: (chunks: React.ReactNode) => (
      <Link href="/contact" className="text-primary">
        {chunks}
      </Link>
    ),
    link: (chunks: React.ReactNode) => (
      <a
        href="https://www.defenseurdesdroits.fr"
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary"
      >
        {chunks}
      </a>
    ),
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 pt-5 pb-16 sm:px-6 lg:px-8">
      <Breadcrumb items={[{ label: t("title") }]} />
      <h1 className="text-h1">{t("title")}</h1>
      <p className="text-muted-foreground">{t("subtitle")}</p>
      {locale !== "fr" && (
        <p className="text-muted-foreground max-w-[66ch]">{t("translationNotice")}</p>
      )}

      <div className="mt-4 flex flex-col gap-10">
        <LegalSection id="etat" title={t("etat.title")}>
          <p className="text-pretty">{t.rich("etat.text", rich)}</p>
        </LegalSection>

        <LegalSection id="technologies" title={t("technologies.title")}>
          <ul className="list-disc space-y-1.5 pl-6">
            <li>HTML5</li>
            <li>CSS3</li>
            <li>JavaScript</li>
            <li>Next.js (React)</li>
          </ul>
        </LegalSection>

        <LegalSection id="mesures" title={t("mesures.title")}>
          <ul className="list-disc space-y-1.5 pl-6">
            {MEASURES.map((key) => (
              <li key={key}>{t.rich(`mesures.${key}`, rich)}</li>
            ))}
          </ul>
        </LegalSection>

        <LegalSection id="retour" title={t("retour.title")}>
          <p className="text-pretty">{t.rich("retour.p1", { ...rich, email })}</p>
          <p className="text-pretty">{t("retour.p2")}</p>
        </LegalSection>

        <LegalSection id="recours" title={t("recours.title")}>
          <p className="text-pretty">{t.rich("recours.text", rich)}</p>
        </LegalSection>

        <LegalSection id="date" title={t("date.title")}>
          <p>{t.rich("date.text", { ...rich, date: formatDate(DECLARATION_DATE, locale) })}</p>
        </LegalSection>
      </div>
    </div>
  );
}
