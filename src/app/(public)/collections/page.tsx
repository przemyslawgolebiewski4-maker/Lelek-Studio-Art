import type { Metadata } from "next";
import PlaceholderPage from "@/components/public/PlaceholderPage";

export const metadata: Metadata = { title: "Collections" };

export default function CollectionsPage() {
  return (
    <PlaceholderPage
      title="Objects shaped by hand and time"
      description="Full collections grid arrives in Sprint 6. Products are already stored in MongoDB."
    />
  );
}
