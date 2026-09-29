import type { Metadata } from "next";
import ContactForm from "./ContactForm";
import { SITE_URL } from "@/lib/config";
import { CONTACT_DEFAULTS } from "@/lib/legal";
import { getLocale } from "@/lib/i18n/get-locale";
import { t } from "@/lib/i18n/messages";
import { localeText } from "@/lib/i18n/present";
import { getSiteSettings } from "@/lib/site";

const CONTACT_DESCRIPTION =
  "Write to Przemysław Gołębiewski at LELEK in Berlin - commissions, interior projects, or a piece for the home.";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: t(locale, "meta.contact"),
    description: localeText(locale, CONTACT_DESCRIPTION),
    alternates: { canonical: `${SITE_URL}/contact` },
  };
}

export const revalidate = 60;

export default async function ContactPage() {
  const [settings, locale] = await Promise.all([getSiteSettings(), getLocale()]);
  return (
    <ContactForm
      copy={{
        headingLine1: localeText(
          locale,
          settings.contact_heading_1 || CONTACT_DEFAULTS.heading1,
          settings.contact_heading_1_pl,
        ),
        headingLine2: localeText(
          locale,
          settings.contact_heading_2 || CONTACT_DEFAULTS.heading2,
          settings.contact_heading_2_pl,
        ),
        headingLine3: localeText(
          locale,
          settings.contact_heading_3 || CONTACT_DEFAULTS.heading3,
          settings.contact_heading_3_pl,
        ),
        sub: localeText(locale, settings.contact_sub || CONTACT_DEFAULTS.sub, settings.contact_sub_pl),
        successMessage: localeText(
          locale,
          settings.contact_success || CONTACT_DEFAULTS.success,
          settings.contact_success_pl,
        ),
        formNote: localeText(
          locale,
          settings.contact_form_note || CONTACT_DEFAULTS.formNote,
          settings.contact_form_note_pl,
        ),
      }}
    />
  );
}
