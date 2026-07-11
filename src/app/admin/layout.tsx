import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-ink text-cream">
      {session ? <AdminNav adminName={session.name} /> : null}
      {children}
    </div>
  );
}
