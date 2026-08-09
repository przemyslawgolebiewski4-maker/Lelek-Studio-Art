"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminButton, AdminInput, AdminTextarea } from "@/components/admin/AdminShell";
import { AdminSeoInput, AdminSeoTextarea } from "@/components/admin/AdminFieldHelpers";
import { MediaUploadField } from "@/components/admin/MediaUploadField";
import { apiPatch, apiPost, readApiResult } from "@/lib/api";
import { MEDIA_HINTS } from "@/lib/media-hints";
import type { JournalPost } from "@/types/content";

export type JournalFormData = {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  coverImage: string;
  coverImageAlt: string;
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
    coverImageAlt: post?.coverImageAlt ?? "",
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
    const data = await readApiResult(res);

    setLoading(false);
    if (!data.ok) {
      setError(data.error);
      return;
    }

    router.push("/admin/journal");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="admin-form-stack-lg">
      {error ? <p className="admin-error">{error}</p> : null}

      <div className="admin-field-group">
        <h3 className="admin-group-title">1. Post content</h3>
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
        <p className="admin-muted" style={{ marginTop: "-8px", marginBottom: "8px" }}>
          Image alt in Markdown: write ![short description of the image](https://…) - the text
          between the brackets becomes the alt attribute on the public post.
        </p>
      </div>

      <div className="admin-field-group">
        <h3 className="admin-group-title">2. Cover image</h3>
        <MediaUploadField
          label="Cover image"
          value={form.coverImage}
          onChange={(v) => setForm({ ...form, coverImage: v })}
          folder="journal"
          hint={MEDIA_HINTS.journalCover}
        />
        <AdminInput
          label="Cover image alt text"
          value={form.coverImageAlt}
          onChange={(e) => setForm({ ...form, coverImageAlt: e.target.value })}
          placeholder={form.title || "Describe the cover image"}
        />
        <p className="admin-muted" style={{ marginTop: "-8px", marginBottom: "8px" }}>
          Defaults to the post title if left empty - prefer a real description of the image.
        </p>
      </div>

      <div className="admin-field-group">
        <h3 className="admin-group-title">3. SEO &amp; publish</h3>
        <AdminSeoInput
          label="Meta title"
          value={form.metaTitle}
          onChange={(v) => setForm({ ...form, metaTitle: v })}
          placeholder={form.title}
        />
        <AdminSeoTextarea
          label="Meta description"
          value={form.metaDescription}
          onChange={(v) => setForm({ ...form, metaDescription: v })}
          placeholder={form.excerpt}
        />
        <AdminInput
          label="Order"
          type="number"
          value={form.order}
          onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
        />

        <label className="admin-checkbox">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => setForm({ ...form, published: e.target.checked })}
          />
          {form.published
            ? "Live on /journal (published)"
            : "Draft - hidden from the public journal"}
        </label>
      </div>

      <AdminButton type="submit" disabled={loading} className="filled">
        {loading ? "Saving..." : postId ? "Update post" : "Create post"}
      </AdminButton>
    </form>
  );
}
