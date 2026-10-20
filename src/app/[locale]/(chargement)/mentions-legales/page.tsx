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
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground text-sm transition-colors"
        >
          ← Accueil
        </Link>
      </div>

      <h1 className="text-foreground mb-8 font-serif text-3xl font-bold">Mentions légales</h1>

      <div className="prose-content text-foreground space-y-8">
        <section aria-labelledby="editeur">
          <h2 id="editeur" className="mb-3 text-xl font-semibold">
            Éditeur du site
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Le présent site est édité par la <strong>commune de Grandrupt</strong> (88210), Vosges,
            France.
          </p>
          <ul className="text-muted-foreground mt-3 space-y-1">
            <li>
              <strong>Adresse :</strong> 8 rue de la Mairie, 88210 Grandrupt
            </li>
            <li>
              <strong>Téléphone :</strong> 03 29 41 03 74
            </li>
            <li>
              <strong>E-mail :</strong>{" "}
              <a
                href="mailto:communedegrandrupt@orange.fr"
                className="hover:text-foreground underline transition-colors"
              >
                communedegrandrupt@orange.fr
              </a>
            </li>
            <li>
              <strong>Responsable de la publication :</strong> Le Maire de Grandrupt
            </li>
          </ul>
        </section>

        <section aria-labelledby="hebergeur">
          <h2 id="hebergeur" className="mb-3 text-xl font-semibold">
            Hébergeur
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Ce site est hébergé par un prestataire tiers. Pour toute question relative à
            l&apos;hébergement, veuillez contacter la mairie.
          </p>
        </section>

        <section aria-labelledby="propriete">
          <h2 id="propriete" className="mb-3 text-xl font-semibold">
            Propriété intellectuelle
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            L&apos;ensemble du contenu de ce site (textes, images, graphismes) est la propriété de
            Grandrupt ou de ses partenaires. Toute reproduction, représentation ou diffusion,
            intégrale ou partielle, est interdite sans l&apos;autorisation écrite préalable de la
            commune.
          </p>
        </section>

        <section aria-labelledby="donnees">
          <h2 id="donnees" className="mb-3 text-xl font-semibold">
            Données personnelles
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Conformément au Règlement Général sur la Protection des Données (RGPD — Règlement UE
            2016/679) et à la loi Informatique et Libertés du 6 janvier 1978 modifiée, vous disposez
            d&apos;un droit d&apos;accès, de rectification et de suppression des données vous
            concernant.
          </p>
          <p className="text-muted-foreground mt-3 leading-relaxed">
            Les données collectées via le formulaire de contact (nom, adresse e-mail, sujet et
            message) sont utilisées uniquement pour répondre à votre demande et ne sont pas
            conservées au-delà de ce traitement.
          </p>
          <p className="text-muted-foreground mt-3 leading-relaxed">
            Pour exercer vos droits ou pour toute question relative à vos données personnelles,
            contactez la mairie à{" "}
            <a
              href="mailto:communedegrandrupt@orange.fr"
              className="hover:text-foreground underline transition-colors"
            >
              communedegrandrupt@orange.fr
            </a>
            .
          </p>
        </section>

        <section aria-labelledby="cookies">
          <h2 id="cookies" className="mb-3 text-xl font-semibold">
            Cookies
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Ce site n&apos;utilise pas de cookies de traçage ou de profilage. Aucun cookie tiers à
            des fins publicitaires n&apos;est déposé sur votre terminal.
          </p>
        </section>

        <section aria-labelledby="liens">
          <h2 id="liens" className="mb-3 text-xl font-semibold">
            Liens hypertextes
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            La commune de Grandrupt décline toute responsabilité quant au contenu des sites externes
            vers lesquels des liens pourraient être établis depuis ce site.
          </p>
        </section>
      </div>
    </div>
  );
}
