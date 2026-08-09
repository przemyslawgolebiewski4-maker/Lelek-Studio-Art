import type { Metadata } from "next";
import ContactForm from "./ContactForm";
import { SITE_URL } from "@/lib/config";
import { getSiteSettings } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  alternates: { canonical: `${SITE_URL}/contact` },
};

export const revalidate = 60;

export default async function ContactPage() {
  const settings = await getSiteSettings();
  return (
    <ContactForm
      copy={{
        headingLine1: settings.contact_heading_1,
        headingLine2: settings.contact_heading_2,
        headingLine3: settings.contact_heading_3,
        sub: settings.contact_sub,
        successMessage: settings.contact_success,
        formNote: settings.contact_form_note,
      }}
    />
  );
}
