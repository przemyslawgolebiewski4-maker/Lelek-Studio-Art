import type { Metadata } from "next";
import { Navigation } from "@/components/public/Navigation";
import { Footer } from "@/components/public/Footer";
import { getSiteSettings } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.lelekstudio.com"),
  title: {
    default: "Lelek Studio Berlin",
    template: "%s | Lelek Studio Berlin",
  },
  description:
    "Handmade stoneware objects, vessels and wall pieces by ceramist Przemyslaw Golebiewski in Berlin.",
  robots: { index: true, follow: true },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let settings: Record<string, string> = {};
  try {
    settings = await getSiteSettings();
  } catch {
    // fallback defaults handled in Footer
  }

  return (
    <html lang="en">
      <body className="grid-seams antialiased">
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
      </body>
    </html>
  );
}
