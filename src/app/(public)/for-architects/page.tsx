import type { Metadata } from "next";
import PlaceholderPage from "@/components/public/PlaceholderPage";

export const metadata: Metadata = { title: "For Architects" };

export default function ForArchitectsPage() {
  return (
    <PlaceholderPage
      title="Objects for contemporary interiors"
      description="B2B inquiry form and project gallery - Sprint 7."
    />
  );
}
