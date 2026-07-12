import Link from "next/link";
import type { FindSection } from "@/types/content";

type HomeFindSectionProps = {
  section: FindSection;
  email?: string;
  studioInstagramUrl?: string;
};

export function HomeFindSection({
  section,
  email = "lelekstudio@lelekstudio.com",
  studioInstagramUrl = "https://www.instagram.com/claystories.berlin/",
}: HomeFindSectionProps) {
  return (
    <section id="find" className="find">
      <div className="fb">
        <div className="fb-ey">Find us</div>
        {section.studioName ? <div className="fb-h3">{section.studioName}</div> : null}
        {section.studioAddress ? <p className="fb-body">{section.studioAddress}</p> : null}
        <p className="fb-body">
          Available during open days and selected sales events. Follow Instagram for dates.
        </p>
        <Link
          href={studioInstagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="fb-link"
        >
          {section.studioInstagram ?? "@claystories.berlin"} ↗
        </Link>
      </div>

      <div className="fb dark">
        <div className="fb-ey">Online</div>
        <div className="fb-h3">Etsy shop</div>
        <p className="fb-body">
          Functional ceramics available worldwide. New pieces added after each firing.
        </p>
        {section.etsyUrl ? (
          <Link
            href={section.etsyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fb-link"
          >
            Visit Etsy shop ↗
          </Link>
        ) : null}
        <p className="fb-body" style={{ marginTop: 24 }}>
          Interior projects — {email}
        </p>
        <Link href="/contact" className="fb-link">
          Get in touch
        </Link>
      </div>
    </section>
  );
}
