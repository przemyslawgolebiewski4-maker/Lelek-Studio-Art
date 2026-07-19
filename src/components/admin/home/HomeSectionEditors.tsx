"use client";

import {
  AdminInput,
  AdminTextarea,
} from "@/components/admin/AdminShell";
import { MediaUploadField } from "@/components/admin/MediaUploadField";
import { MEDIA_HINTS } from "@/lib/media-hints";
import type { ElementItem } from "@/types/content";

export type HeroFormData = {
  eyebrow: string;
  headline: string;
  headlineEm: string;
  quote: string;
  subheadline: string;
  image: string;
  imageMobile: string;
  video: string;
  videoMobile: string;
  imageAlt: string;
  imageCaption: string;
  cta1Text: string;
  cta1Url: string;
  cta2Text: string;
  cta2Url: string;
};

export function heroToForm(content: Record<string, unknown>): HeroFormData {
  const c = content as Record<string, string>;
  return {
    eyebrow: c.eyebrow ?? "",
    headline: c.headline ?? "",
    headlineEm: c.headlineEm ?? "",
    quote: c.quote ?? "",
    subheadline: c.subheadline ?? "",
    image: c.image ?? "",
    imageMobile: c.imageMobile ?? "",
    video: c.video ?? "",
    videoMobile: c.videoMobile ?? "",
    imageAlt: c.imageAlt ?? "",
    imageCaption: c.imageCaption ?? "",
    cta1Text: c.cta1Text ?? "",
    cta1Url: c.cta1Url ?? "/collections",
    cta2Text: c.cta2Text ?? "",
    cta2Url: c.cta2Url ?? "/about",
  };
}

export function heroFromForm(form: HeroFormData): Record<string, string> {
  return { ...form };
}

export function HeroSectionEditor({
  content,
  onChange,
}: {
  content: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
}) {
  const form = heroToForm(content);
  function set<K extends keyof HeroFormData>(key: K, value: HeroFormData[K]) {
    onChange(heroFromForm({ ...form, [key]: value }));
  }

  return (
    <div className="admin-form-stack-lg">
      <p className="admin-muted">
        Hero - left media (photo or looped video), right headline and CTAs. Matches the public homepage hero.
      </p>

      <div className="admin-field-group">
        <h3 className="admin-group-title">Media</h3>
        <MediaUploadField
          label="Desktop image"
          value={form.image}
          onChange={(v) => set("image", v)}
          folder="hero"
          hint={MEDIA_HINTS.heroDesktopImage}
        />
        <MediaUploadField
          label="Mobile image (optional)"
          value={form.imageMobile}
          onChange={(v) => set("imageMobile", v)}
          folder="hero"
          hint={MEDIA_HINTS.heroMobileImage}
        />
        <MediaUploadField
          label="Desktop video (optional loop)"
          value={form.video}
          onChange={(v) => set("video", v)}
          folder="hero"
          mode="video"
          hint={MEDIA_HINTS.heroDesktopVideo}
        />
        <MediaUploadField
          label="Mobile video (optional)"
          value={form.videoMobile}
          onChange={(v) => set("videoMobile", v)}
          folder="hero"
          mode="video"
          hint={MEDIA_HINTS.heroMobileVideo}
        />
        <AdminInput label="Media caption" value={form.imageCaption} onChange={(e) => set("imageCaption", e.target.value)} />
        <AdminInput label="Alt text (accessibility)" value={form.imageAlt} onChange={(e) => set("imageAlt", e.target.value)} />
      </div>

      <div className="admin-field-group">
        <h3 className="admin-group-title">Text</h3>
        <AdminInput label="Eyebrow" value={form.eyebrow} onChange={(e) => set("eyebrow", e.target.value)} />
        <AdminInput label="Headline line 1" value={form.headline} onChange={(e) => set("headline", e.target.value)} />
        <AdminInput label="Headline line 2 (italic)" value={form.headlineEm} onChange={(e) => set("headlineEm", e.target.value)} />
        <AdminTextarea label="Quote" rows={2} value={form.quote} onChange={(e) => set("quote", e.target.value)} />
        <AdminTextarea label="Subheadline (if no quote)" rows={2} value={form.subheadline} onChange={(e) => set("subheadline", e.target.value)} />
      </div>

      <div className="admin-field-group">
        <h3 className="admin-group-title">Buttons</h3>
        <div className="admin-form-row-2">
          <AdminInput label="Primary CTA text" value={form.cta1Text} onChange={(e) => set("cta1Text", e.target.value)} />
          <AdminInput label="Primary CTA link" value={form.cta1Url} onChange={(e) => set("cta1Url", e.target.value)} />
        </div>
        <div className="admin-form-row-2">
          <AdminInput label="Secondary CTA text" value={form.cta2Text} onChange={(e) => set("cta2Text", e.target.value)} />
          <AdminInput label="Secondary CTA link" value={form.cta2Url} onChange={(e) => set("cta2Url", e.target.value)} />
        </div>
      </div>
    </div>
  );
}

