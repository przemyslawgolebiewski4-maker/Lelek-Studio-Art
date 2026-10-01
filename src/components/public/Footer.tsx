import Link from "next/link";
import { CookiePreferencesLink } from "@/components/public/CookiePreferencesLink";
import { INSTAGRAM_URL } from "@/lib/config";
import { studioHref } from "@/lib/links";

type FooterLabels = {
  contact: string;
  about: string;
  impressum: string;
  withdrawal: string;
  privacy: string;
  cookies: string;
  shop: string;
};

type FooterProps = {
  locale?: "en" | "pl";
  siteName?: string;
  location?: string;
  instagram?: string;
  email?: string;
  shopUrl?: string;
  lelekMeaning?: string;
  labels?: FooterLabels;
};

export function Footer({
  siteName = "Lelek Studio",
  location = "Berlin",
  instagram = INSTAGRAM_URL,
  email = "lelekstudio@lelekstudio.com",
  shopUrl = "https://shop.lelekstudio.com",
  lelekMeaning = "The hand moves, the mind follows after.",
  labels = {
    contact: "Contact",
    about: "About LELEK Studio",
    impressum: "Impressum",
    withdrawal: "Widerrufsrecht",
    privacy: "Datenschutz",
    cookies: "Cookie preferences",
    shop: "Shop",
  },
}: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div>
        <div className="foot-l">
          {siteName} - {location} - {year}
        </div>
        <div className="foot-lelek">{lelekMeaning}</div>
      </div>
      <ul className="foot-links">
        <li>
          <Link href={instagram} target="_blank" rel="noopener noreferrer">
            Instagram
          </Link>
        </li>
        <li>
          <a href={shopUrl} target="_blank" rel="noopener noreferrer">
            {labels.shop}
          </a>
        </li>
        <li>
          <Link href={studioHref("/contact")}>{labels.contact}</Link>
        </li>
        <li>
          <Link href={studioHref("/impressum")}>{labels.impressum}</Link>
        </li>
        <li>
          <Link href={studioHref("/widerrufsrecht")}>{labels.withdrawal}</Link>
        </li>
        <li>
          <Link href={studioHref("/datenschutz")}>{labels.privacy}</Link>
        </li>
        <li>
          <CookiePreferencesLink label={labels.cookies} />
        </li>
        <li>
          <Link href={studioHref("/about")}>{labels.about}</Link>
        </li>
        <li>
          <Link href={`mailto:${email}`}>{email}</Link>
        </li>
      </ul>
    </footer>
  );
}
