"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminButton, AdminInput } from "@/components/admin/AdminShell";
import { LangPair } from "@/components/admin/BilingualField";
import { suggestPl } from "@/lib/i18n/dictionary";
import { MediaUploadField } from "@/components/admin/MediaUploadField";
import { apiPatch, apiPost, readApiResult } from "@/lib/api";
import { MEDIA_HINTS } from "@/lib/media-hints";
import type { JournalPost } from "@/types/content";

type JournalPl = {
  title: string;
  excerpt: string;
  body: string;
  coverImageAlt: string;
  metaTitle: string;
  metaDescription: string;
};

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
  pl: JournalPl;
};

function journalPl(
  post: Partial<JournalPost> | undefined,
  key: keyof JournalPl,
  english: string,
): string {
  const stored = post?.i18n?.pl?.[key];
  if (typeof stored === "string" && stored.trim()) return stored;
  return suggestPl(english);
}

export function postToForm(post?: Partial<JournalPost>): JournalFormData {
  const title = post?.title ?? "";
  const excerpt = post?.excerpt ?? "";
  const body = post?.body ?? "";
  const coverImageAlt = post?.coverImageAlt ?? "";
  const metaTitle = post?.metaTitle ?? "";
  const metaDescription = post?.metaDescription ?? "";
  return {
    slug: post?.slug ?? "",
    title,
    excerpt,
    body,
    coverImage: post?.coverImage ?? "",
    coverImageAlt,
    metaTitle,
    metaDescription,
    published: post?.published ?? false,
    order: post?.order ?? 0,
    pl: {
      title: journalPl(post, "title", title),
      excerpt: journalPl(post, "excerpt", excerpt),
      body: journalPl(post, "body", body),
      coverImageAlt: journalPl(post, "coverImageAlt", coverImageAlt),
      metaTitle: journalPl(post, "metaTitle", metaTitle),
      metaDescription: journalPl(post, "metaDescription", metaDescription),
    },
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

    const payload = { ...form, i18n: { pl: form.pl } };
    const res = postId
      ? await apiPatch(`/admin/journal/${postId}`, payload)
      : await apiPost("/admin/journal", payload);
    const data = await readApiResult(res);

    setLoading(false);
    if (!data.ok) {
      setError(data.error);
      return;
    }

    router.push("/admin/journal");
    router.refresh();
  }

  function updatePl<K extends keyof JournalPl>(key: K, value: string) {
    setForm((prev) => ({ ...prev, pl: { ...prev.pl, [key]: value } }));
  }

  return (
    <form onSubmit={handleSubmit} className="admin-form-stack-lg">
      {error ? <p className="admin-error">{error}</p> : null}

      <div className="admin-field-group">
        <h3 className="admin-group-title">1. Post content</h3>
        <div className="admin-form-row-2">
          <LangPair
            label="Title"
            en={form.title}
            pl={form.pl.title}
            onEn={(value) => setForm({ ...form, title: value })}
            onPl={(value) => updatePl("title", value)}
          />
          <AdminInput
            label="Slug"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            required
          />
        </div>

        <LangPair
          label="Excerpt"
          en={form.excerpt}
          pl={form.pl.excerpt}
          multiline
          rows={2}
          onEn={(value) => setForm({ ...form, excerpt: value })}
          onPl={(value) => updatePl("excerpt", value)}
        />

        <LangPair
          label="Body (Markdown)"
          en={form.body}
          pl={form.pl.body}
          multiline
          rows={12}
          onEn={(value) => setForm({ ...form, body: value })}
          onPl={(value) => updatePl("body", value)}
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
        <LangPair
          label="Cover image alt text"
          en={form.coverImageAlt}
          pl={form.pl.coverImageAlt}
          placeholder={form.title || "Describe the cover image"}
          onEn={(value) => setForm({ ...form, coverImageAlt: value })}
          onPl={(value) => updatePl("coverImageAlt", value)}
        />
        <p className="admin-muted" style={{ marginTop: "-8px", marginBottom: "8px" }}>
          Defaults to the post title if left empty - prefer a real description of the image.
        </p>
      </div>

      <div className="admin-field-group">
        <h3 className="admin-group-title">3. SEO &amp; publish</h3>
        <LangPair
          label="Meta title"
          en={form.metaTitle}
          pl={form.pl.metaTitle}
          placeholder={form.title}
          onEn={(value) => setForm({ ...form, metaTitle: value })}
          onPl={(value) => updatePl("metaTitle", value)}
        />
        <LangPair
          label="Meta description"
          en={form.metaDescription}
          pl={form.pl.metaDescription}
          multiline
          rows={2}
          placeholder={form.excerpt}
          onEn={(value) => setForm({ ...form, metaDescription: value })}
          onPl={(value) => updatePl("metaDescription", value)}
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
