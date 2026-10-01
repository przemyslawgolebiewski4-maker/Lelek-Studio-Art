"use client";

import { CmsLangField, LangPair } from "@/components/admin/BilingualField";
import { AdminReorderControls, moveItem } from "@/components/admin/AdminFieldHelpers";
import { MediaUploadField } from "@/components/admin/MediaUploadField";
import { AdminButton, AdminInput, AdminTextarea } from "@/components/admin/AdminShell";
import { suggestPl } from "@/lib/i18n/dictionary";

type FaqDraft = {
  question: string;
  questionPl: string;
  answer: string;
  answerPl: string;
};

function asFaqs(content: Record<string, unknown>): FaqDraft[] {
  if (!Array.isArray(content.aeoItems)) return [];
  return content.aeoItems.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const row = item as Record<string, unknown>;
    const read = (key: string) => (typeof row[key] === "string" ? (row[key] as string) : "");
    return [
      {
        question: read("question"),
        questionPl: read("questionPl"),
        answer: read("answer"),
        answerPl: read("answerPl"),
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
  const faqs = asFaqs(content);

  function setFaqs(next: FaqDraft[]) {
    onChange({ ...content, aeoItems: next });
  }

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
        The partner list is Admin → Galleries. Each Portfolio product shows its first photograph.
        Sold out appears as a private collection. A gallery assignment links the photo to that gallery.
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

      <h3 className="admin-group-title">Search (SEO)</h3>
      <p className="admin-muted">
        Titles and descriptions for Google. Leave a field empty to use the page heading and the intro.
        Keywords apply to every portfolio page.
      </p>
      <CmsLangField content={content} onChange={onChange} name="seoTitle" label="Home title" />
      <CmsLangField content={content} onChange={onChange} name="seoDescription" label="Home description" multiline rows={3} />
      <CmsLangField content={content} onChange={onChange} name="seoKeywords" label="Keywords" multiline rows={2} placeholder="Separate with commas" />
      <CmsLangField content={content} onChange={onChange} name="aboutSeoTitle" label="About title" />
      <CmsLangField content={content} onChange={onChange} name="aboutSeoDescription" label="About description" multiline rows={3} />
      <CmsLangField content={content} onChange={onChange} name="galleriesSeoTitle" label="Galleries title" />
      <CmsLangField content={content} onChange={onChange} name="galleriesSeoDescription" label="Galleries description" multiline rows={3} />
      <CmsLangField content={content} onChange={onChange} name="contactSeoTitle" label="Contact title" />
      <CmsLangField content={content} onChange={onChange} name="contactSeoDescription" label="Contact description" multiline rows={3} />

      <h3 className="admin-group-title">Generative engines (GEO)</h3>
      <p className="admin-muted">
        A short factual summary and place that AI search can cite. Extra profile links, one URL per line.
        Instagram and the shop are added automatically.
      </p>
      <CmsLangField content={content} onChange={onChange} name="geoSummary" label="Entity summary" multiline rows={4} />
      <CmsLangField content={content} onChange={onChange} name="geoPlace" label="Place" />
      <AdminTextarea
        label="More profile links"
        rows={3}
        value={typeof content.geoSameAs === "string" ? content.geoSameAs : ""}
        placeholder="https://"
        onChange={(event) => onChange({ ...content, geoSameAs: event.target.value })}
      />

      <h3 className="admin-group-title">Answer engines (AEO)</h3>
      <p className="admin-muted">
        One direct answer, plus further questions. Filled pairs are published as FAQ data for answer engines.
      </p>
      <CmsLangField content={content} onChange={onChange} name="aeoQuestion" label="Primary question" />
      <CmsLangField content={content} onChange={onChange} name="aeoAnswer" label="Primary answer" multiline rows={4} />
      {faqs.map((item, index) => (
        <div key={index} className="admin-field-group" style={{ borderTop: "1px solid rgba(11,10,8,0.12)", paddingTop: 12 }}>
          <LangPair
            label={`Question ${index + 1}`}
            en={item.question}
            pl={item.questionPl || suggestPl(item.question)}
            onEn={(value) => setFaqs(faqs.map((row, i) => (i === index ? { ...row, question: value } : row)))}
            onPl={(value) => setFaqs(faqs.map((row, i) => (i === index ? { ...row, questionPl: value } : row)))}
          />
          <LangPair
            label={`Answer ${index + 1}`}
            en={item.answer}
            pl={item.answerPl || suggestPl(item.answer)}
            multiline
            rows={3}
            onEn={(value) => setFaqs(faqs.map((row, i) => (i === index ? { ...row, answer: value } : row)))}
            onPl={(value) => setFaqs(faqs.map((row, i) => (i === index ? { ...row, answerPl: value } : row)))}
          />
          <AdminReorderControls
            index={index}
            total={faqs.length}
            onMove={(from, to) => setFaqs(moveItem(faqs, from, to))}
            onRemove={() => setFaqs(faqs.filter((_, i) => i !== index))}
          />
        </div>
      ))}
      <AdminButton
        variant="ghost"
        onClick={() => setFaqs([...faqs, { question: "", questionPl: "", answer: "", answerPl: "" }])}
      >
        Add question
      </AdminButton>
    </div>
  );
}
