"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { apiPost } from "@/lib/api";

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/messages", label: "Messages" },
];

export function AdminNav({ adminName }: { adminName?: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await apiPost("/auth/logout", {});
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="border-b border-sand/20 bg-ink">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-metal">Lelek Studio</p>
          <p className="text-sm text-cream">Admin</p>
        </div>
        <nav className="flex flex-wrap items-center gap-4">
          {nav.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`font-mono text-[11px] uppercase tracking-[0.14em] ${
                  active ? "text-cream border-b border-rust pb-0.5" : "text-metal hover:text-cream"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-4">
          {adminName ? <span className="hidden text-sm text-sand sm:inline">{adminName}</span> : null}
          <button
            type="button"
            onClick={logout}
            className="font-mono text-[11px] uppercase tracking-[0.14em] text-metal hover:text-cream"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
