"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminShell, AdminCard, AdminLinkButton } from "@/components/admin/AdminShell";
import { apiGet } from "@/lib/api";

export default function AdminDashboardPage() {
  const [productCount, setProductCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [journalCount, setJournalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [productsRes, messagesRes, unreadRes, journalRes] = await Promise.all([
        apiGet("/admin/products"),
        apiGet("/admin/messages"),
        apiGet("/admin/messages?filter=unread"),
        apiGet("/admin/journal"),
      ]);
      const productsData = productsRes.ok ? await productsRes.json() : { products: [] };
      const messagesData = messagesRes.ok ? await messagesRes.json() : { messages: [] };
      const unreadData = unreadRes.ok ? await unreadRes.json() : { messages: [] };
      const journalData = journalRes.ok ? await journalRes.json() : { posts: [] };
      setProductCount(productsData.products?.length ?? 0);
      setMessageCount(messagesData.messages?.length ?? 0);
      setUnreadCount(unreadData.messages?.length ?? 0);
      setJournalCount(journalData.posts?.length ?? 0);
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
          <AdminLinkButton href="/admin/journal/new" variant="ghost">
            New journal post
          </AdminLinkButton>
        </>
      }
    >
      {loading ? <p className="text-metal">Loading...</p> : null}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminCard>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-metal">Products</p>
          <p className="mt-2 font-serif text-4xl text-cream">{productCount}</p>
          <Link href="/admin/products" className="mt-4 inline-block font-mono text-[10px] uppercase tracking-[0.14em] text-rust-light hover:text-cream">
            Manage →
          </Link>
        </AdminCard>
        <AdminCard>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-metal">Journal</p>
          <p className="mt-2 font-serif text-4xl text-cream">{journalCount}</p>
          <Link href="/admin/journal" className="mt-4 inline-block font-mono text-[10px] uppercase tracking-[0.14em] text-rust-light hover:text-cream">
            Manage →
          </Link>
        </AdminCard>
        <AdminCard>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-metal">Messages</p>
          <p className="mt-2 font-serif text-4xl text-cream">{messageCount}</p>
          <Link href="/admin/messages" className="mt-4 inline-block font-mono text-[10px] uppercase tracking-[0.14em] text-rust-light hover:text-cream">
            Inbox →
          </Link>
        </AdminCard>
        <AdminCard>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-metal">Unread</p>
          <p className="mt-2 font-serif text-4xl text-rust-light">{unreadCount}</p>
        </AdminCard>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <AdminCard>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-metal">Content</p>
          <p className="mt-2 text-sm text-sand">Edit homepage sections, about story, architects block and journal teaser.</p>
          <Link href="/admin/home" className="btn-text mt-4 inline-block text-rust-light hover:text-cream">
            Home sections →
          </Link>
        </AdminCard>
        <AdminCard>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-metal">Site settings</p>
          <p className="mt-2 text-sm text-sand">Site name, tagline, email, Etsy and Instagram links.</p>
          <Link href="/admin/settings" className="btn-text mt-4 inline-block text-rust-light hover:text-cream">
            Settings →
          </Link>
        </AdminCard>
      </div>
    </AdminShell>
  );
}
