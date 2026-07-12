import { Navigation } from "@/components/public/Navigation";
import { Footer } from "@/components/public/Footer";
import { getSiteSettings } from "@/lib/site";

export const revalidate = 60;

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <>
      <Navigation etsyUrl={settings.etsy_url} />
      <main>{children}</main>
      <Footer
        siteName={settings.site_name}
        location={settings.location}
        instagram={settings.instagram}
        email={settings.email}
        etsyUrl={settings.etsy_url}
        artistUrl={settings.artist_url}
      />
    </>
  );
}
