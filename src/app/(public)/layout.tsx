import { Navigation } from "@/components/public/Navigation";
import { Footer } from "@/components/public/Footer";
import { getSiteSettings } from "@/lib/site";

export const revalidate = 60;

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <div className="grid-seams">
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
    </div>
  );
}
