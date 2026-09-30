"use client";

import {
  AdminInput,
  AdminTextarea,
} from "@/components/admin/AdminShell";
import { CmsLangField, LangPair } from "@/components/admin/BilingualField";
import { suggestPl } from "@/lib/i18n/dictionary";
import { AdminReorderControls, moveItem } from "@/components/admin/AdminFieldHelpers";
import { MediaUploadField } from "@/components/admin/MediaUploadField";
import { MEDIA_HINTS } from "@/lib/media-hints";
import type { ElementItem } from "@/types/content";

export type HeroFormData = {
  eyebrow: string;
  subheadline: string;
  semanticCore: string;
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
  const c = content as Record<string, unknown>;
  const str = (key: keyof HeroFormData) =>
    typeof c[key] === "string" ? (c[key] as string) : "";

  return {
    eyebrow: str("eyebrow"),
    subheadline: str("subheadline"),
    semanticCore: str("semanticCore"),
    brandline: str("brandline"),
    kozodoj: str("kozodoj"),
    image: str("image"),
    imageMobile: str("imageMobile"),
    video: str("video"),
    videoMobile: str("videoMobile"),
    imageAlt: str("imageAlt"),
    imageCaption: str("imageCaption"),
    cta1Text: str("cta1Text"),
    cta1Url: str("cta1Url") || "/about",
    cta2Text: str("cta2Text"),
    cta2Url: str("cta2Url") || "/about",
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
    onChange({ ...content, ...heroFromForm({ ...heroToForm(content), [key]: value }) });
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
        <CmsLangField content={content} onChange={onChange} name="imageAlt" label="Alt text for desktop / poster image" />
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
        <CmsLangField content={content} onChange={onChange} name="imageCaption" label="Media caption" />
      </div>

      <div className="admin-field-group">
        <h3 className="admin-group-title">2. Text (as on the page)</h3>
        <CmsLangField content={content} onChange={onChange} name="eyebrow" label="Eyebrow" placeholder="The process comes first." fallbackEn="The process comes first." />
        <CmsLangField content={content} onChange={onChange} name="brandline" label="Brand line (main heading)" placeholder="LELEK - Berlin." fallbackEn="LELEK - Berlin." />
        <CmsLangField content={content} onChange={onChange} name="subheadline" label="Subline" multiline rows={2} placeholder="Vessels, cups, lamps - organic and raw, shaped by hand, never exactly." fallbackEn="Vessels, cups, lamps - organic and raw, shaped by hand, never exactly." />
        <CmsLangField
          content={content}
          onChange={onChange}
          name="semanticCore"
          label="Semantic core sentence"
          placeholder="Przemysław Gołębiewski is a self-taught ceramist, working by intuition rather than plan."
          fallbackEn="Przemysław Gołębiewski is a self-taught ceramist, working by intuition rather than plan. The process comes first, always - the hand moves, the mind follows after."
        />
        <p className="admin-field-hint">
          One sentence under the hero subline - this is the entity Google should read. Keep it third person: &quot;Przemysław Gołębiewski is a self-taught ceramist…&quot; Empty uses the site default.
        </p>
        <CmsLangField
          content={content}
          onChange={onChange}
          name="kozodoj"
          label="Elements tagline (under elements, if elements shown)"
          multiline
          rows={2}
          placeholder="The hand moves, the mind follows after."
          fallbackEn="The hand moves, the mind follows after."
        />
        <p className="admin-field-hint">
          Editable text field - appears under Earth / Water / Fire / Air when the Elements section is visible on the homepage.
        </p>
      </div>

      <div className="admin-field-group">
        <h3 className="admin-group-title">3. Buttons</h3>
        <div className="admin-form-row-2">
          <CmsLangField content={content} onChange={onChange} name="cta1Text" label="Primary CTA text" fallbackEn="Shop" />
          <AdminInput label="Primary CTA link" value={form.cta1Url} onChange={(e) => set("cta1Url", e.target.value)} />
        </div>
        <div className="admin-form-row-2">
          <CmsLangField content={content} onChange={onChange} name="cta2Text" label="Secondary CTA text" fallbackEn="About" />
          <AdminInput label="Secondary CTA link" value={form.cta2Url} onChange={(e) => set("cta2Url", e.target.value)} />
        </div>
      </div>
    </div>
  );
}