export type StoryFormData = {
  eyebrow: string;
  heading: string;
  headingEm: string;
  body1: string;
  body2: string;
  body3: string;
  signature: string;
  image: string;
  imageMobile: string;
  video: string;
  videoMobile: string;
  imageAlt: string;
  imageCaption: string;
};

export function storyToForm(content: Record<string, unknown>): StoryFormData {
  const c = content as Record<string, string>;
  return {
    eyebrow: c.eyebrow ?? "",
    heading: c.heading ?? "",
    headingEm: c.headingEm ?? "",
    body1: c.body1 ?? "",
    body2: c.body2 ?? "",
    body3: c.body3 ?? "",
    signature: c.signature ?? "",
    image: c.image ?? "",
    imageMobile: c.imageMobile ?? "",
    video: c.video ?? "",
    videoMobile: c.videoMobile ?? "",
    imageAlt: c.imageAlt ?? "",
    imageCaption: c.imageCaption ?? "",
  };
}

export function storyFromForm(form: StoryFormData): Record<string, string> {
  return { ...form };
}

export function StorySectionEditor({
  content,
  onChange,
}: {
  content: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
}) {
  const form = storyToForm(content);
  function set<K extends keyof StoryFormData>(key: K, value: StoryFormData[K]) {
    onChange(storyFromForm({ ...form, [key]: value }));
  }

  return (
    <div className="admin-form-stack-lg">
      <p className="admin-muted">Story block below hero - same layout on homepage and /about.</p>

      <div className="admin-field-group">
        <h3 className="admin-group-title">Media</h3>
        <MediaUploadField
          label="Image"
          value={form.image}
          onChange={(v) => set("image", v)}
          folder="story"
          hint={MEDIA_HINTS.storyDesktopImage}
        />
        <MediaUploadField
          label="Mobile image"
          value={form.imageMobile}
          onChange={(v) => set("imageMobile", v)}
          folder="story"
          hint={MEDIA_HINTS.storyMobileImage}
        />
        <MediaUploadField
          label="Video loop (optional)"
          value={form.video}
          onChange={(v) => set("video", v)}
          folder="story"
          mode="video"
          hint={MEDIA_HINTS.storyDesktopVideo}
        />
        <MediaUploadField
          label="Mobile video"
          value={form.videoMobile}
          onChange={(v) => set("videoMobile", v)}
          folder="story"
          mode="video"
          hint={MEDIA_HINTS.storyMobileVideo}
        />
        <AdminInput label="Caption" value={form.imageCaption} onChange={(e) => set("imageCaption", e.target.value)} />
        <AdminInput label="Alt text" value={form.imageAlt} onChange={(e) => set("imageAlt", e.target.value)} />
      </div>

      <div className="admin-field-group">
        <h3 className="admin-group-title">Copy</h3>
        <AdminInput label="Eyebrow" value={form.eyebrow} onChange={(e) => set("eyebrow", e.target.value)} />
        <AdminInput label="Heading" value={form.heading} onChange={(e) => set("heading", e.target.value)} />
        <AdminInput label="Heading emphasis (italic)" value={form.headingEm} onChange={(e) => set("headingEm", e.target.value)} />
        <AdminTextarea label="Paragraph 1" rows={3} value={form.body1} onChange={(e) => set("body1", e.target.value)} />
        <AdminTextarea label="Paragraph 2" rows={3} value={form.body2} onChange={(e) => set("body2", e.target.value)} />
        <AdminTextarea label="Paragraph 3" rows={3} value={form.body3} onChange={(e) => set("body3", e.target.value)} />
        <AdminInput label="Signature" value={form.signature} onChange={(e) => set("signature", e.target.value)} />
      </div>
    </div>
  );
}

export function ElementsSectionEditor({
  content,
  onChange,
}: {
  content: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
}) {
  const items = ((content.items as ElementItem[]) ?? []).slice(0, 4);
  while (items.length < 4) {
    items.push({ number: ["I.", "II.", "III.", "IV."][items.length] ?? "", name: "" });
  }

  function updateItem(index: number, patch: Partial<ElementItem>) {
    const next = items.map((item, i) => (i === index ? { ...item, ...patch } : item));
    onChange({ items: next });
  }

  return (
    <div className="admin-form-stack-lg">
      <p className="admin-muted">Four elements bar - Earth, Water, Fire, Air. Shown in hero and full-width bar.</p>
      {items.map((item, i) => (
        <div key={i} className="admin-form-row-2">
          <AdminInput
            label={`Element ${i + 1} number`}
            value={item.number}
            onChange={(e) => updateItem(i, { number: e.target.value })}
          />
          <AdminInput
            label={`Element ${i + 1} name`}
            value={item.name}
            onChange={(e) => updateItem(i, { name: e.target.value })}
          />
        </div>
      ))}
    </div>
  );
}

