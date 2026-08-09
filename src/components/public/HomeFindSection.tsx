import Link from "next/link";
import type { FindSection } from "@/types/content";
import { SHOP_URL } from "@/lib/config";

type HomeFindSectionProps = {
  section: FindSection;
  email?: string;
  /** From Settings shop_url (env fallback). */
  shopUrl?: string;
};

export function HomeFindSection({
  section,
  email = "lelekstudio@lelekstudio.com",
  shopUrl = SHOP_URL,
}: HomeFindSectionProps) {
  const instagramUrl =
    section.studioInstagramUrl ||
    "https://www.instagram.com/claystories.berlin/";
  const openDaysNote =
    section.openDaysNote ||
    "Available during open days and selected sales events. Follow Instagram for dates.";
  const onlineHeading = section.onlineHeading || "Shop";
  const onlineDescription =
    section.onlineDescription ||
    "Ceramic objects, vessels, prints and wearable pieces - available on the LELEK shop.";
  const onlineCta = section.onlineCtaLabel || "Visit shop ↗";

  return (
    <section id="find" className="find">
      <div className="fb">
        <div className="fb-ey">Find us</div>
        {section.studioName ? <div className="fb-h3">{section.studioName}</div> : null}
        {section.studioAddress ? <p className="fb-body">{section.studioAddress}</p> : null}
        <p className="fb-body">{openDaysNote}</p>
        <Link
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="fb-link"
        >
          {section.studioInstagram ?? "@claystories.berlin"} ↗
        </Link>
      </div>

      <div className="fb dark">
        <div className="fb-ey">Online</div>
        <div className="fb-h3">{onlineHeading}</div>
        <p className="fb-body">{onlineDescription}</p>
        <a
          href={shopUrl}
          className="fb-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          {onlineCta}
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
