import Link from "next/link";
import type { FindSection } from "@/types/content";

type HomeFindSectionProps = {
  section: FindSection;
  email?: string;
};

export function HomeFindSection({ section, email = "lelekstudio@lelekstudio.com" }: HomeFindSectionProps) {
  return (
    <section id="find" className="section-pad find-sec">
      <div className="container find-grid">
        <div className="find-block">
          <div className="sec-tag">Find us</div>
          {section.studioName ? <h3>{section.studioName}</h3> : null}
          {section.studioAddress ? <p>{section.studioAddress}</p> : null}
          <p>
            Available in studio during open days and selected sales events. Follow Instagram for
            dates.
          </p>
          {section.studioInstagram ? (
            <>
              <div className="divider" />
              <span className="btn-line-terra inline-flex">{section.studioInstagram}</span>
            </>
          ) : null}
          <p className="find-note">Studio visits by appointment — contact us directly</p>
        </div>

        <div className="find-block">
          <div className="sec-tag">Online</div>
          <h3>Shop on Etsy</h3>
          <p>
            Functional ceramics available for worldwide shipping. New pieces added after each firing.
          </p>
          {section.etsyUrl ? (
            <>
              <div className="divider" />
              <Link
                href={section.etsyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-line-dark inline-flex"
              >
                Visit Etsy shop →
              </Link>
            </>
          ) : null}
          <div className="divider" />
          <h3>Interior projects</h3>
          <p>Wall objects and custom orders — get in touch directly for interior projects.</p>
          <Link href={`mailto:${email}`} className="btn-line-terra inline-flex">
            {email} →
          </Link>
        </div>
      </div>
    </section>
  );
}
