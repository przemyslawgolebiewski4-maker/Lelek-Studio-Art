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
      subtitle="Overview of your studio site — same design system as the public site."
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
      {loading ? <p className="admin-muted">Loading...</p> : null}
      <div className="admin-grid-stats">
        <AdminCard>
          <p className="admin-stat-label">Products</p>
          <p className="admin-stat-value">{productCount}</p>
          <Link href="/admin/products" className="admin-link">
            Manage →
          </Link>
        </AdminCard>
        <AdminCard>
          <p className="admin-stat-label">Journal</p>
          <p className="admin-stat-value">{journalCount}</p>
          <Link href="/admin/journal" className="admin-link">
            Manage →
          </Link>
        </AdminCard>
        <AdminCard>
          <p className="admin-stat-label">Messages</p>
          <p className="admin-stat-value">{messageCount}</p>
          <Link href="/admin/messages" className="admin-link">
            Inbox →
          </Link>
        </AdminCard>
        <AdminCard>
          <p className="admin-stat-label">Unread</p>
          <p className="admin-stat-value">{unreadCount}</p>
        </AdminCard>
      </div>

      <div className="admin-grid-2" style={{ marginTop: 32 }}>
        <AdminCard>
          <p className="admin-stat-label">Content</p>
          <p className="admin-muted" style={{ marginTop: 8 }}>
            Edit homepage sections — hero video, story, elements, architects, journal teaser, find.
          </p>
          <Link href="/admin/home" className="admin-link">
            Home sections →
          </Link>
        </AdminCard>
        <AdminCard>
          <p className="admin-stat-label">Site settings</p>
          <p className="admin-muted" style={{ marginTop: 8 }}>
            Site name, email, Etsy and Instagram links shown in nav and footer.
          </p>
          <Link href="/admin/settings" className="admin-link">
            Settings →
          </Link>
        </AdminCard>
      </div>
    </AdminShell>
  );
}
