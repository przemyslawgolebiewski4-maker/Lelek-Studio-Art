"use client";

import { CmsLangField, LangPair } from "@/components/admin/BilingualField";
import { AdminReorderControls, moveItem } from "@/components/admin/AdminFieldHelpers";
import { MediaUploadField } from "@/components/admin/MediaUploadField";
import { AdminButton, AdminInput } from "@/components/admin/AdminShell";
import { suggestPl } from "@/lib/i18n/dictionary";

type WorkDraft = {
  image: string;
  title: string;
  titlePl: string;
  caption: string;
  captionPl: string;
  alt: string;
  altPl: string;
};

function asWorks(content: Record<string, unknown>): WorkDraft[] {
  if (!Array.isArray(content.works)) return [];
  return content.works.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const work = item as Record<string, unknown>;
    const read = (key: string) => (typeof work[key] === "string" ? (work[key] as string) : "");
    return [
      {
        image: read("image"),
        title: read("title"),
        titlePl: read("titlePl"),
        caption: read("caption"),
        captionPl: read("captionPl"),
        alt: read("alt"),
        altPl: read("altPl"),
      },
    ];
  });
}

export function PortfolioEditor({
  content,
  onChange,
}: {
  content: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
}) {
  const works = asWorks(content);

  function setWorks(next: WorkDraft[]) {
    onChange({ ...content, works: next });
  }

  function updateWork(index: number, patch: Partial<WorkDraft>) {
    setWorks(works.map((work, i) => (i === index ? { ...work, ...patch } : work)));
  }

  return (
    <div className="admin-field-group">
      <p className="admin-muted">
        Public page: przemyslawgolebiewski.lelekstudio.com. Every heading, label and photo on that
        page is saved here. The footer still uses Lelek Studio settings (name, city, email, Instagram, shop).
      </p>

      <h3 className="admin-group-title">Banner</h3>
      <CmsLangField content={content} onChange={onChange} name="name" label="Name" />
      <CmsLangField
        content={content}
        onChange={onChange}
        name="role"
        label="Role"
        placeholder="visual artist"
      />
      <MediaUploadField
        label="Banner photo"
        value={typeof content.bannerImage === "string" ? content.bannerImage : ""}
        onChange={(url) => onChange({ ...content, bannerImage: url })}
        folder="portfolio"
        hint="Still image. Also used as the film poster."
      />
      <MediaUploadField
        label="Banner film"
        value={typeof content.bannerVideo === "string" ? content.bannerVideo : ""}
        onChange={(url) => onChange({ ...content, bannerVideo: url })}
        folder="portfolio"
        mode="video"
        hint="Optional loop. When a film is set, it plays over the photo."
      />
      <CmsLangField content={content} onChange={onChange} name="bannerAlt" label="Banner description" />
      <CmsLangField content={content} onChange={onChange} name="intro" label="Intro under the banner" multiline rows={4} />

      <h3 className="admin-group-title">Menu</h3>
      <CmsLangField content={content} onChange={onChange} name="navAbout" label="About label" />
      <CmsLangField content={content} onChange={onChange} name="navGalleries" label="Galleries label" />
      <CmsLangField content={content} onChange={onChange} name="navContact" label="Contact label" />

      <h3 className="admin-group-title">About</h3>
      <CmsLangField content={content} onChange={onChange} name="aboutHeading" label="Heading" />
      <CmsLangField content={content} onChange={onChange} name="aboutBody" label="Text" multiline rows={8} />
      <MediaUploadField
        label="Portrait"
        value={typeof content.aboutImage === "string" ? content.aboutImage : ""}
        onChange={(url) => onChange({ ...content, aboutImage: url })}
        folder="portfolio"
      />
      <CmsLangField content={content} onChange={onChange} name="aboutImageAlt" label="Portrait description" />

      <h3 className="admin-group-title">Galleries</h3>
      <CmsLangField content={content} onChange={onChange} name="galleriesHeading" label="Heading" />
      <CmsLangField content={content} onChange={onChange} name="galleriesIntro" label="Intro" multiline rows={3} />
      {works.length === 0 ? <p className="admin-muted">No works yet. Add the first photograph below.</p> : null}
      {works.map((work, index) => (
        <div key={index} className="admin-field-group" style={{ borderTop: "1px solid rgba(11,10,8,0.12)", paddingTop: 12 }}>
          <MediaUploadField
            label={`Work ${index + 1}`}
            value={work.image}
            onChange={(url) => updateWork(index, { image: url })}
            folder="portfolio"
          />
          <LangPair
            label="Title"
            en={work.title}
            pl={work.titlePl || suggestPl(work.title)}
            onEn={(value) => updateWork(index, { title: value })}
            onPl={(value) => updateWork(index, { titlePl: value })}
          />
          <LangPair
            label="Caption"
            en={work.caption}
            pl={work.captionPl || suggestPl(work.caption)}
            onEn={(value) => updateWork(index, { caption: value })}
            onPl={(value) => updateWork(index, { captionPl: value })}
          />
          <LangPair
            label="Description"
            en={work.alt}
            pl={work.altPl || suggestPl(work.alt)}
            onEn={(value) => updateWork(index, { alt: value })}
            onPl={(value) => updateWork(index, { altPl: value })}
          />
          <AdminReorderControls
            index={index}
            total={works.length}
            onMove={(from, to) => setWorks(moveItem(works, from, to))}
            onRemove={() => setWorks(works.filter((_, i) => i !== index))}
          />
        </div>
      ))}
      <AdminButton
        variant="ghost"
        onClick={() =>
          setWorks([
            ...works,
            { image: "", title: "", titlePl: "", caption: "", captionPl: "", alt: "", altPl: "" },
          ])
        }
      >
        Add work
      </AdminButton>

      <h3 className="admin-group-title">Contact</h3>
      <CmsLangField content={content} onChange={onChange} name="contactHeading" label="Heading" />
      <CmsLangField content={content} onChange={onChange} name="contactBody" label="Text" multiline rows={4} />
      <AdminInput
        label="Email"
        value={typeof content.contactEmail === "string" ? content.contactEmail : ""}
        placeholder="Leave empty to use the studio email from Settings"
        onChange={(event) => onChange({ ...content, contactEmail: event.target.value })}
      />
    </div>
  );
}
