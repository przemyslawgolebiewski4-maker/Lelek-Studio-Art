"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  { href: "/about", label: "Story" },
  { href: "/collections", label: "Works" },
  { href: "/journal", label: "Journal" },
  { href: "/for-architects", label: "Architects" },
  { href: "/contact", label: "Contact" },
];

type NavigationProps = {
  etsyUrl?: string;
};

export function Navigation({
  etsyUrl = "https://www.etsy.com/shop/LelekStudio",
}: NavigationProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header id="site-nav" className="site-nav">
      <Link href="/" className="logo" onClick={() => setOpen(false)}>
        Lelek Studio
      </Link>

      <ul className="nav-links">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href}>{link.label}</Link>
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

      <Link
        href={etsyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="nav-shop"
        onClick={() => setOpen(false)}
      >
        Shop — Etsy ↗
      </Link>

      <div className={`nav-mobile ${open ? "open" : ""}`}>
        {links.map((link) => (
          <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
            {link.label}
          </Link>
        ))}
        <Link
          href={etsyUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setOpen(false)}
        >
          Shop — Etsy ↗
        </Link>
      </div>
    </header>
  );
}
