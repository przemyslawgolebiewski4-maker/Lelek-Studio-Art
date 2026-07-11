import type { Metadata } from "next";
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
