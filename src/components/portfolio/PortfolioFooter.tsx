import Link from "next/link";
import { CookiePreferencesLink } from "@/components/public/CookiePreferencesLink";
import { studioHref } from "@/lib/links";

type PortfolioFooterProps = {
  siteName: string;
  location: string;
  email: string;
  instagram: string;
  shopUrl: string;
  lelekMeaning: string;
  labels: {
    contact: string;
    about: string;
    impressum: string;
    withdrawal: string;
    privacy: string;
    cookies: string;
    shop: string;
  };
};

export function PortfolioFooter({
  siteName,
  location,
  email,
  instagram,
  shopUrl,
  lelekMeaning,
  labels,
}: PortfolioFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="portfolio-footer">
      <p className="portfolio-footer-brand">
        {siteName} - {location} - {year}
      </p>
      {lelekMeaning.trim() ? <p className="portfolio-footer-meaning">{lelekMeaning}</p> : null}
      <ul className="portfolio-footer-links">
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
          <Link href={`mailto:${email}`}>{email}</Link>
        </li>
        <li>
          <Link href={studioHref("/about")}>{labels.about}</Link>
        </li>
        <li>
          <Link href={studioHref("/impressum")}>{labels.impressum}</Link>
        </li>
        <li>
          <Link href={studioHref("/datenschutz")}>{labels.privacy}</Link>
        </li>
        <li>
          <Link href={studioHref("/widerrufsrecht")}>{labels.withdrawal}</Link>
        </li>
        <li>
          <CookiePreferencesLink label={labels.cookies} />
        </li>
      </ul>
    </footer>
  );
}
