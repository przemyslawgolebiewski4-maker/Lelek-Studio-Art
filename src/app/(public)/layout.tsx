import { Navigation } from "@/components/public/Navigation";
import { Footer } from "@/components/public/Footer";
import { getSiteSettings } from "@/lib/site";
import { serverFetch } from "@/lib/api-server";
import { resolveShopUrl, resolveInstagramUrl } from "@/lib/config";
import { getLocale } from "@/lib/i18n/get-locale";
import { localeText, presentFind } from "@/lib/i18n/present";
import { t } from "@/lib/i18n/messages";
import type { FindSection } from "@/types/content";

export const revalidate = 60;

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [settings, find, locale] = await Promise.all([
    getSiteSettings(),
    serverFetch<FindSection>("/sections/find", { fallback: {} }),
    getLocale(),
  ]);
  const shopUrl = resolveShopUrl(settings);
  const findView = presentFind(find, find as unknown as Record<string, unknown>, locale);

  return (
    <>
      <Navigation shopUrl={shopUrl} locale={locale} />
      <main>{children}</main>
      <Footer
        locale={locale}
        siteName={settings.site_name}
        location={localeText(locale, settings.location, settings.location_pl)}
        instagram={resolveInstagramUrl(settings.instagram)}
        email={settings.email}
        shopUrl={shopUrl}
        lelekMeaning={
          findView.lelekMeaning?.trim() ||
          localeText(locale, "The hand moves, the mind follows after.")
        }
        labels={{
          contact: t(locale, "footer.contact"),
          about: t(locale, "footer.about"),
          impressum: t(locale, "footer.impressum"),
          withdrawal: t(locale, "footer.withdrawal"),
          privacy: t(locale, "footer.privacy"),
          cookies: t(locale, "footer.cookies"),
          shop: t(locale, "nav.shop"),
        }}
      />
    </>
  );
}
