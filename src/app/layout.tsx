import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { GoogleTag } from "@/components/analytics/GoogleTag";
import { CookieBanner } from "@/components/public/CookieBanner";
import { SITE_URL } from "@/lib/config";
import { CONSENT_BOOTSTRAP_SCRIPT } from "@/lib/consent";
import { fontVariables } from "@/lib/fonts";
import { CREATOR_NAME, resolveSiteDescription } from "@/lib/brand";
import {
  DEFAULT_OG_IMAGE_ALT,
  DEFAULT_OG_IMAGE_URL,
  SEO_KEYWORDS,
  resolveSiteName,
} from "@/lib/seo";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { getLocale } from "@/lib/i18n/get-locale";
import { localeText } from "@/lib/i18n/present";
import { getSiteSettings } from "@/lib/site";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const [settings, locale] = await Promise.all([getSiteSettings(), getLocale()]);
  const siteName = resolveSiteName(settings);
  const description = localeText(
    locale,
    resolveSiteDescription(settings.description),
    settings.description_pl,
  );

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description,
    keywords: SEO_KEYWORDS,
    authors: [{ name: CREATOR_NAME, url: `${SITE_URL}/about` }],
    creator: CREATOR_NAME,
    publisher: siteName,
    robots: { index: true, follow: true },
    alternates: {
      canonical: SITE_URL,
    },
    openGraph: {
      type: "website",
      locale: locale === "pl" ? "pl_PL" : "en_DE",
      url: SITE_URL,
      siteName,
      title: siteName,
      description,
      images: [{ url: DEFAULT_OG_IMAGE_URL, alt: DEFAULT_OG_IMAGE_ALT }],
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description,
      images: [DEFAULT_OG_IMAGE_URL],
    },
    verification: {
      google: "googlea016b4b9cf83275b",
      other: {
        "p:domain_verify": "c39a7a27949c12065b83aa1e89310ea6",
      },
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#0B0A08",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  return (
    <html lang={locale}>
      <head>
        <meta
          name="facebook-domain-verification"
          content="i1pgkcadze0s7rjqgxba3ptwu0brnm"
        />
      </head>
      <body className={fontVariables}>
        <Script id="lelek-consent-default" strategy="beforeInteractive">
          {CONSENT_BOOTSTRAP_SCRIPT}
        </Script>
        <LocaleProvider locale={locale}>
          {children}
          <GoogleTag />
          <CookieBanner />
          <Analytics />
        </LocaleProvider>
      </body>
    </html>
  );
}