export type StoryGalleryItem = { image: string; alt: string; altPl?: string };

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
    originalsHeading: c.originalsHeading ?? "Shaped by hand, not by mold",
    originalsIntro:
      c.originalsIntro ??
      "Some forms repeat - vessels, cups, lamps - but never exactly. Each one carries its own small differences.",
    gallery: rawGallery.map((g) => ({
      image: g.image ?? "",
      alt: g.alt ?? "",
      altPl: g.altPl ?? "",
    })),
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
    onChange({ ...content, ...storyFromForm({ ...storyToForm(content), [key]: value }) });
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
        Story / About - homepage shows paragraph 1 only. The full page is published at
        przemyslawgolebiewski.lelekstudio.com (paragraphs, gallery, CTAs and Originals).
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
        <CmsLangField content={content} onChange={onChange} name="imageAlt" label="Alt text for image / poster" fallbackEn="Przemysław Gołębiewski, self-taught ceramist at work in Berlin" />
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
        <CmsLangField content={content} onChange={onChange} name="imageCaption" label="Caption" />
      </div>

      <div className="admin-field-group">
        <h3 className="admin-group-title">Bio copy</h3>
        <p className="admin-muted">
          Paragraph 1 also appears as the homepage Story teaser and should stay third person:
          &quot;Przemysław Gołębiewski is a self-taught ceramist…&quot; so Google can read the maker.
          Paragraphs 2-3 and the signature appear only on /about (first person, core voice).
        </p>
        <CmsLangField content={content} onChange={onChange} name="eyebrow" label="Eyebrow" fallbackEn="The ceramist" />
        <CmsLangField content={content} onChange={onChange} name="heading" label="Heading" fallbackEn="The process comes first," />
        <CmsLangField content={content} onChange={onChange} name="headingEm" label="Heading emphasis (italic)" fallbackEn="always" />
        <CmsLangField content={content} onChange={onChange} name="body1" label="Paragraph 1 (homepage teaser + About)" multiline rows={4} />
        <CmsLangField content={content} onChange={onChange} name="body2" label="Paragraph 2 (About only)" multiline rows={4} />
        <CmsLangField content={content} onChange={onChange} name="body3" label="Paragraph 3 (About only)" multiline rows={4} />
        <CmsLangField content={content} onChange={onChange} name="signature" label="Signature" fallbackEn="Przemysław Gołębiewski - ceramist" />
      </div>

      <div className="admin-field-group">
        <h3 className="admin-group-title">About CTAs</h3>
        <p className="admin-muted">
          Both buttons render on /about. Hrefs stay fixed (Shop URL from env / /for-architects). Edit labels only.
        </p>
        <CmsLangField content={content} onChange={onChange} name="ctaShopLabel" label='Primary CTA label (default: "Shop the collections")' fallbackEn="Shop the collections" />
        <CmsLangField content={content} onChange={onChange} name="ctaTradeLabel" label='Secondary CTA label (default: "Designing a space?")' fallbackEn="Designing a space?" />
      </div>

      <div className="admin-field-group">
        <h3 className="admin-group-title">Originals section chrome</h3>
        <p className="admin-muted">
          Heading block above the Originals product grid on /about. Pieces themselves are managed under
          Products (flag &quot;Original&quot;).
        </p>
        <CmsLangField content={content} onChange={onChange} name="originalsEyebrow" label="Eyebrow" fallbackEn="Originals" />
        <CmsLangField content={content} onChange={onChange} name="originalsHeading" label="Heading" fallbackEn="Shaped by hand, not by mold" />
        <CmsLangField content={content} onChange={onChange} name="originalsIntro" label="Intro" multiline rows={2} fallbackEn="Some forms repeat - vessels, cups, lamps - but never exactly. Each one carries its own small differences." />
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
            <LangPair
              label={`Alt text for image ${i + 1}`}
              en={item.alt}
              pl={item.altPl || suggestPl(item.alt)}
              onEn={(value) => updateGallery(i, { alt: value })}
              onPl={(value) => updateGallery(i, { altPl: value })}
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
      : "Stoneware shaped by hand, not by mold - organic and raw, shown below in the studio's four elements: earth, water, fire, air.";

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
      <CmsLangField
        content={{ ...content, scopeNote }}
        onChange={(next) => onChange({ ...next, items })}
        name="scopeNote"
        label="Scope note (above bar)"
        fallbackEn="Stoneware shaped by hand, not by mold - organic and raw, shown below in the studio's four elements: earth, water, fire, air."
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
            <LangPair
              label="Label (e.g. Earth)"
              en={item.name}
              pl={item.namePl || suggestPl(item.name)}
              onEn={(value) => updateItem(i, { name: value })}
              onPl={(value) => updateItem(i, { namePl: value })}
            />
          </div>
          <LangPair
            label="Short description (optional)"
            en={item.description ?? ""}
            pl={item.descriptionPl || suggestPl(item.description)}
            onEn={(value) => updateItem(i, { description: value })}
            onPl={(value) => updateItem(i, { descriptionPl: value })}
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
  labelPl?: string;
  descriptionPl?: string;
};

