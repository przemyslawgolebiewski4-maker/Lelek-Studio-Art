"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  { href: "/collections", label: "Works" },
  { href: "/about", label: "Story" },
  { href: "/journal", label: "Journal" },
  { href: "/for-architects", label: "For Architects" },
  { href: "/contact", label: "Contact" },
];

type NavigationProps = {
  instagram?: string;
  instagramHandle?: string;
};

export function Navigation({
  instagram = "https://www.instagram.com/lelek.studio.berlin/",
  instagramHandle = "@lelek.studio.berlin",
}: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      const nav = document.getElementById("site-nav");
      if (nav && !nav.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const linkClass =
    "text-[11px] uppercase tracking-[0.2em] text-earth opacity-55 transition-opacity hover:opacity-100";

  return (
    <header
      id="site-nav"
      className={`fixed top-0 left-0 right-0 z-[200] transition-all duration-300 ${
        scrolled || open
          ? "border-b border-[var(--border)] bg-[rgba(250,246,241,0.94)] backdrop-blur-[16px]"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="container flex items-center justify-between gap-6 py-5 md:py-6 [&.scrolled]:md:py-3.5">
        <Link
          href="/"
          className="font-display text-[17px] tracking-wide text-earth"
          onClick={() => setOpen(false)}
        >
          Lelek <em className="italic text-terra">Studio</em>
        </Link>

        <button
          type="button"
          className="flex flex-col gap-1.5 p-1 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="block h-px w-[22px] bg-earth" />
          <span className="block h-px w-[22px] bg-earth" />
          <span className="block h-px w-[22px] bg-earth" />
        </button>

        <div
          className={
            open
              ? "fixed inset-0 top-0 flex flex-col items-center justify-center gap-10 bg-[rgba(250,246,241,0.98)] px-6 py-20 md:static md:flex md:flex-row md:bg-transparent md:py-0"
              : "hidden md:flex md:flex-row md:items-center md:gap-8"
          }
        >
          <ul className="flex flex-col items-center gap-6 md:flex-row md:gap-7">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClass} onClick={() => setOpen(false)}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] uppercase tracking-[0.15em] text-terra opacity-85 transition-opacity hover:opacity-100"
            onClick={() => setOpen(false)}
          >
            {instagramHandle}
          </Link>
        </div>
      </nav>
    </header>
  );
}
