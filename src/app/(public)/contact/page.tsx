import type { Metadata } from "next";
import ContactForm from "./ContactForm";
import { SITE_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: "Contact",
  alternates: { canonical: `${SITE_URL}/contact` },
};

export default function ContactPage() {
  return <ContactForm />;
}
