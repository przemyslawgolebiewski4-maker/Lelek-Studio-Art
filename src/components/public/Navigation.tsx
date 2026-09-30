"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LanguageSwitch } from "@/components/public/LanguageSwitch";
import { SHOP_URL } from "@/lib/config";
import { CREATOR_HOST, isAboutHref, studioHref } from "@/lib/links";
import { t } from "@/lib/i18n/messages";
import type { Locale } from "@/lib/i18n/locale";

type NavLink =
  | { href: string; label: string; external?: false }
  | { href: string; label: string; external: true };

function buildLinks(shopUrl: string, locale: Locale): NavLink[] {
  return [
    { href: shopUrl, label: t(locale, "nav.shop"), external: true },
    { href: studioHref("/journal"), label: t(locale, "nav.process") },
    { href: studioHref("/about"), label: t(locale, "nav.about") },
    { href: studioHref("/galleries"), label: t(locale, "nav.galleries") },
    { href: studioHref("/for-architects"), label: t(locale, "nav.trade") },
    { href: studioHref("/contact"), label: t(locale, "nav.contact") },
  ];
}

function hrefPathname(href: string): string {
  if (/^https?:\/\//i.test(href)) {
    try {
      return new URL(href).pathname || "/";
    } catch {
      return href;
    }
  }
  return href.split("#")[0]?.split("?")[0] || "/";
}

function isActive(pathname: string, href: string, external?: boolean, host = "") {
  if (external) return false;
  if (isAboutHref(href)) {
    const onCreator = host === CREATOR_HOST || host === `www.${CREATOR_HOST}`;
    if (onCreator) return pathname === "/" || pathname === "/about" || pathname.startsWith("/about/");
    return pathname === "/about" || pathname.startsWith("/about/");
  }
  const pathOnly = hrefPathname(href);
  if (pathOnly === "/") return pathname === "/";
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
  const [host, setHost] = useState("");
  const links = buildLinks(shopUrl, locale);

  useEffect(() => {
    setHost(window.location.hostname);
  }, []);

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
      <Link href={studioHref("/")} className="logo" onClick={() => setOpen(false)}>
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
                className={isActive(pathname, link.href, false, host) ? "is-active" : undefined}
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
              className={isActive(pathname, link.href, false, host) ? "is-active" : undefined}
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
