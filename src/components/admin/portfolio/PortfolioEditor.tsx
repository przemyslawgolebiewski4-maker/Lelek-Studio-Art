"use client";

import { CmsLangField } from "@/components/admin/BilingualField";
import { MediaUploadField } from "@/components/admin/MediaUploadField";
import { AdminInput } from "@/components/admin/AdminShell";

export function PortfolioEditor({
  content,
  onChange,
}: {
  content: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
}) {
  return (
    <div className="admin-field-group">
      <p className="admin-muted">
        Public page: przemyslawgolebiewski.lelekstudio.com. Banner, menu and page text are saved here.
        Galleries lists partners from Admin → Galleries. Photographs come from Products flagged Portfolio.
        The footer still uses Lelek Studio settings (name, city, email, Instagram, shop).
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
      <p className="admin-muted">
        The partner list is Admin → Galleries. Photographs are every image on a published product with
        the Portfolio flag.
      </p>
      <CmsLangField content={content} onChange={onChange} name="galleriesHeading" label="Heading" />
      <CmsLangField content={content} onChange={onChange} name="galleriesIntro" label="Intro" multiline rows={3} />

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
