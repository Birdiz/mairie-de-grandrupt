import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("accessibilite");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function AccessibilitePage() {
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

      <h1 className="text-foreground mb-2 font-serif text-3xl font-bold">Accessibilité</h1>
      <p className="text-muted-foreground mb-8">Déclaration d&apos;accessibilité — RGAA 4.1</p>

      <div className="prose-content text-foreground space-y-8">
        <section aria-labelledby="etat">
          <h2 id="etat" className="mb-3 text-xl font-semibold">
            État de conformité
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Le site <strong>grandrupt.fr</strong> est <strong>partiellement conforme</strong> avec
            le référentiel général d&apos;amélioration de l&apos;accessibilité (RGAA), version 4.1.
            Des efforts ont été mis en œuvre (navigation au clavier, contrastes, balises ARIA, lien
            d&apos;évitement) mais une conformité totale n&apos;a pas encore été auditée
            formellement.
          </p>
        </section>

        <section aria-labelledby="technologies">
          <h2 id="technologies" className="mb-3 text-xl font-semibold">
            Technologies utilisées
          </h2>
          <ul className="text-muted-foreground list-inside list-disc space-y-1">
            <li>HTML5</li>
            <li>CSS3</li>
            <li>JavaScript</li>
            <li>Next.js (React)</li>
          </ul>
        </section>

        <section aria-labelledby="mesures">
          <h2 id="mesures" className="mb-3 text-xl font-semibold">
            Mesures prises en faveur de l&apos;accessibilité
          </h2>
          <ul className="text-muted-foreground list-inside list-disc space-y-1">
            <li>Lien d&apos;évitement vers le contenu principal</li>
            <li>Navigation entièrement accessible au clavier</li>
            <li>Indicateurs de focus visibles</li>
            <li>
              Attributs <code>aria-label</code> et <code>aria-current</code> sur la navigation
            </li>
            <li>Contrastes de couleurs conformes aux critères WCAG AA</li>
            <li>Textes alternatifs sur les éléments non textuels</li>
            <li>Structure de titres hiérarchisée (h1 → h2 → h3)</li>
            <li>
              Langue de la page déclarée (<code>lang=&quot;fr&quot;</code>)
            </li>
          </ul>
        </section>

        <section aria-labelledby="retour">
          <h2 id="retour" className="mb-3 text-xl font-semibold">
            Retour d&apos;information et contact
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Si vous rencontrez un obstacle à l&apos;accessibilité qui vous empêche d&apos;accéder à
            un contenu ou à une fonctionnalité, vous pouvez nous le signaler par e-mail à{" "}
            <a
              href="mailto:communedegrandrupt@orange.fr"
              className="hover:text-foreground underline transition-colors"
            >
              communedegrandrupt@orange.fr
            </a>{" "}
            ou via le{" "}
            <Link href="/contact" className="hover:text-foreground underline transition-colors">
              formulaire de contact
            </Link>
            .
          </p>
          <p className="text-muted-foreground mt-3 leading-relaxed">
            Nous nous engageons à vous répondre dans un délai raisonnable et à trouver une
            alternative accessible si nécessaire.
          </p>
        </section>

        <section aria-labelledby="recours">
          <h2 id="recours" className="mb-3 text-xl font-semibold">
            Voie de recours
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Si vous constatez un défaut d&apos;accessibilité qui vous empêche d&apos;accéder à un
            contenu ou à une fonctionnalité du site, et que notre réponse ne vous satisfait pas,
            vous pouvez contacter le Défenseur des droits via{" "}
            <a
              href="https://www.defenseurdesdroits.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground underline transition-colors"
            >
              defenseurdesdroits.fr
            </a>
            .
          </p>
        </section>

        <section aria-labelledby="date">
          <h2 id="date" className="mb-3 text-xl font-semibold">
            Date de la déclaration
          </h2>
          <p className="text-muted-foreground">
            Cette déclaration a été établie le <strong>27 mars 2026</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}
