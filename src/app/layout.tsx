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
import { getSiteSettings } from "@/lib/site";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const siteName = resolveSiteName(settings);
  const description = resolveSiteDescription(settings.description);

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
      locale: "en_DE",
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={fontVariables}>
        <Script id="lelek-consent-default" strategy="beforeInteractive">
          {CONSENT_BOOTSTRAP_SCRIPT}
        </Script>
        {children}
        <GoogleTag />
        <CookieBanner />
        <Analytics />
      </body>
    </html>
  );
}
