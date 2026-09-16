"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { SHOP_URL } from "@/lib/config";

type NavLink =
  | { href: string; label: string; external?: false }
  | { href: string; label: string; external: true };

const COMPACT_NAV_MQ = "(max-width: 900px)";

function buildLinks(shopUrl: string): NavLink[] {
  return [
    { href: shopUrl, label: "Shop", external: true },
    { href: "/journal", label: "Process" },
    { href: "/about", label: "About" },
    { href: "/galleries", label: "Galleries" },
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

function padIndex(index: number) {
  return String(index + 1).padStart(2, "0");
}

export function Navigation({ shopUrl = SHOP_URL }: { shopUrl?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const links = useMemo(() => buildLinks(shopUrl), [shopUrl]);
  const menuId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef(true);

  const close = useCallback((restoreFocus = true) => {
    restoreFocusRef.current = restoreFocus;
    setOpen(false);
  }, []);

  useEffect(() => {
    restoreFocusRef.current = false;
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const mq = window.matchMedia(COMPACT_NAV_MQ);
    const onChange = (event: MediaQueryListEvent) => {
      if (!event.matches) close(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [close]);

  useEffect(() => {
    if (!open) return;

    const scrollY = window.scrollY;
    const html = document.documentElement;
    const { body } = document;
    html.classList.add("nav-lock");
    body.classList.add("nav-lock");
    body.style.top = `-${scrollY}px`;

    return () => {
      html.classList.remove("nav-lock");
      body.classList.remove("nav-lock");
      body.style.top = "";
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const toggle = toggleRef.current;
    const drawer = drawerRef.current;
    const getFocusable = () => {
      const drawerItems = drawer
        ? Array.from(
            drawer.querySelectorAll<HTMLElement>(
              'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
            ),
          ).filter((el) => !el.hasAttribute("disabled") && el.tabIndex !== -1)
        : [];
      return toggle ? [toggle, ...drawerItems] : drawerItems;
    };

    const firstLink = getFocusable().find((el) => el !== toggle);
    firstLink?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close(true);
        return;
      }
      if (event.key !== "Tab") return;
      const items = getFocusable();
      if (items.length === 0) return;
      const first = items[0]!;
      const last = items[items.length - 1]!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      if (restoreFocusRef.current) {
        toggle?.focus();
      }
    };
  }, [open, close]);

  return (
    <header id="site-nav" className={`site-nav${open ? " is-open" : ""}`}>
      <a href="#main-content" className="skip-to-content">
        Skip to content
      </a>

      <Link href="/" className="logo" onClick={() => close(false)}>
        Lelek Studio
      </Link>

      <nav className="nav-desktop" aria-label="Primary">
        <ul className="nav-links">
          {links.map((link) => {
            const active = isActive(pathname, link.href, link.external);
            return (
              <li key={`${link.label}-${link.href}`}>
                {link.external ? (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nav-shop"
                    aria-label={`${link.label} (opens in a new tab)`}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    href={link.href}
                    className={active ? "is-active" : undefined}
                    aria-current={active ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <button
        ref={toggleRef}
        type="button"
        className={`nav-toggle${open ? " is-open" : ""}`}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() =>
          setOpen((value) => {
            if (!value) restoreFocusRef.current = true;
            return !value;
          })
        }
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>

      <div
        className={`nav-backdrop${open ? " is-open" : ""}`}
        onClick={() => close(true)}
        aria-hidden="true"
      />

      <div
        ref={drawerRef}
        id={menuId}
        className={`nav-mobile${open ? " is-open" : ""}`}
        role="dialog"
        aria-modal={open}
        aria-label="Menu"
        aria-hidden={!open}
        inert={!open}
      >
        <nav aria-label="Primary">
          <p className="nav-mobile-kicker">Navigate</p>
          <ul className="nav-mobile-list">
            {links.map((link, index) => {
              const active = isActive(pathname, link.href, link.external);
              const content = (
                <>
                  <span className="nav-mobile-index">{padIndex(index)}</span>
                  <span className="nav-mobile-label">{link.label}</span>
                  {link.external ? (
                    <svg
                      className="nav-mobile-ext"
                      viewBox="0 0 12 12"
                      aria-hidden="true"
                    >
                      <path
                        d="M3.5 2.5h6v6M9.5 2.5 2.5 9.5"
                        strokeLinecap="square"
                        strokeLinejoin="miter"
                      />
                    </svg>
                  ) : null}
                </>
              );

              return (
                <li key={`${link.label}-${link.href}`}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="nav-shop"
                      aria-label={`${link.label} (opens in a new tab)`}
                      onClick={() => close(false)}
                    >
                      {content}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className={active ? "is-active" : undefined}
                      aria-current={active ? "page" : undefined}
                      onClick={() => close(false)}
                    >
                      {content}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
          <button
            type="button"
            className="nav-mobile-close"
            onClick={() => close(true)}
          >
            Close
          </button>
        </nav>
      </div>
    </header>
  );
}
