import type { Metadata } from "next";
import { getAdminSession } from "@/lib/session";
import { AdminNav } from "@/components/admin/AdminNav";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();

  return (
    <div className="min-h-screen bg-ink text-cream">
      {session ? <AdminNav adminName={session.name} /> : null}
      {children}
    </div>
  );
}
