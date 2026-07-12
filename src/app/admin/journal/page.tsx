"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AdminShell,
  AdminCard,
  AdminLinkButton,
  AdminButton,
} from "@/components/admin/AdminShell";
import { apiDelete, apiGet } from "@/lib/api";
import type { JournalPost } from "@/types/content";

export default function AdminJournalPage() {
  const [posts, setPosts] = useState<JournalPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadPosts() {
    setLoading(true);
    const res = await apiGet("/admin/journal");
    const data = await res.json();
    if (!res.ok || !data.ok) {
      setError(data.error ?? "Failed to load posts");
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
    const data = await res.json();
    if (data.ok) {
      setPosts((prev) => prev.filter((p) => p._id !== id));
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
          <p className="admin-muted">No posts yet.</p>
        ) : null}
        {posts.map((post) => (
          <AdminCard
            key={post._id}
            style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16 }}
          >
            <div>
              <p className="admin-list-item-title">{post.title}</p>
              <p className="admin-list-item-meta">
                /journal/{post.slug} · {post.published ? "published" : "draft"}
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