export function SignpostSectionEditor({
  content,
  onChange,
}: {
  content: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
}) {
  const tradeHref = typeof content.tradeHref === "string" ? content.tradeHref : "/for-architects";
  const cards = (
    Array.isArray(content.cards) ? (content.cards as SignpostCardForm[]) : []
  ).slice(0, 4);
  while (cards.length < 4) {
    cards.push({ label: "", description: "", href: "" });
  }

  function updateCard(index: number, patch: Partial<SignpostCardForm>) {
    const next = cards.map((card, i) => (i === index ? { ...card, ...patch } : card));
    onChange({ ...content, cards: next });
  }

  function setScalar(key: "intro" | "tradeSignal" | "tradeHref", value: string) {
    onChange({ ...content, [key]: value });
  }

  return (
    <div className="admin-form-stack-lg">
      <p className="admin-muted">
        Wayfinding below the hero. Exactly four cards by design (Shop / About / Process / Trade) -
        matching the fixed destinations. Reorder with Move up / Move down; labels and links stay editable.
        Tip: keep the Shop card link in sync with Admin → Settings → Shop URL (or paste that URL here).
      </p>
      <CmsLangField content={content} onChange={onChange} name="intro" label="Intro paragraph" multiline rows={3} />
      <CmsLangField content={content} onChange={onChange} name="tradeSignal" label="Trade signal text" fallbackEn="Designing a space? Let's talk" />
      <AdminInput
        label="Trade signal link"
        value={tradeHref}
        onChange={(e) => setScalar("tradeHref", e.target.value)}
      />
      {cards.map((card, i) => (
        <div key={i} className="admin-field-group">
          <h3 className="admin-group-title">Card {i + 1}</h3>
          <LangPair
            label="Label"
            en={card.label}
            pl={card.labelPl || suggestPl(card.label)}
            onEn={(value) => updateCard(i, { label: value })}
            onPl={(value) => updateCard(i, { labelPl: value })}
          />
          <LangPair
            label="Description"
            en={card.description}
            pl={card.descriptionPl || suggestPl(card.description)}
            multiline
            rows={2}
            onEn={(value) => updateCard(i, { description: value })}
            onPl={(value) => updateCard(i, { descriptionPl: value })}
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
              onChange({ ...content, cards: moveItem(cards, from, to) })
            }
          />
        </div>
      ))}
    </div>
  );
}

type TradePoint = { title: string; body: string; titlePl?: string; bodyPl?: string };

