import type { Metadata } from "next";
import { Navigation } from "@/components/public/Navigation";
import { Footer } from "@/components/public/Footer";
import { getSiteSettings } from "@/lib/site";

export const metadata: Metadata = {
  title: "Lelek Studio Berlin - Shaped by hand, guided by instinct",
  description:
    "Handmade stoneware objects, vessels and wall pieces by ceramist Przemyslaw Golebiewski in Berlin.",
};

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  let settings: Record<string, string> = {};
  try {
    settings = await getSiteSettings();
  } catch {
    // fallback defaults handled in Footer
  }

  return (
    <>
      <Navigation />
      <main>{children}</main>
      <Footer
        siteName={settings.site_name}
        instagram={settings.instagram}
        instagramHandle={settings.instagram_handle}
        email={settings.email}
        etsyUrl={settings.etsy_url}
        artistUrl={settings.artist_url}
      />
    </>
  );
}
