"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const SHOP_URL =
  process.env.NEXT_PUBLIC_SHOP_URL?.trim() || "https://shop.lelekstudio.com";

type NavLink =
  | { href: string; label: string; external?: false }
  | { href: string; label: string; external: true };

const links: NavLink[] = [
  { href: SHOP_URL, label: "Shop", external: true },
  { href: "/journal", label: "Process" },
  { href: "/about", label: "About" },
  { href: "/for-architects", label: "Trade" },
  { href: "/contact", label: "Contact" },
];

function isActive(pathname: string, href: string, external?: boolean) {
  if (external) return false;
  if (href === "/") return pathname === "/";
  const pathOnly = href.split("#")[0];
  return pathname === pathOnly || pathname.startsWith(`${pathOnly}/`);
}

export function Navigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

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
              <a href={link.href}>{link.label}</a>
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
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
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
