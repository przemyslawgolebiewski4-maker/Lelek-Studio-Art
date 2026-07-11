import type { Metadata } from "next";
import PlaceholderPage from "@/components/public/PlaceholderPage";

export const metadata: Metadata = { title: "Journal" };

export default function JournalPage() {
  return (
    <PlaceholderPage
      title="Stories from the studio"
      description="Journal listing and markdown posts - Sprint 5-7."
    />
  );
}
