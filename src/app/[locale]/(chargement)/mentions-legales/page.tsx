import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { LegalSection } from "@/components/ui/LegalSection";
import { telHref } from "@/lib/phone";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("mentionsLegales");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function MentionsLegalesPage() {
  const t = await getTranslations("mentionsLegales");
  const tAddress = await getTranslations("contact.address");
  const locale = await getLocale();
  const email = tAddress("emailAddress");
  const phone = tAddress("phoneNumber");
  const rich = {
    strong: (chunks: React.ReactNode) => <strong>{chunks}</strong>,
    mail: (chunks: React.ReactNode) => (
      <a href={`mailto:${email}`} className="text-primary">
        {chunks}
      </a>
    ),
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 pt-5 pb-16 sm:px-6 lg:px-8">
      <Breadcrumb items={[{ label: t("title") }]} />
      <h1 className="text-h1">{t("title")}</h1>
      {locale !== "fr" && (
        <p className="text-muted-foreground max-w-[66ch]">{t("translationNotice")}</p>
      )}

      <div className="mt-4 flex flex-col gap-10">
        <LegalSection id="editeur" title={t("editeur.title")}>
          <p className="text-pretty">{t.rich("editeur.intro", rich)}</p>
          <ul className="list-disc space-y-1.5 pl-6">
            <li>
              <strong>{t("editeur.address")}</strong> {tAddress("street")}, {tAddress("city")}
            </li>
            <li>
              <strong>{t("editeur.phone")}</strong>{" "}
              <a href={telHref(phone)} className="text-primary">
                {phone}
              </a>
            </li>
            <li>
              <strong>{t("editeur.email")}</strong>{" "}
              <a href={`mailto:${email}`} className="text-primary">
                {email}
              </a>
            </li>
            <li>
              <strong>{t("editeur.publisher")}</strong> {t("editeur.publisherName")}
            </li>
          </ul>
        </LegalSection>

        <LegalSection id="hebergeur" title={t("hebergeur.title")}>
          <p className="text-pretty">{t("hebergeur.text")}</p>
        </LegalSection>

        <LegalSection id="propriete" title={t("propriete.title")}>
          <p className="text-pretty">{t("propriete.text")}</p>
        </LegalSection>

        <LegalSection id="donnees" title={t("donnees.title")}>
          <p className="text-pretty">{t("donnees.p1")}</p>
          <p className="text-pretty">{t("donnees.p2")}</p>
          <p className="text-pretty">{t.rich("donnees.p3", { ...rich, email })}</p>
        </LegalSection>

        <LegalSection id="cookies" title={t("cookies.title")}>
          <p className="text-pretty">{t("cookies.text")}</p>
        </LegalSection>

        <LegalSection id="liens" title={t("liens.title")}>
          <p className="text-pretty">{t("liens.text")}</p>
        </LegalSection>
      </div>
    </div>
  );
}
