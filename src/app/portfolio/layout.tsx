import type { Viewport } from "next";
import { headers } from "next/headers";
import { PortfolioFooter } from "@/components/portfolio/PortfolioFooter";
import { PortfolioNav } from "@/components/portfolio/PortfolioNav";
import { resolveInstagramUrl, resolveShopUrl } from "@/lib/config";
import { getLocale } from "@/lib/i18n/get-locale";
import { t } from "@/lib/i18n/messages";
import { localeText, presentFind } from "@/lib/i18n/present";
import { CREATOR_HOST, hostnameOf } from "@/lib/links";
import { getPortfolio } from "@/lib/portfolio";
import { getSiteSettings } from "@/lib/site";
import { serverFetch } from "@/lib/api-server";
import type { FindSection } from "@/types/content";
import "./portfolio.css";

export const revalidate = 60;

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default async function PortfolioLayout({ children }: { children: React.ReactNode }) {
  const headerList = await headers();
  const onCreator = hostnameOf(headerList.get("host")) === CREATOR_HOST;
  const base = onCreator ? "" : "/portfolio";

  const locale = await getLocale();
  const [content, settings, find] = await Promise.all([
    getPortfolio(locale),
    getSiteSettings(),
    serverFetch<FindSection>("/sections/find", { fallback: {} as FindSection }),
  ]);

  const findView = presentFind(find, find as unknown as Record<string, unknown>, locale);
  const shopUrl = resolveShopUrl(settings);

  return (
    <div className="portfolio">
      <PortfolioNav
        base={base}
        name={content.name}
        about={content.navAbout}
        galleries={content.navGalleries}
        contact={content.navContact}
        locale={locale}
      />
      <main>{children}</main>
      <PortfolioFooter
        siteName={settings.site_name || "Lelek Studio"}
        location={localeText(locale, settings.location || "Berlin", settings.location_pl)}
        email={settings.email || "lelekstudio@lelekstudio.com"}
        instagram={resolveInstagramUrl(settings.instagram)}
        shopUrl={shopUrl}
        lelekMeaning={
          findView.lelekMeaning?.trim() || localeText(locale, "The hand moves, the mind follows after.")
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
    </div>
  );
}