export function TextSectionEditor({
  content,
  onChange,
  fields,
  description,
}: {
  content: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
  fields: { key: string; label: string; multiline?: boolean; hint?: string }[];
  description?: string;
}) {
  const c = content as Record<string, string>;

  return (
    <div className="admin-form-stack-lg">
      {description ? <p className="admin-muted">{description}</p> : null}
      {fields.map(({ key, label, multiline, hint }) =>
        multiline ? (
          <AdminTextarea
            key={key}
            label={label}
            rows={3}
            value={c[key] ?? ""}
            onChange={(e) => onChange({ ...content, [key]: e.target.value })}
          />
        ) : (
          <div key={key}>
            <AdminInput
              label={label}
              value={c[key] ?? ""}
              onChange={(e) => onChange({ ...content, [key]: e.target.value })}
            />
            {hint ? <p className="admin-field-hint">{hint}</p> : null}
          </div>
        ),
      )}
    </div>
  );
}

export function FindSectionEditor({
  content,
  onChange,
}: {
  content: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
}) {
  const c = content as Record<string, string>;
  function set(key: string, value: string) {
    onChange({ ...content, [key]: value });
  }

  return (
    <div className="admin-form-stack-lg">
      <p className="admin-muted">Find us / Etsy block at bottom of homepage.</p>
      <AdminInput label="Studio name" value={c.studioName ?? ""} onChange={(e) => set("studioName", e.target.value)} />
      <AdminTextarea label="Studio address" rows={3} value={c.studioAddress ?? ""} onChange={(e) => set("studioAddress", e.target.value)} />
      <AdminInput label="Studio Instagram handle" value={c.studioInstagram ?? ""} onChange={(e) => set("studioInstagram", e.target.value)} />
      <AdminInput label="Etsy shop URL" value={c.etsyUrl ?? ""} onChange={(e) => set("etsyUrl", e.target.value)} />
      <AdminInput label="Lelek meaning (footer)" value={c.lelekMeaning ?? ""} onChange={(e) => set("lelekMeaning", e.target.value)} />
    </div>
  );
}

export type FeaturedFormData = {
  eyebrow: string;
  heading: string;
  headingEm: string;
  video: string;
  videoMobile: string;
  videoAlt: string;
};

export function featuredToForm(content: Record<string, unknown>): FeaturedFormData {
  const c = content as Record<string, string>;
  return {
    eyebrow: c.eyebrow ?? "Works",
    heading: c.heading ?? "Form, surface",
    headingEm: c.headingEm ?? "and presence",
    video: c.video ?? "",
    videoMobile: c.videoMobile ?? "",
    videoAlt: c.videoAlt ?? "Lelek Studio Berlin - handmade ceramics",
  };
}

export function featuredFromForm(form: FeaturedFormData): Record<string, string> {
  return { ...form };
}

export function FeaturedSectionEditor({
  content,
  onChange,
}: {
  content: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
}) {
  const form = featuredToForm(content);
  function set<K extends keyof FeaturedFormData>(key: K, value: FeaturedFormData[K]) {
    onChange(featuredFromForm({ ...form, [key]: value }));
  }

  return (
    <div className="admin-form-stack-lg">
      <p className="admin-muted">
        Featured Works section. The video plays above 3 product thumbnails.
        To choose which products appear as thumbnails, enable &quot;Visible on Home&quot;
        in each product&apos;s edit page (max 3 products shown, sorted by order).
      </p>

      <div className="admin-field-group">
        <h3 className="admin-group-title">Heading</h3>
        <AdminInput
          label="Heading line 1"
          value={form.heading}
          onChange={(e) => set("heading", e.target.value)}
        />
        <AdminInput
          label="Heading line 2 (italic)"
          value={form.headingEm}
          onChange={(e) => set("headingEm", e.target.value)}
        />
      </div>

      <div className="admin-field-group">
        <h3 className="admin-group-title">Video</h3>
        <p className="admin-muted">
          Autoplay, muted, looped. Recommended: studio process, ceramics in use,
          cafe or interior context. Max 30s, ratio 16:7 ideal.
        </p>
        <MediaUploadField
          label="Desktop video"
          value={form.video}
          onChange={(v) => set("video", v)}
          folder="featured"
          mode="video"
          hint={MEDIA_HINTS.heroDesktopVideo ?? "MP4 or WebM, max 50MB, ratio 16:7"}
        />
        <MediaUploadField
          label="Mobile video (optional)"
          value={form.videoMobile}
          onChange={(v) => set("videoMobile", v)}
          folder="featured"
          mode="video"
          hint="Vertical format recommended for mobile, 9:16 or 4:3"
        />
        <AdminInput
          label="Video alt text (accessibility)"
          value={form.videoAlt}
          onChange={(e) => set("videoAlt", e.target.value)}
        />
      </div>

      <div className="admin-field-group">
        <h3 className="admin-group-title">Product thumbnails</h3>
        <p className="admin-muted">
          The 3 thumbnails below the video are controlled in the Products section.
          Go to Products, edit any product, and enable &quot;Visible on Home&quot;.
          Up to 3 published products with that option enabled will appear here,
          sorted by their order number.
        </p>
      </div>
    </div>
  );
}
