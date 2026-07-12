import type { Metadata, Viewport } from "next";
import { SITE_URL } from "@/lib/config";
import { fontVariables } from "@/lib/fonts";
import { DEFAULT_DESCRIPTION, DEFAULT_OG_IMAGE, SEO_KEYWORDS, SITE_NAME } from "@/lib/seo";
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
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  verification: {
    google: "googlea016b4b9cf83275b",
  },
};

export const viewport: Viewport = {
  themeColor: "#E6D8C7",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${fontVariables} antialiased`}>{children}</body>
    </html>
  );
}
