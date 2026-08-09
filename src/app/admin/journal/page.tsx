"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AdminShell,
  AdminCard,
  AdminLinkButton,
  AdminButton,
} from "@/components/admin/AdminShell";
import { apiDelete, apiGet, readApiResult } from "@/lib/api";
import type { JournalPost } from "@/types/content";

export default function AdminJournalPage() {
  const [posts, setPosts] = useState<JournalPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadPosts() {
    setLoading(true);
    setError("");
    const res = await apiGet("/admin/journal");
    const data = await readApiResult<{ posts: JournalPost[] }>(res);
    if (!data.ok) {
      setError(data.error);
      setLoading(false);
      return;
    }
    setPosts(data.posts);
    setLoading(false);
  }

  useEffect(() => {
    loadPosts();
  }, []);

  async function deletePost(id: string) {
    if (!confirm("Delete this post?")) return;
    const res = await apiDelete(`/admin/journal/${id}`);
    const data = await readApiResult(res);
    if (data.ok) {
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } else {
      setError(data.error);
    }
  }

  return (
    <AdminShell
      title="Journal"
      subtitle="Manage journal posts shown on /journal and homepage teaser."
      actions={
        <AdminLinkButton href="/admin/journal/new" variant="primary">
          New post
        </AdminLinkButton>
      }
    >
      {loading ? <p className="admin-muted">Loading...</p> : null}
      {error ? <p className="admin-error">{error}</p> : null}

      <div className="admin-form-stack">
        {posts.length === 0 && !loading ? (
          <AdminCard>
            <p className="admin-list-item-title">No journal posts yet</p>
            <p className="admin-muted" style={{ marginBottom: 12 }}>
              Write the first Process note - material, making, or life in the Berlin studio.
            </p>
            <AdminLinkButton href="/admin/journal/new" variant="primary">
              Create first post
            </AdminLinkButton>
          </AdminCard>
        ) : null}
        {posts.map((post) => (
          <AdminCard
            key={post._id}
            style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16 }}
          >
            <div>
              <p className="admin-list-item-title">{post.title}</p>
              <p className="admin-list-item-meta">
                /journal/{post.slug} ·{" "}
                <span style={{ color: post.published ? "#2a5a3a" : "#8a2b2b" }}>
                  {post.published ? "LIVE on site" : "Draft - not public"}
                </span>
              </p>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <Link href={`/admin/journal/${post._id}/edit`} className="admin-table-action">
                Edit
              </Link>
              <AdminButton variant="danger" onClick={() => deletePost(post._id)}>
                Delete
              </AdminButton>
            </div>
          </AdminCard>
        ))}
      </div>
    </AdminShell>
  );
}
