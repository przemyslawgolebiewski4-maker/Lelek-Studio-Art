"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageSwitch } from "@/components/public/LanguageSwitch";
import type { Locale } from "@/lib/i18n/locale";

type PortfolioNavProps = {
  base: "" | "/portfolio";
  name: string;
  about: string;
  galleries: string;
  contact: string;
  locale: Locale;
};

function hrefFor(base: "" | "/portfolio", segment: "" | "about" | "galleries" | "contact") {
  if (!segment) return base || "/";
  return `${base}/${segment}`;
}

function isCurrent(pathname: string, segment: "" | "about" | "galleries" | "contact") {
  if (!segment) return pathname === "/" || pathname === "/portfolio";
  return (
    pathname === `/${segment}` ||
    pathname === `/portfolio/${segment}` ||
    pathname.startsWith(`/${segment}/`) ||
    pathname.startsWith(`/portfolio/${segment}/`)
  );
}

export function PortfolioNav({ base, name, about, galleries, contact, locale }: PortfolioNavProps) {
  const pathname = usePathname();
  const items = [
    { segment: "about" as const, label: about },
    { segment: "galleries" as const, label: galleries },
    { segment: "contact" as const, label: contact },
  ];

  return (
    <header className="portfolio-nav">
      <div className="portfolio-nav-inner">
        <Link href={hrefFor(base, "")} className="portfolio-wordmark">
          {name}
        </Link>
        <nav aria-label={name}>
          <ul className="portfolio-nav-links">
            {items.map((item) => {
              const current = isCurrent(pathname, item.segment);
              return (
                <li key={item.segment}>
                  <Link
                    href={hrefFor(base, item.segment)}
                    aria-current={current ? "page" : undefined}
                    className={current ? "is-current" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="portfolio-nav-lang">
          <LanguageSwitch locale={locale} />
        </div>
      </div>
    </header>
  );
}
