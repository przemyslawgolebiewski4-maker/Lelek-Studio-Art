"use client";

import {
  AdminInput,
  AdminTextarea,
} from "@/components/admin/AdminShell";
import { AdminReorderControls, moveItem } from "@/components/admin/AdminFieldHelpers";
import { MediaUploadField } from "@/components/admin/MediaUploadField";
import { MEDIA_HINTS } from "@/lib/media-hints";
import type { ElementItem } from "@/types/content";

export type HeroFormData = {
  eyebrow: string;
  subheadline: string;
  brandline: string;
  kozodoj: string;
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
    subheadline: c.subheadline ?? "",
    brandline: c.brandline ?? "",
    kozodoj: c.kozodoj ?? "",
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
        Fields follow the public hero top-to-bottom: media first, then eyebrow / brand / subline, then CTAs.
        Save this section to publish - the &quot;Visible on site&quot; toggle above controls whether the live homepage uses this content.
      </p>

      <div className="admin-field-group">
        <h3 className="admin-group-title">1. Media (poster / video)</h3>
        <MediaUploadField
          label="Desktop image (poster / LCP)"
          value={form.image}
          onChange={(v) => set("image", v)}
          folder="hero"
          hint={MEDIA_HINTS.heroDesktopImage}
        />
        <AdminInput
          label="Alt text for desktop / poster image"
          value={form.imageAlt}
          onChange={(e) => set("imageAlt", e.target.value)}
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
      </div>

      <div className="admin-field-group">
        <h3 className="admin-group-title">2. Text (as on the page)</h3>
        <AdminInput label="Eyebrow" value={form.eyebrow} onChange={(e) => set("eyebrow", e.target.value)} placeholder="Design through material." />
        <AdminInput label="Brand line (main heading)" value={form.brandline} onChange={(e) => set("brandline", e.target.value)} placeholder="LELEK - Berlin." />
        <AdminTextarea label="Subline" rows={2} value={form.subheadline} onChange={(e) => set("subheadline", e.target.value)} placeholder="Ceramic objects, vessels, prints." />
        <AdminInput
          label="Kozodoj line (under elements, if elements shown)"
          value={form.kozodoj}
          onChange={(e) => set("kozodoj", e.target.value)}
          placeholder="Lelek - kozodoj - the nightjar - Slavic spirit"
        />
      </div>

      <div className="admin-field-group">
        <h3 className="admin-group-title">3. Buttons</h3>
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
  originalsEyebrow: string;
  originalsHeading: string;
  originalsIntro: string;
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
    originalsEyebrow: c.originalsEyebrow ?? "Originals",
    originalsHeading: c.originalsHeading ?? "One-of-a-kind pieces",
    originalsIntro:
      c.originalsIntro ??
      "Sculptural and statement works available by inquiry - not sold through the shop.",
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
        <AdminInput
          label="Alt text for image / poster"
          value={form.imageAlt}
          onChange={(e) => set("imageAlt", e.target.value)}
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
      </div>

      <div className="admin-field-group">
        <h3 className="admin-group-title">Bio copy</h3>
        <p className="admin-muted">
          Paragraph 1 also appears as the homepage Story teaser. Paragraphs 2-3 and the signature appear only on /about.
        </p>
        <AdminInput label="Eyebrow" value={form.eyebrow} onChange={(e) => set("eyebrow", e.target.value)} />
        <AdminInput label="Heading" value={form.heading} onChange={(e) => set("heading", e.target.value)} />
        <AdminInput label="Heading emphasis (italic)" value={form.headingEm} onChange={(e) => set("headingEm", e.target.value)} />
        <AdminTextarea label="Paragraph 1 (homepage teaser + About)" rows={3} value={form.body1} onChange={(e) => set("body1", e.target.value)} />
        <AdminTextarea label="Paragraph 2 (About only)" rows={3} value={form.body2} onChange={(e) => set("body2", e.target.value)} />
        <AdminTextarea label="Paragraph 3 (About only)" rows={3} value={form.body3} onChange={(e) => set("body3", e.target.value)} />
        <AdminInput label="Signature" value={form.signature} onChange={(e) => set("signature", e.target.value)} />
      </div>

      <div className="admin-field-group">
        <h3 className="admin-group-title">About CTAs</h3>
        <p className="admin-muted">
          Both buttons render on /about. Hrefs stay fixed (Shop URL from env / /for-architects). Edit labels only.
        </p>
        <AdminInput
          label='Primary CTA label (default: "Shop the collections")'
          value={form.ctaShopLabel}
          onChange={(e) => set("ctaShopLabel", e.target.value)}
        />
        <AdminInput
          label='Secondary CTA label (default: "Designing a space?")'
          value={form.ctaTradeLabel}
          onChange={(e) => set("ctaTradeLabel", e.target.value)}
        />
      </div>

      <div className="admin-field-group">
        <h3 className="admin-group-title">Originals section chrome</h3>
        <p className="admin-muted">
          Heading block above the Originals product grid on /about. Pieces themselves are managed under
          Products (flag &quot;Original&quot;).
        </p>
        <AdminInput
          label="Eyebrow"
          value={form.originalsEyebrow}
          onChange={(e) => set("originalsEyebrow", e.target.value)}
        />
        <AdminInput
          label="Heading"
          value={form.originalsHeading}
          onChange={(e) => set("originalsHeading", e.target.value)}
        />
        <AdminTextarea
          label="Intro"
          rows={2}
          value={form.originalsIntro}
          onChange={(e) => set("originalsIntro", e.target.value)}
        />
      </div>

      <div className="admin-field-group">
        <h3 className="admin-group-title">About gallery</h3>
        <p className="admin-muted">
          Sculpture / original-work photos. Alt text sits under each image. Reorder with Move up / Move down.
        </p>
        {form.gallery.length === 0 ? (
          <p className="admin-muted">No gallery images yet - add the first photo below.</p>
        ) : null}
        {form.gallery.map((item, i) => (
          <div key={i} className="admin-field-group" style={{ borderTop: "1px solid rgba(11,10,8,0.12)", paddingTop: 12 }}>
            <MediaUploadField
              label={`Gallery image ${i + 1}`}
              value={item.image}
              onChange={(v) => updateGallery(i, { image: v })}
              folder="story"
            />
            <AdminInput
              label={`Alt text for image ${i + 1}`}
              value={item.alt}
              onChange={(e) => updateGallery(i, { alt: e.target.value })}
            />
            <AdminReorderControls
              index={i}
              total={form.gallery.length}
              onMove={(from, to) => set("gallery", moveItem(form.gallery, from, to))}
              onRemove={() => removeGalleryItem(i)}
            />
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
    items.push({
      number: ["I.", "II.", "III.", "IV."][items.length] ?? "",
      name: "",
      description: "",
    });
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
      <p className="admin-muted">
        Fixed four slots (Earth / Water / Fire / Air) matching the public bar. Use &quot;Visible on site&quot;
        above to show or hide this section on the homepage after you Save.
      </p>
      <AdminInput
        label="Scope note (above bar)"
        value={scopeNote}
        onChange={(e) => onChange({ ...content, items, scopeNote: e.target.value })}
      />
      {items.map((item, i) => (
        <div key={i} className="admin-field-group" style={{ borderTop: "1px solid rgba(11,10,8,0.12)", paddingTop: 12 }}>
          <h3 className="admin-group-title">Element {i + 1}</h3>
          <div className="admin-form-row-2">
            <AdminInput
              label="Number / index"
              value={item.number}
              onChange={(e) => updateItem(i, { number: e.target.value })}
            />
            <AdminInput
              label="Label (e.g. Earth)"
              value={item.name}
              onChange={(e) => updateItem(i, { name: e.target.value })}
            />
          </div>
          <AdminInput
            label="Short description (optional)"
            value={item.description ?? ""}
            onChange={(e) => updateItem(i, { description: e.target.value })}
          />
          <AdminReorderControls
            index={i}
            total={items.length}
            onMove={(from, to) =>
              onChange({ ...content, items: moveItem(items, from, to), scopeNote })
            }
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
        Wayfinding below the hero. Exactly four cards by design (Shop / About / Process / Trade) -
        matching the fixed destinations. Reorder with Move up / Move down; labels and links stay editable.
        Tip: keep the Shop card link in sync with Admin → Settings → Shop URL (or paste that URL here).
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
          <AdminReorderControls
            index={i}
            total={cards.length}
            onMove={(from, to) =>
              onChange({ intro, tradeSignal, tradeHref, cards: moveItem(cards, from, to) })
            }
          />
        </div>
      ))}
    </div>
  );
}

type TradePoint = { title: string; body: string };

function tradePointsFromContent(content: Record<string, unknown>): TradePoint[] {
  const c = content as Record<string, string>;
  if (Array.isArray(content.points) && content.points.length > 0) {
    return (content.points as TradePoint[]).map((p) => ({
      title: p.title ?? "",
      body: p.body ?? "",
    }));
  }
  return [
    { title: c.point1Title ?? "", body: c.point1Body ?? "" },
    { title: c.point2Title ?? "", body: c.point2Body ?? "" },
    { title: c.point3Title ?? "", body: c.point3Body ?? "" },
  ];
}

function tradeContentWithPoints(
  content: Record<string, unknown>,
  points: TradePoint[],
): Record<string, unknown> {
  // Keep legacy keys in sync so older public fallbacks still work
  return {
    ...content,
    points,
    point1Title: points[0]?.title ?? "",
    point1Body: points[0]?.body ?? "",
    point2Title: points[1]?.title ?? "",
    point2Body: points[1]?.body ?? "",
    point3Title: points[2]?.title ?? "",
    point3Body: points[2]?.body ?? "",
  };
}

export function TradeSectionEditor({
  content,
  onChange,
}: {
  content: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
}) {
  const c = content as Record<string, string>;
  const points = tradePointsFromContent(content);

  function set(key: string, value: string) {
    onChange({ ...content, [key]: value });
  }

  function updatePoint(index: number, patch: Partial<TradePoint>) {
    const next = points.map((p, i) => (i === index ? { ...p, ...patch } : p));
    onChange(tradeContentWithPoints(content, next));
  }

  return (
    <div className="admin-form-stack-lg">
      <p className="admin-muted">
        Order matches /for-architects: hero media → intro → service points → closing note → inquiry form.
        Empty point fields fall back to seeded defaults on the public page.
      </p>

      <div className="admin-field-group">
        <h3 className="admin-group-title">1. Trade page hero</h3>
        <MediaUploadField
          label="Hero image"
          value={c.heroImage ?? ""}
          onChange={(v) => set("heroImage", v)}
          folder="architects"
        />
        <AdminInput
          label="Alt text for hero image"
          value={c.heroImageAlt ?? ""}
          onChange={(e) => set("heroImageAlt", e.target.value)}
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
        <AdminTextarea
          label="Hero caption"
          rows={2}
          value={c.heroCaption ?? ""}
          onChange={(e) => set("heroCaption", e.target.value)}
        />
      </div>

      <div className="admin-field-group">
        <h3 className="admin-group-title">2. Intro</h3>
        <AdminInput label="Eyebrow" value={c.eyebrow ?? ""} onChange={(e) => set("eyebrow", e.target.value)} />
        <AdminInput label="Headline line 1" value={c.headline ?? ""} onChange={(e) => set("headline", e.target.value)} />
        <AdminInput label="Headline line 2 (italic)" value={c.headlineEm ?? ""} onChange={(e) => set("headlineEm", e.target.value)} />
        <AdminTextarea
          label='Intro paragraph (e.g. "Objects already made...")'
          rows={3}
          value={c.sub ?? ""}
          onChange={(e) => set("sub", e.target.value)}
        />
      </div>

      <div className="admin-field-group">
        <h3 className="admin-group-title">3. Service points</h3>
        <p className="admin-muted">
          Typically three points (01 / 02 / 03). Add, remove, or reorder with Move up / Move down.
        </p>
        {points.length === 0 ? (
          <p className="admin-muted">No points yet - add the first service point below.</p>
        ) : null}
        {points.map((point, i) => (
          <div
            key={i}
            className="admin-field-group"
            style={{ borderTop: "1px solid rgba(11,10,8,0.12)", paddingTop: 12 }}
          >
            <h3 className="admin-group-title">
              Point {String(i + 1).padStart(2, "0")}
            </h3>
            <AdminInput
              label="Title"
              value={point.title}
              onChange={(e) => updatePoint(i, { title: e.target.value })}
              placeholder={i === 0 ? "Wall objects" : undefined}
            />
            <AdminTextarea
              label="Description"
              rows={2}
              value={point.body}
              onChange={(e) => updatePoint(i, { body: e.target.value })}
            />
            <AdminReorderControls
              index={i}
              total={points.length}
              onMove={(from, to) =>
                onChange(tradeContentWithPoints(content, moveItem(points, from, to)))
              }
              onRemove={() =>
                onChange(
                  tradeContentWithPoints(
                    content,
                    points.filter((_, idx) => idx !== i),
                  ),
                )
              }
            />
          </div>
        ))}
        <button
          type="button"
          className="admin-btn"
          onClick={() =>
            onChange(tradeContentWithPoints(content, [...points, { title: "", body: "" }]))
          }
        >
          Add point
        </button>
        <AdminTextarea
          label="Closing collaboration note"
          rows={3}
          value={c.closingNote ?? ""}
          onChange={(e) => set("closingNote", e.target.value)}
        />
      </div>

      <div className="admin-field-group">
        <h3 className="admin-group-title">4. Project inquiry form</h3>
        <AdminInput
          label="Form section eyebrow"
          value={c.formEyebrow ?? ""}
          onChange={(e) => set("formEyebrow", e.target.value)}
          placeholder="Project inquiry"
        />
        <AdminTextarea
          label="Form intro text"
          rows={3}
          value={c.formIntro ?? ""}
          onChange={(e) => set("formIntro", e.target.value)}
          placeholder="Tell us about your project - wall objects, vessels, or custom dimensions..."
        />
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
      <p className="admin-muted">
        Homepage Find block + footer brand tagline. Online shop destination uses Admin → Settings → Shop URL.
      </p>
      <div className="admin-field-group">
        <h3 className="admin-group-title">Find us</h3>
        <AdminInput label="Studio name" value={c.studioName ?? ""} onChange={(e) => set("studioName", e.target.value)} />
        <AdminTextarea label="Studio address" rows={3} value={c.studioAddress ?? ""} onChange={(e) => set("studioAddress", e.target.value)} />
        <AdminTextarea
          label="Open days note"
          rows={2}
          value={c.openDaysNote ?? ""}
          onChange={(e) => set("openDaysNote", e.target.value)}
          placeholder="Available during open days and selected sales events..."
        />
        <AdminInput label="Instagram handle (display)" value={c.studioInstagram ?? ""} onChange={(e) => set("studioInstagram", e.target.value)} />
        <AdminInput label="Instagram URL" value={c.studioInstagramUrl ?? ""} onChange={(e) => set("studioInstagramUrl", e.target.value)} />
      </div>
      <div className="admin-field-group">
        <h3 className="admin-group-title">Online / Shop block</h3>
        <AdminInput
          label="Online heading"
          value={c.onlineHeading ?? ""}
          onChange={(e) => set("onlineHeading", e.target.value)}
          placeholder="Shop"
        />
        <AdminTextarea
          label="Online description"
          rows={3}
          value={c.onlineDescription ?? ""}
          onChange={(e) => set("onlineDescription", e.target.value)}
        />
        <AdminInput
          label="Online CTA label"
          value={c.onlineCtaLabel ?? ""}
          onChange={(e) => set("onlineCtaLabel", e.target.value)}
          placeholder="Visit shop ↗"
        />
        <p className="admin-muted">
          Shop destination URL is edited in Admin → Settings → Shop URL (not here).
        </p>
      </div>
      <AdminInput
        label="Brand tagline (footer - e.g. Lelek - kozodoj - the nightjar)"
        value={c.lelekMeaning ?? ""}
        onChange={(e) => set("lelekMeaning", e.target.value)}
      />
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