function tradePointsFromContent(content: Record<string, unknown>): TradePoint[] {
  const c = content as Record<string, string>;
  if (Array.isArray(content.points) && content.points.length > 0) {
    return (content.points as TradePoint[]).map((p) => ({
      title: p.title ?? "",
      body: p.body ?? "",
      titlePl: p.titlePl ?? "",
      bodyPl: p.bodyPl ?? "",
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
        <CmsLangField content={content} onChange={onChange} name="heroImageAlt" label="Alt text for hero image" fallbackEn="Ceramic objects by Przemysław Gołębiewski for interiors" />
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
        <CmsLangField content={content} onChange={onChange} name="heroCaption" label="Hero caption" multiline rows={2} />
      </div>

      <div className="admin-field-group">
        <h3 className="admin-group-title">2. Intro</h3>
        <CmsLangField content={content} onChange={onChange} name="eyebrow" label="Eyebrow" fallbackEn="For architects & designers" />
        <CmsLangField content={content} onChange={onChange} name="headline" label="Headline line 1" fallbackEn="Objects for spaces" />
        <CmsLangField content={content} onChange={onChange} name="headlineEm" label="Headline line 2 (italic)" fallbackEn="that refuse the ordinary." />
        <CmsLangField
          content={content}
          onChange={onChange}
          name="sub"
          label="Intro paragraph (page sub)"
          multiline
          rows={5}
          placeholder="Each wall object, vessel and lamp exists as a singular form - shaped by intuition, not brief. Some pieces stay raw, closer to brutalism; others lean fully organic."
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
            <LangPair
              label="Title"
              en={point.title}
              pl={point.titlePl || suggestPl(point.title)}
              placeholder={i === 0 ? "Wall objects" : undefined}
              onEn={(value) => updatePoint(i, { title: value })}
              onPl={(value) => updatePoint(i, { titlePl: value })}
            />
            <LangPair
              label="Description"
              en={point.body}
              pl={point.bodyPl || suggestPl(point.body)}
              multiline
              rows={2}
              onEn={(value) => updatePoint(i, { body: value })}
              onPl={(value) => updatePoint(i, { bodyPl: value })}
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
        <CmsLangField content={content} onChange={onChange} name="closingNote" label="Closing collaboration note" multiline rows={3} />
      </div>

      <div className="admin-field-group">
        <h3 className="admin-group-title">4. Project inquiry form</h3>
        <CmsLangField content={content} onChange={onChange} name="formEyebrow" label="Form section eyebrow" placeholder="Project inquiry" fallbackEn="Project inquiry" />
        <CmsLangField
          content={content}
          onChange={onChange}
          name="formIntro"
          label="Form intro text"
          multiline
          rows={3}
          placeholder="Tell us about the space - scale, light, the works you're drawn to. We reply within a few business days."
          fallbackEn="Tell us about the space - scale, light, the works you're drawn to. We reply within a few business days."
        />
        <CmsLangField content={content} onChange={onChange} name="formSuccessTitle" label="Success title" fallbackEn="Message received." />
        <CmsLangField content={content} onChange={onChange} name="formSuccessBody" label="Success body" multiline rows={2} fallbackEn="We will get back to you within 1-2 working days." />
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
  return (
    <div className="admin-form-stack-lg">
      {description ? <p className="admin-muted">{description}</p> : null}
      {fields.map(({ key, label, multiline, hint }) => (
        <div key={key}>
          <CmsLangField
            content={content}
            onChange={onChange}
            name={key}
            label={label}
            multiline={multiline}
            rows={3}
          />
          {hint ? <p className="admin-field-hint">{hint}</p> : null}
        </div>
      ))}
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
        <CmsLangField content={content} onChange={onChange} name="studioName" label="Studio name" />
        <AdminTextarea label="Studio address" rows={3} value={c.studioAddress ?? ""} onChange={(e) => set("studioAddress", e.target.value)} />
        <CmsLangField
          content={content}
          onChange={onChange}
          name="openDaysNote"
          label="Open days note"
          multiline
          rows={2}
          placeholder="Available during open days and selected sales events..."
          fallbackEn="Available during open days and selected sales events. Follow Instagram for dates."
        />
        <AdminInput label="Instagram handle (display)" value={c.studioInstagram ?? ""} onChange={(e) => set("studioInstagram", e.target.value)} />
        <AdminInput label="Instagram URL" value={c.studioInstagramUrl ?? ""} onChange={(e) => set("studioInstagramUrl", e.target.value)} />
      </div>
      <div className="admin-field-group">
        <h3 className="admin-group-title">Online / Shop block</h3>
        <CmsLangField content={content} onChange={onChange} name="onlineHeading" label="Online heading" placeholder="Shop" fallbackEn="Shop" />
        <CmsLangField content={content} onChange={onChange} name="onlineDescription" label="Online description" multiline rows={3} fallbackEn="Vessels, cups, lamps and objects - each one a little different from the last." />
        <CmsLangField content={content} onChange={onChange} name="onlineCtaLabel" label="Online CTA label" placeholder="Visit shop ↗" fallbackEn="Visit shop ↗" />
        <p className="admin-muted">
          Shop destination URL is edited in Admin → Settings → Shop URL (not here).
        </p>
      </div>
      <CmsLangField
        content={content}
        onChange={onChange}
        name="lelekMeaning"
        label="Brand tagline (footer - e.g. The hand moves, the mind follows after.)"
        fallbackEn="The hand moves, the mind follows after."
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
    heading: c.heading ?? "Shaped by hand",
    headingEm: c.headingEm ?? "never exactly",
    video: c.video ?? "",
    videoMobile: c.videoMobile ?? "",
    videoAlt: c.videoAlt ?? "Ceramics by Przemysław Gołębiewski - Lelek Studio Berlin",
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
    onChange({ ...content, ...featuredFromForm({ ...featuredToForm(content), [key]: value }) });
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
        <CmsLangField content={content} onChange={onChange} name="heading" label="Heading line 1" fallbackEn="Shaped by hand" />
        <CmsLangField content={content} onChange={onChange} name="headingEm" label="Heading line 2 (italic)" fallbackEn="never exactly" />
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
        <CmsLangField content={content} onChange={onChange} name="videoAlt" label="Video alt text (accessibility)" fallbackEn="Ceramics by Przemysław Gołębiewski - Lelek Studio Berlin" />
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
