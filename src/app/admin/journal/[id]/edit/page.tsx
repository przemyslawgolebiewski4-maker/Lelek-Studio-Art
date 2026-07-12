"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdminShell, AdminCard } from "@/components/admin/AdminShell";
import { apiGet } from "@/lib/api";
import { JournalPostForm, postToForm } from "@/components/admin/JournalPostForm";
import type { JournalPost } from "@/types/content";

export default function AdminJournalEditPage() {
  const params = useParams();
  const id = params.id as string;
  const [post, setPost] = useState<JournalPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const res = await apiGet("/admin/journal");
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Failed to load post");
        setLoading(false);
        return;
      }
      const found = (data.posts as JournalPost[]).find((p) => p._id === id) ?? null;
      if (!found) setError("Post not found");
      setPost(found);
      setLoading(false);
    }
    load();
  }, [id]);

  return (
    <AdminShell title="Edit journal post" subtitle={post?.title}>
      {loading ? <p className="text-metal">Loading...</p> : null}
      {error ? <p className="text-rust-light">{error}</p> : null}
      {post ? (
        <AdminCard className="max-w-3xl">
          <JournalPostForm initial={postToForm(post)} postId={post._id} />
        </AdminCard>
      ) : null}
    </AdminShell>
  );
}
