import type { Metadata } from "next";
import PlaceholderPage from "@/components/public/PlaceholderPage";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <PlaceholderPage
      title="From peatlands to clay"
      description="Full bio and philosophy section - Sprint 7."
    />
  );
}
