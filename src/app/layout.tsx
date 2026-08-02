import type { Metadata, Viewport } from "next";
import { SITE_URL } from "@/lib/config";
import { fontVariables } from "@/lib/fonts";
import { DEFAULT_DESCRIPTION, SEO_KEYWORDS, SITE_NAME } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: SEO_KEYWORDS,
  robots: { index: true, follow: true },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_DE",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    // og:image / twitter:image come from app/opengraph-image.png + app/twitter-image.png
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
  },
  verification: {
    google: "googlea016b4b9cf83275b",
    other: {
      "p:domain_verify": "c39a7a27949c12065b83aa1e89310ea6",
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0A08",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={fontVariables}>{children}</body>
    </html>
  );
}
