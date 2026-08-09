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
  brandline: string;
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
    brandline: c.brandline ?? "",
    image: c.image ?? "",
    imageMobile: c.imageMobile ?? "",
    video: c.video ?? "",
    videoMobile: c.videoMobile ?? "",
    imageAlt: c.imageAlt ?? "",
    imageCaption: c.imageCaption ?? "",
    cta1Text: c.cta1Text ?? "",
    cta1Url: c.cta1Url ?? "",
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
        <AdminInput label="Eyebrow" value={form.eyebrow} onChange={(e) => set("eyebrow", e.target.value)} placeholder="Design through material." />
        <AdminInput label="Headline line 1" value={form.headline} onChange={(e) => set("headline", e.target.value)} />
        <AdminInput label="Headline line 2 (italic)" value={form.headlineEm} onChange={(e) => set("headlineEm", e.target.value)} />
        <AdminTextarea label="Quote" rows={2} value={form.quote} onChange={(e) => set("quote", e.target.value)} />
        <AdminTextarea label="Subline (if no quote)" rows={2} value={form.subheadline} onChange={(e) => set("subheadline", e.target.value)} placeholder="Ceramic objects, vessels, prints." />
        <AdminInput label="Brand line" value={form.brandline} onChange={(e) => set("brandline", e.target.value)} placeholder="LELEK - Berlin." />
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

export type StoryGalleryItem = { image: string; alt: string };

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
  ctaShopLabel: string;
  ctaTradeLabel: string;
  gallery: StoryGalleryItem[];
};

export function storyToForm(content: Record<string, unknown>): StoryFormData {
  const c = content as Record<string, string>;
  const rawGallery = Array.isArray(content.gallery)
    ? (content.gallery as StoryGalleryItem[])
    : [];
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
    ctaShopLabel: c.ctaShopLabel ?? "Shop the collections",
    ctaTradeLabel: c.ctaTradeLabel ?? "Designing a space?",
    gallery: rawGallery.map((g) => ({ image: g.image ?? "", alt: g.alt ?? "" })),
  };
}

