"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SHOP_URL } from "@/lib/config";

type NavLink =
  | { href: string; label: string; external?: false }
  | { href: string; label: string; external: true };

function buildLinks(shopUrl: string): NavLink[] {
  return [
    { href: shopUrl, label: "Shop", external: true },
    { href: "/journal", label: "Process" },
    { href: "/about", label: "About" },
    { href: "/for-architects", label: "Trade" },
    { href: "/contact", label: "Contact" },
  ];
}

function isActive(pathname: string, href: string, external?: boolean) {
  if (external) return false;
  if (href === "/") return pathname === "/";
  const pathOnly = href.split("#")[0];
  return pathname === pathOnly || pathname.startsWith(`${pathOnly}/`);
}

export function Navigation({ shopUrl = SHOP_URL }: { shopUrl?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const links = buildLinks(shopUrl);

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

      <button
        type="button"
        className="nav-toggle"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span />
        <span />
        <span />
      </button>

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
