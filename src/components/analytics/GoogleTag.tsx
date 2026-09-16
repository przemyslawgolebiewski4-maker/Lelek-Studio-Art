"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { GA_ID, GA_LINKER_DOMAINS } from "@/lib/consent";

export function GoogleTag() {
  const pathname = usePathname();
  if (!GA_ID || pathname.startsWith("/admin")) return null;

  const domains = JSON.stringify([...GA_LINKER_DOMAINS]);

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="lelek-gtag-config" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            anonymize_ip: true,
            linker: { domains: ${domains} }
          });
        `}
      </Script>
    </>
  );
}
