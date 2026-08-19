"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { apiPost } from "@/lib/api";

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/popups", label: "Pop-ups" },
  { href: "/admin/journal", label: "Journal" },
  { href: "/admin/home", label: "Home" },
  { href: "/admin/settings", label: "Settings" },
  { href: "/admin/messages", label: "Messages" },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname.startsWith(href);
}

export function AdminNav({ adminName }: { adminName?: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await Promise.all([
      apiPost("/auth/logout", {}),
      fetch("/api/auth/session", { method: "DELETE", credentials: "include" }),
    ]);
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="admin-nav">
      <div className="admin-nav-inner">
        <Link href="/admin" className="admin-nav-brand">
          Lelek Studio
          <span>Admin</span>
        </Link>

        <ul className="admin-nav-links">
          {nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={isActive(pathname, item.href) ? "is-active" : undefined}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="admin-nav-meta">
          {adminName ? <span className="admin-nav-user">{adminName}</span> : null}
          <button type="button" onClick={logout} className="admin-nav-logout">
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
