import type { Metadata } from "next";
import PlaceholderPage from "@/components/public/PlaceholderPage";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <PlaceholderPage
      title="Say something honest"
      description="Contact forms and message threads - Sprint 7."
    />
  );
}