export function storyFromForm(form: StoryFormData): Record<string, unknown> {
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

  function updateGallery(index: number, patch: Partial<StoryGalleryItem>) {
    const next = form.gallery.map((item, i) =>
      i === index ? { ...item, ...patch } : item,
    );
    set("gallery", next);
  }

  function addGalleryItem() {
    set("gallery", [...form.gallery, { image: "", alt: "" }]);
  }

  function removeGalleryItem(index: number) {
    set(
      "gallery",
      form.gallery.filter((_, i) => i !== index),
    );
  }

  return (
    <div className="admin-form-stack-lg">
      <p className="admin-muted">
        Story / About - homepage shows paragraph 1 only; /about shows all paragraphs, gallery, CTAs and Originals.
      </p>

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
        <AdminTextarea label="Paragraph 1 (homepage teaser + about)" rows={3} value={form.body1} onChange={(e) => set("body1", e.target.value)} />
        <AdminTextarea label="Paragraph 2 (about only)" rows={3} value={form.body2} onChange={(e) => set("body2", e.target.value)} />
        <AdminTextarea label="Paragraph 3 (about only)" rows={3} value={form.body3} onChange={(e) => set("body3", e.target.value)} />
        <AdminInput label="Signature" value={form.signature} onChange={(e) => set("signature", e.target.value)} />
      </div>

      <div className="admin-field-group">
        <h3 className="admin-group-title">About CTAs</h3>
        <p className="admin-muted">Links stay fixed (Shop URL env / Trade page). Edit labels only.</p>
        <AdminInput
          label="Shop button label"
          value={form.ctaShopLabel}
          onChange={(e) => set("ctaShopLabel", e.target.value)}
        />
        <AdminInput
          label="Trade button label"
          value={form.ctaTradeLabel}
          onChange={(e) => set("ctaTradeLabel", e.target.value)}
        />
      </div>

      <div className="admin-field-group">
        <h3 className="admin-group-title">About gallery</h3>
        <p className="admin-muted">Sculpture / original-work photos. Each image needs its own alt text.</p>
        {form.gallery.map((item, i) => (
          <div key={i} className="admin-field-group" style={{ borderTop: "1px solid rgba(11,10,8,0.12)", paddingTop: 12 }}>
            <MediaUploadField
              label={`Gallery image ${i + 1}`}
              value={item.image}
              onChange={(v) => updateGallery(i, { image: v })}
              folder="story"
            />
            <AdminInput
              label={`Alt text ${i + 1}`}
              value={item.alt}
              onChange={(e) => updateGallery(i, { alt: e.target.value })}
            />
            <button type="button" className="admin-btn ghost" onClick={() => removeGalleryItem(i)}>
              Remove image
            </button>
          </div>
        ))}
        <button type="button" className="admin-btn" onClick={addGalleryItem}>
          Add gallery image
        </button>
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
  const scopeNote =
    typeof content.scopeNote === "string"
      ? content.scopeNote
      : "Ceramics process, below - Mire & Silt collections only";

  function updateItem(index: number, patch: Partial<ElementItem>) {
    const next = items.map((item, i) => (i === index ? { ...item, ...patch } : item));
    onChange({ ...content, items: next, scopeNote });
  }

  return (
    <div className="admin-form-stack-lg">
      <p className="admin-muted">Four elements bar - Earth, Water, Fire, Air. Shown in hero and full-width bar.</p>
      <AdminInput
        label="Scope note (above bar)"
        value={scopeNote}
        onChange={(e) => onChange({ ...content, items, scopeNote: e.target.value })}
      />
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

export type SignpostCardForm = {
  label: string;
  description: string;
  href: string;
};

export function SignpostSectionEditor({
  content,
  onChange,
}: {
  content: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
}) {
  const intro = typeof content.intro === "string" ? content.intro : "";
  const tradeSignal = typeof content.tradeSignal === "string" ? content.tradeSignal : "";
  const tradeHref = typeof content.tradeHref === "string" ? content.tradeHref : "/for-architects";
  const cards = (
    Array.isArray(content.cards) ? (content.cards as SignpostCardForm[]) : []
  ).slice(0, 4);
  while (cards.length < 4) {
    cards.push({ label: "", description: "", href: "" });
  }

  function updateCard(index: number, patch: Partial<SignpostCardForm>) {
    const next = cards.map((card, i) => (i === index ? { ...card, ...patch } : card));
    onChange({ intro, tradeSignal, tradeHref, cards: next });
  }

  return (
    <div className="admin-form-stack-lg">
      <p className="admin-muted">
        Wayfinding block directly below the hero - intro, Trade signal line, and four destination cards.
      </p>
      <AdminTextarea
        label="Intro paragraph"
        rows={3}
        value={intro}
        onChange={(e) => onChange({ intro: e.target.value, tradeSignal, tradeHref, cards })}
      />
      <AdminInput
        label="Trade signal text"
        value={tradeSignal}
        onChange={(e) => onChange({ intro, tradeSignal: e.target.value, tradeHref, cards })}
      />
      <AdminInput
        label="Trade signal link"
        value={tradeHref}
        onChange={(e) => onChange({ intro, tradeSignal, tradeHref: e.target.value, cards })}
      />
      {cards.map((card, i) => (
        <div key={i} className="admin-field-group">
          <h3 className="admin-group-title">Card {i + 1}</h3>
          <AdminInput
            label="Label"
            value={card.label}
            onChange={(e) => updateCard(i, { label: e.target.value })}
          />
          <AdminTextarea
            label="Description"
            rows={2}
            value={card.description}
            onChange={(e) => updateCard(i, { description: e.target.value })}
          />
          <AdminInput
            label="Link (path or full URL)"
            value={card.href}
            onChange={(e) => updateCard(i, { href: e.target.value })}
          />
        </div>
      ))}
    </div>
  );
}

export function TradeSectionEditor({
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
      <p className="admin-muted">
        Trade page (/for-architects) hero media + caption, plus the homepage architects CTA copy.
      </p>

      <div className="admin-field-group">
        <h3 className="admin-group-title">Trade page hero</h3>
        <MediaUploadField
          label="Hero image"
          value={c.heroImage ?? ""}
          onChange={(v) => set("heroImage", v)}
          folder="architects"
        />
        <MediaUploadField
          label="Hero image mobile"
          value={c.heroImageMobile ?? ""}
          onChange={(v) => set("heroImageMobile", v)}
          folder="architects"
        />
        <MediaUploadField
          label="Hero video (optional)"
          value={c.heroVideo ?? ""}
          onChange={(v) => set("heroVideo", v)}
          folder="architects"
          mode="video"
        />
        <MediaUploadField
          label="Hero video mobile"
          value={c.heroVideoMobile ?? ""}
          onChange={(v) => set("heroVideoMobile", v)}
          folder="architects"
          mode="video"
        />
        <AdminInput
          label="Hero alt text"
          value={c.heroImageAlt ?? ""}
          onChange={(e) => set("heroImageAlt", e.target.value)}
        />
        <AdminTextarea
          label="Hero caption"
          rows={2}
          value={c.heroCaption ?? ""}
          onChange={(e) => set("heroCaption", e.target.value)}
        />
      </div>

      <div className="admin-field-group">
        <h3 className="admin-group-title">Trade / architects copy</h3>
        <AdminInput label="Eyebrow" value={c.eyebrow ?? ""} onChange={(e) => set("eyebrow", e.target.value)} />
        <AdminInput label="Headline line 1" value={c.headline ?? ""} onChange={(e) => set("headline", e.target.value)} />
        <AdminInput label="Headline line 2 (italic)" value={c.headlineEm ?? ""} onChange={(e) => set("headlineEm", e.target.value)} />
        <AdminTextarea label="Subtext" rows={3} value={c.sub ?? ""} onChange={(e) => set("sub", e.target.value)} />
        <AdminInput label="Point 01 - title" value={c.point1Title ?? ""} onChange={(e) => set("point1Title", e.target.value)} />
        <AdminInput label="Point 01 - description" value={c.point1Body ?? ""} onChange={(e) => set("point1Body", e.target.value)} />
        <AdminInput label="Point 02 - title" value={c.point2Title ?? ""} onChange={(e) => set("point2Title", e.target.value)} />
        <AdminInput label="Point 02 - description" value={c.point2Body ?? ""} onChange={(e) => set("point2Body", e.target.value)} />
        <AdminInput label="Point 03 - title" value={c.point3Title ?? ""} onChange={(e) => set("point3Title", e.target.value)} />
        <AdminInput label="Point 03 - description" value={c.point3Body ?? ""} onChange={(e) => set("point3Body", e.target.value)} />
        <AdminInput label="Button text" value={c.ctaText ?? ""} onChange={(e) => set("ctaText", e.target.value)} />
        <AdminInput label="Form label" value={c.formTitle ?? ""} onChange={(e) => set("formTitle", e.target.value)} />
        <AdminInput label="Success title" value={c.formSuccessTitle ?? ""} onChange={(e) => set("formSuccessTitle", e.target.value)} />
        <AdminTextarea label="Success body" rows={2} value={c.formSuccessBody ?? ""} onChange={(e) => set("formSuccessBody", e.target.value)} />
      </div>
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
          Autoplay, muted, looped. Source frame: 1920×840 (16:7) on desktop, tablet and mobile.
          Do not crop differently per device - the same wide frame is shown everywhere.
        </p>
        <MediaUploadField
          label="Desktop video"
          value={form.video}
          onChange={(v) => set("video", v)}
          folder="featured"
          mode="video"
          hint="MP4 or WebM, max 50MB. Exact frame 1920×840 (16:7)."
        />
        <MediaUploadField
          label="Mobile video (optional)"
          value={form.videoMobile}
          onChange={(v) => set("videoMobile", v)}
          folder="featured"
          mode="video"
          hint="Optional lighter file for phones - same 1920×840 (16:7) frame, not vertical."
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
