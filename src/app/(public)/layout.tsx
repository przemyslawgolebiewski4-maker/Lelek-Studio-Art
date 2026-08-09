import { Navigation } from "@/components/public/Navigation";
import { Footer } from "@/components/public/Footer";
import { getSiteSettings } from "@/lib/site";
import { serverFetch } from "@/lib/api-server";
import { resolveShopUrl } from "@/lib/config";
import type { FindSection } from "@/types/content";

export const revalidate = 60;

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [settings, find] = await Promise.all([
    getSiteSettings(),
    serverFetch<FindSection>("/sections/find", { fallback: {} }),
  ]);
  const shopUrl = resolveShopUrl(settings);

  return (
    <>
      <Navigation shopUrl={shopUrl} />
      <main>{children}</main>
      <Footer
        siteName={settings.site_name}
        location={settings.location}
        instagram={settings.instagram}
        email={settings.email}
        shopUrl={shopUrl}
        lelekMeaning={find.lelekMeaning}
      />
    </>
  );
}
