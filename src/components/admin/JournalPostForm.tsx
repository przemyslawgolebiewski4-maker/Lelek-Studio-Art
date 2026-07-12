"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminButton, AdminInput, AdminTextarea } from "@/components/admin/AdminShell";
import { MediaUploadField } from "@/components/admin/MediaUploadField";
import { apiPatch, apiPost } from "@/lib/api";
import type { JournalPost } from "@/types/content";

export type JournalFormData = {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  coverImage: string;
  metaTitle: string;
  metaDescription: string;
  published: boolean;
  order: number;
};

export function postToForm(post?: Partial<JournalPost>): JournalFormData {
  return {
    slug: post?.slug ?? "",
    title: post?.title ?? "",
    excerpt: post?.excerpt ?? "",
    body: post?.body ?? "",
    coverImage: post?.coverImage ?? "",
    metaTitle: post?.metaTitle ?? "",
    metaDescription: post?.metaDescription ?? "",
    published: post?.published ?? false,
    order: post?.order ?? 0,
  };
}

export function JournalPostForm({
  initial,
  postId,
}: {
  initial: JournalFormData;
  postId?: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = postId
      ? await apiPatch(`/admin/journal/${postId}`, form)
      : await apiPost("/admin/journal", form);
    const data = await res.json();

    setLoading(false);
    if (!res.ok || !data.ok) {
      setError(data.error ?? "Failed to save");
      return;
    }

    router.push("/admin/journal");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="admin-form-stack-lg">
      {error ? <p className="admin-error">{error}</p> : null}

      <div className="admin-form-row-2">
        <AdminInput
          label="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <AdminInput
          label="Slug"
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
          required
        />
      </div>

      <AdminTextarea
        label="Excerpt"
        rows={2}
        value={form.excerpt}
        onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
      />

      <AdminTextarea
        label="Body (Markdown)"
        rows={12}
        value={form.body}
        onChange={(e) => setForm({ ...form, body: e.target.value })}
      />

      <MediaUploadField
        label="Cover image"
        value={form.coverImage}
        onChange={(v) => setForm({ ...form, coverImage: v })}
        folder="journal"
      />

      <div className="admin-form-row-2">
        <AdminInput
          label="Meta title"
          value={form.metaTitle}
          onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
        />
        <AdminInput
          label="Order"
          type="number"
          value={form.order}
          onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
        />
      </div>

      <AdminTextarea
        label="Meta description"
        rows={2}
        value={form.metaDescription}
        onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
      />

      <label className="admin-checkbox">
        <input
          type="checkbox"
          checked={form.published}
          onChange={(e) => setForm({ ...form, published: e.target.checked })}
        />
        Published
      </label>

      <AdminButton type="submit" disabled={loading} className="filled">
        {loading ? "Saving..." : postId ? "Update post" : "Create post"}
      </AdminButton>
    </form>
  );
}
