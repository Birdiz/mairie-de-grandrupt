import { useTranslations } from "next-intl";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/sections/ContactForm";
import { telHref } from "@/lib/phone";

export function ContactContentSection() {
  const t = useTranslations("contact");

  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-4 pb-16 sm:px-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-16 lg:px-8">
      {/* Coordonnées */}
      <section
        aria-labelledby="contact-address-title"
        className="border-brand-marine bg-card flex flex-col gap-7 self-start border-t-[3px] p-6 md:p-8"
      >
        <h2 id="contact-address-title" className="text-h3">
          {t("address.title")}
        </h2>

        <div className="flex gap-4">
          <MapPin size={22} className="text-brand-sapin mt-1 shrink-0" aria-hidden="true" />
          <address className="not-italic">
            <p className="font-semibold">{t("address.mairie")}</p>
            <p>{t("address.street")}</p>
            <p>{t("address.city")}</p>
          </address>
        </div>

        <div className="flex gap-4">
          <Phone size={22} className="text-brand-sapin mt-1 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-semibold">{t("address.phone")}</p>
            <a href={telHref(t("address.phoneNumber"))} className="text-primary font-semibold">
              {t("address.phoneNumber")}
            </a>
          </div>
        </div>

        <div className="flex gap-4">
          <Mail size={22} className="text-brand-sapin mt-1 shrink-0" aria-hidden="true" />
          <div className="min-w-0">
            <p className="font-semibold">{t("address.email")}</p>
            <a
              href={`mailto:${t("address.emailAddress")}`}
              className="text-primary font-semibold break-all"
            >
              {t("address.emailAddress")}
            </a>
          </div>
        </div>

        <div className="flex gap-4">
          <Clock size={22} className="text-brand-sapin mt-1 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-semibold">{t("address.hours")}</p>
            <p className="whitespace-pre-line">{t("address.hoursDetail")}</p>
          </div>
        </div>
      </section>

      {/* Formulaire */}
      <section aria-labelledby="contact-form-title" className="flex flex-col gap-6">
        <h2 id="contact-form-title" className="text-h2">
          {t("form.title")}
        </h2>
        <ContactForm />
      </section>
    </div>
  );
}
