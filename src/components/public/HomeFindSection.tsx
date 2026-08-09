import Link from "next/link";
import type { FindSection } from "@/types/content";
import { SHOP_URL } from "@/lib/config";

type HomeFindSectionProps = {
  section: FindSection;
  email?: string;
  studioInstagramUrl?: string;
  shopUrl?: string;
};

export function HomeFindSection({
  section,
  email = "lelekstudio@lelekstudio.com",
  studioInstagramUrl = "https://www.instagram.com/claystories.berlin/",
  shopUrl = SHOP_URL,
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
        <div className="fb-h3">Shop</div>
        <p className="fb-body">
          Ceramic objects, vessels, prints and wearable pieces - available on the LELEK shop.
        </p>
        <a href={shopUrl} className="fb-link">
          Visit shop ↗
        </a>
        <p className="fb-body" style={{ marginTop: 24 }}>
          Interior projects - {email}
        </p>
        <Link href="/contact" className="fb-link">
          Get in touch
        </Link>
      </div>
    </section>
  );
}
