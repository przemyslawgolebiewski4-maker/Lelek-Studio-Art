"use client";

import { useEffect, useState } from "react";
import { AdminShell, AdminCard, AdminLinkButton } from "@/components/admin/AdminShell";
import { apiGet } from "@/lib/api";

export default function AdminDashboardPage() {
  const [productCount, setProductCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [productsRes, messagesRes, unreadRes] = await Promise.all([
        apiGet("/admin/products"),
        apiGet("/admin/messages"),
        apiGet("/admin/messages?filter=unread"),
      ]);
      const productsData = productsRes.ok ? await productsRes.json() : { products: [] };
      const messagesData = messagesRes.ok ? await messagesRes.json() : { messages: [] };
      const unreadData = unreadRes.ok ? await unreadRes.json() : { messages: [] };
      setProductCount(productsData.products?.length ?? 0);
      setMessageCount(messagesData.messages?.length ?? 0);
      setUnreadCount(unreadData.messages?.length ?? 0);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <AdminShell
      title="Dashboard"
      subtitle="Overview of your studio site"
      actions={
        <>
          <AdminLinkButton href="/admin/products/new" variant="primary">
            New product
          </AdminLinkButton>
          <AdminLinkButton href="/admin/messages" variant="ghost">
            View messages
          </AdminLinkButton>
        </>
      }
    >
      {loading ? <p className="text-metal">Loading...</p> : null}
      <div className="grid gap-4 sm:grid-cols-3">
        <AdminCard>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-metal">Products</p>
          <p className="mt-2 font-serif text-4xl text-cream">{productCount}</p>
        </AdminCard>
        <AdminCard>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-metal">Messages</p>
          <p className="mt-2 font-serif text-4xl text-cream">{messageCount}</p>
        </AdminCard>
        <AdminCard>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-metal">Unread</p>
          <p className="mt-2 font-serif text-4xl text-rust-light">{unreadCount}</p>
        </AdminCard>
      </div>
    </AdminShell>
  );
}
