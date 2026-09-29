"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LanguageSwitch } from "@/components/public/LanguageSwitch";
import { SHOP_URL } from "@/lib/config";
import { t } from "@/lib/i18n/messages";
import type { Locale } from "@/lib/i18n/locale";

type NavLink =
  | { href: string; label: string; external?: false }
  | { href: string; label: string; external: true };

function buildLinks(shopUrl: string, locale: Locale): NavLink[] {
  return [
    { href: shopUrl, label: t(locale, "nav.shop"), external: true },
    { href: "/journal", label: t(locale, "nav.process") },
    { href: "/about", label: t(locale, "nav.about") },
    { href: "/galleries", label: t(locale, "nav.galleries") },
    { href: "/for-architects", label: t(locale, "nav.trade") },
    { href: "/contact", label: t(locale, "nav.contact") },
  ];
}

function isActive(pathname: string, href: string, external?: boolean) {
  if (external) return false;
  if (href === "/") return pathname === "/";
  const pathOnly = href.split("#")[0];
  return pathname === pathOnly || pathname.startsWith(`${pathOnly}/`);
}

export function Navigation({
  shopUrl = SHOP_URL,
  locale = "en",
}: {
  shopUrl?: string;
  locale?: Locale;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const links = buildLinks(shopUrl, locale);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header id="site-nav" className="site-nav">
      <Link href="/" className="logo" onClick={() => setOpen(false)}>
        Lelek Studio
      </Link>

      <ul className="nav-links">
        {links.map((link) => (
          <li key={link.href}>
            {link.external ? (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="nav-shop"
              >
                {link.label}
              </a>
            ) : (
              <Link
                href={link.href}
                className={isActive(pathname, link.href) ? "is-active" : undefined}
              >
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>

      <div className="nav-tools">
        <LanguageSwitch locale={locale} />
        <button
          type="button"
          className="nav-toggle"
          aria-label={open ? t(locale, "nav.close") : t(locale, "nav.open")}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div className={`nav-mobile ${open ? "open" : ""}`}>
        {links.map((link) =>
          link.external ? (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-shop"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ) : (
            <Link
              key={link.href}
              href={link.href}
              className={isActive(pathname, link.href) ? "is-active" : undefined}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ),
        )}
      </div>
    </header>
  );
}
