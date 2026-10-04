import Image from "next/image";
import { ArchitectInquiryForm } from "@/components/public/ArchitectInquiryForm";
import { MediaBlock } from "@/components/public/MediaBlock";
import type { ArchitectsSection } from "@/types/content";

function TradePhoto({
  image,
  alt,
  caption,
  sizes,
}: {
  image?: string;
  alt: string;
  caption?: string;
  sizes: string;
}) {
  const src = image?.trim();
  if (!src) return null;

  return (
    <figure className="trade-photo">
      <div className="trade-photo-frame">
        <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

export function ForArchitectsContent({ section }: { section: ArchitectsSection }) {
  const hasHeroMedia = Boolean(section.heroImage?.trim() || section.heroVideo?.trim());
  const points = (section.points ?? []).filter((point) => point.title || point.body);
  const hasPair = Boolean(section.existingImage?.trim() || section.processImage?.trim());
  const email = section.formEmail?.trim() || "lelekstudio@lelekstudio.com";

  return (
    <article>
      <header className="trade-open">
        <div className="trade-open-copy surface-wabi">
          {section.eyebrow ? <p className="story-eyebrow">{section.eyebrow}</p> : null}
          <h1 className="trade-open-h">{section.headline}</h1>
          {section.dek ? <p className="trade-dek">{section.dek}</p> : null}
        </div>

        <div className={`trade-open-split ${hasHeroMedia ? "" : "is-text"}`}>
          {hasHeroMedia ? (
            <figure className="trade-hero-media">
              <MediaBlock
                image={section.heroImage}
                imageMobile={section.heroImageMobile}
                video={section.heroVideo}
                videoMobile={section.heroVideoMobile}
                alt={section.heroImageAlt || "Ceramic object in an interior"}
                variant="story"
                priority
              />
              {section.heroCaption ? <figcaption>{section.heroCaption}</figcaption> : null}
            </figure>
          ) : null}

          <div className="trade-prose trade-open-bodies">
            {section.heroBody ? <p>{section.heroBody}</p> : null}
            {section.intro ? <p>{section.intro}</p> : null}
          </div>
        </div>
      </header>

      <section className="trade-collab" aria-labelledby="trade-collab-heading">
        <div>
          <h2 id="trade-collab-heading" className="trade-collab-h">
            {section.collabHeadline}
            {section.collabHeadlineEm ? (
              <>
                {" "}
                <em>{section.collabHeadlineEm}</em>
              </>
            ) : null}
          </h2>
          <div className="trade-prose">
            {section.collabBody1 ? <p>{section.collabBody1}</p> : null}
            {section.collabBody2 ? <p>{section.collabBody2}</p> : null}
            {section.collabBody3 ? <p>{section.collabBody3}</p> : null}
            {section.collabBody4 ? <p>{section.collabBody4}</p> : null}
          </div>
          {section.collabNote ? <p className="trade-note">{section.collabNote}</p> : null}
        </div>

        {hasPair ? (
          <div className="trade-pair">
            <TradePhoto
              image={section.existingImage}
              alt={section.existingImageAlt || "Existing ceramic work"}
              caption={section.existingCaption}
              sizes="(max-width: 1024px) 100vw, 42vw"
            />
            <TradePhoto
              image={section.processImage}
              alt={section.processImageAlt || "Ceramic piece in the studio"}
              caption={section.processCaption}
              sizes="(max-width: 1024px) 100vw, 42vw"
            />
          </div>
        ) : null}
      </section>

      {points.length > 0 ? (
        <section className="trade-kinds" aria-labelledby="trade-kinds-heading">
          <h2 id="trade-kinds-heading" className="trade-kinds-h">
            {section.kindsEyebrow}
          </h2>
          <ol className="trade-points">
            {points.map((point, index) => (
              <li key={`${point.title}-${index}`} className="trade-point">
                <span className="trade-point-num">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{point.title}</h3>
                  {point.body ? <p>{point.body}</p> : null}
                </div>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      <section className="trade-invite" aria-labelledby="trade-invite-heading">
        <h2 id="trade-invite-heading">{section.inviteHeadline}</h2>
        <div className="trade-prose">
          {section.inviteBody1 ? <p>{section.inviteBody1}</p> : null}
          {section.inviteBody2 ? <p>{section.inviteBody2}</p> : null}
        </div>
        {section.inviteSignoff ? <p className="trade-signoff">{section.inviteSignoff}</p> : null}
      </section>

      <section className="page-shell trade-form" id="inquiry" aria-labelledby="trade-form-heading">
        {section.formEyebrow ? <p className="sec-eyebrow">{section.formEyebrow}</p> : null}
        {section.formIntro ? <p className="page-intro trade-form-lead">{section.formIntro}</p> : null}
        <h2 id="trade-form-heading" className="trade-form-h">
          {section.formCta}
        </h2>
        <a className="trade-mail" href={`mailto:${email}`}>
          {email}
        </a>
        <ArchitectInquiryForm
          successTitle={section.formSuccessTitle}
          successBody={section.formSuccessBody}
        />
      </section>
    </article>
  );
}
