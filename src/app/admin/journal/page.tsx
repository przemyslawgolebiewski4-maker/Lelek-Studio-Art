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
      subtitle="Manage journal posts"
      actions={
        <AdminLinkButton href="/admin/journal/new" variant="primary">
          New post
        </AdminLinkButton>
      }
    >
      {loading ? <p className="text-metal">Loading...</p> : null}
      {error ? <p className="text-rust-light">{error}</p> : null}

      <div className="space-y-3">
        {posts.length === 0 && !loading ? (
          <p className="text-metal">No posts yet.</p>
        ) : null}
        {posts.map((post) => (
          <AdminCard key={post._id} className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-cream">{post.title}</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-metal">
                /journal/{post.slug} · {post.published ? "published" : "draft"}
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href={`/admin/journal/${post._id}/edit`}
                className="font-mono text-[11px] uppercase tracking-[0.14em] text-sand hover:text-cream"
              >
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
