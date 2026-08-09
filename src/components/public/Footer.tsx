import Link from "next/link";

type FooterProps = {
  siteName?: string;
  location?: string;
  instagram?: string;
  email?: string;
  shopUrl?: string;
  artistUrl?: string;
  lelekMeaning?: string;
};

export function Footer({
  siteName = "Lelek Studio",
  location = "Berlin",
  instagram = "https://www.instagram.com/lelek.studio.berlin/",
  email = "lelekstudio@lelekstudio.com",
  shopUrl = "https://shop.lelekstudio.com",
  artistUrl = "https://www.p-golebiewski.xyz",
  lelekMeaning = "Lelek - kozodoj - the nightjar",
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
          <a href={shopUrl}>Shop</a>
        </li>
        <li>
          <Link href="/contact">Contact</Link>
        </li>
        <li>
          <Link href="/impressum">Impressum</Link>
        </li>
        <li>
          <Link href="/datenschutz">Datenschutz</Link>
        </li>
        <li>
          <Link href={artistUrl} target="_blank" rel="noopener noreferrer">
            Art ↗
          </Link>
        </li>
        <li>
          <Link href={`mailto:${email}`}>{email}</Link>
        </li>
      </ul>
    </footer>
  );
}
