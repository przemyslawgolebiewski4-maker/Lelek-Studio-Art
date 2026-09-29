import Link from "next/link";
import type { FindSection } from "@/types/content";
import { SHOP_URL } from "@/lib/config";
import { getLocale } from "@/lib/i18n/get-locale";
import { t } from "@/lib/i18n/messages";
import { localeText } from "@/lib/i18n/present";

type HomeFindSectionProps = {
  section: FindSection;
  email?: string;
  /** From Settings shop_url (env fallback). */
  shopUrl?: string;
};

export async function HomeFindSection({
  section,
  email = "lelekstudio@lelekstudio.com",
  shopUrl = SHOP_URL,
}: HomeFindSectionProps) {
  const locale = await getLocale();
  const instagramUrl =
    section.studioInstagramUrl ||
    "https://www.instagram.com/claystories.berlin/";
  const openDaysNote =
    section.openDaysNote ||
    localeText(
      locale,
      "Available during open days and selected sales events. Follow Instagram for dates.",
    );
  const onlineHeading = section.onlineHeading || localeText(locale, "Shop");
  const onlineDescription =
    section.onlineDescription ||
    localeText(
      locale,
      "Vessels, cups, lamps and objects - each one a little different from the last.",
    );
  const onlineCta = section.onlineCtaLabel || localeText(locale, "Visit shop ↗");

  return (
    <section id="find" className="find">
      <div className="fb">
        <div className="fb-ey">{t(locale, "find.us")}</div>
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
        <div className="fb-ey">{t(locale, "find.online")}</div>
        <div className="fb-h3">{onlineHeading}</div>
        <p className="fb-body">{onlineDescription}</p>
        <a
          href={shopUrl}
          className="fb-link find-shop-cta"
          target="_blank"
          rel="noopener noreferrer"
        >
          {onlineCta}
        </a>
        <p className="fb-body" style={{ marginTop: 24 }}>
          {t(locale, "find.interior")} - {email}
        </p>
        <Link href="/contact" className="fb-link">
          {t(locale, "find.touch")}
        </Link>
      </div>
    </section>
  );
}
