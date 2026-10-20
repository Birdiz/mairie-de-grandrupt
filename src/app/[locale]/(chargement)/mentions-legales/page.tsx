import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("mentionsLegales");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function MentionsLegalesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-5 pb-16 sm:px-6 lg:px-8">
      <div className="mb-4">
        <Link href="/" className="text-primary text-small inline-flex min-h-11 items-center">
          ← Accueil
        </Link>
      </div>

      <h1 className="text-h1 mb-8">Mentions légales</h1>

      <div className="flex flex-col gap-10">
        <section aria-labelledby="editeur">
          <h2 id="editeur" className="text-h3 mb-3">
            Éditeur du site
          </h2>
          <p className="max-w-[66ch] text-pretty">
            Le présent site est édité par la <strong>commune de Grandrupt</strong> (88210), Vosges,
            France.
          </p>
          <ul className="mt-3 list-disc space-y-1.5 pl-6">
            <li>
              <strong>Adresse :</strong> 8 rue de la Mairie, 88210 Grandrupt
            </li>
            <li>
              <strong>Téléphone :</strong> 03 29 41 03 74
            </li>
            <li>
              <strong>E-mail :</strong>{" "}
              <a href="mailto:communedegrandrupt@orange.fr" className="text-primary">
                communedegrandrupt@orange.fr
              </a>
            </li>
            <li>
              <strong>Responsable de la publication :</strong> Le Maire de Grandrupt
            </li>
          </ul>
        </section>

        <section aria-labelledby="hebergeur">
          <h2 id="hebergeur" className="text-h3 mb-3">
            Hébergeur
          </h2>
          <p className="max-w-[66ch] text-pretty">
            Ce site est hébergé par un prestataire tiers. Pour toute question relative à
            l&apos;hébergement, veuillez contacter la mairie.
          </p>
        </section>

        <section aria-labelledby="propriete">
          <h2 id="propriete" className="text-h3 mb-3">
            Propriété intellectuelle
          </h2>
          <p className="max-w-[66ch] text-pretty">
            L&apos;ensemble du contenu de ce site (textes, images, graphismes) est la propriété de
            Grandrupt ou de ses partenaires. Toute reproduction, représentation ou diffusion,
            intégrale ou partielle, est interdite sans l&apos;autorisation écrite préalable de la
            commune.
          </p>
        </section>

        <section aria-labelledby="donnees">
          <h2 id="donnees" className="text-h3 mb-3">
            Données personnelles
          </h2>
          <p className="max-w-[66ch] text-pretty">
            Conformément au Règlement Général sur la Protection des Données (RGPD — Règlement UE
            2016/679) et à la loi Informatique et Libertés du 6 janvier 1978 modifiée, vous disposez
            d&apos;un droit d&apos;accès, de rectification et de suppression des données vous
            concernant.
          </p>
          <p className="mt-3 max-w-[66ch] text-pretty">
            Les données collectées via le formulaire de contact (nom, adresse e-mail, sujet et
            message) sont utilisées uniquement pour répondre à votre demande et ne sont pas
            conservées au-delà de ce traitement.
          </p>
          <p className="mt-3 max-w-[66ch] text-pretty">
            Pour exercer vos droits ou pour toute question relative à vos données personnelles,
            contactez la mairie à{" "}
            <a href="mailto:communedegrandrupt@orange.fr" className="text-primary">
              communedegrandrupt@orange.fr
            </a>
            .
          </p>
        </section>

        <section aria-labelledby="cookies">
          <h2 id="cookies" className="text-h3 mb-3">
            Cookies
          </h2>
          <p className="max-w-[66ch] text-pretty">
            Ce site n&apos;utilise pas de cookies de traçage ou de profilage. Aucun cookie tiers à
            des fins publicitaires n&apos;est déposé sur votre terminal.
          </p>
        </section>

        <section aria-labelledby="liens">
          <h2 id="liens" className="text-h3 mb-3">
            Liens hypertextes
          </h2>
          <p className="max-w-[66ch] text-pretty">
            La commune de Grandrupt décline toute responsabilité quant au contenu des sites externes
            vers lesquels des liens pourraient être établis depuis ce site.
          </p>
        </section>
      </div>
    </div>
  );
}
