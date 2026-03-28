import { useTranslations } from "next-intl";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { ContactForm } from "@/components/sections/ContactForm";

export function ContactContentSection() {
  const t = useTranslations("contact");

  return (
    <section className="bg-background py-24" aria-labelledby="contact-form-title">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
          {/* Colonne info (2/5) */}
          <FadeIn className="lg:col-span-2">
            <div className="bg-secondary h-full space-y-8 rounded-2xl p-8">
              <h2 className="font-heading text-foreground text-2xl">{t("address.title")}</h2>

              {/* Adresse */}
              <div className="flex gap-4">
                <MapPin size={20} className="text-primary mt-0.5 shrink-0" aria-hidden="true" />
                <address className="text-muted-foreground font-sans text-sm leading-relaxed not-italic">
                  <p className="text-foreground font-semibold">{t("address.mairie")}</p>
                  <p>{t("address.street")}</p>
                  <p>{t("address.city")}</p>
                </address>
              </div>

              {/* Téléphone */}
              <div className="flex gap-4">
                <Phone size={20} className="text-primary mt-0.5 shrink-0" aria-hidden="true" />
                <div className="font-sans text-sm">
                  <p className="text-foreground font-semibold">{t("address.phone")}</p>
                  <a
                    href={`tel:${t("address.phoneNumber").replace(/\s/g, "")}`}
                    className="text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
                  >
                    {t("address.phoneNumber")}
                  </a>
                </div>
              </div>

              {/* E-mail */}
              <div className="flex gap-4">
                <Mail size={20} className="text-primary mt-0.5 shrink-0" aria-hidden="true" />
                <div className="font-sans text-sm">
                  <p className="text-foreground font-semibold">{t("address.email")}</p>
                  <a
                    href={`mailto:${t("address.emailAddress")}`}
                    className="text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded-sm break-all transition-colors focus-visible:ring-2 focus-visible:outline-none"
                  >
                    {t("address.emailAddress")}
                  </a>
                </div>
              </div>

              {/* Horaires */}
              <div className="flex gap-4">
                <Clock size={20} className="text-primary mt-0.5 shrink-0" aria-hidden="true" />
                <div className="font-sans text-sm">
                  <p className="text-foreground font-semibold">{t("address.hours")}</p>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {t("address.hoursDetail")}
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Colonne formulaire (3/5) */}
          <FadeIn delay="delay-150" className="lg:col-span-3">
            <h2 id="contact-form-title" className="font-heading text-foreground mb-8 text-3xl">
              {t("form.title")}
            </h2>
            <ContactForm />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
