import Link from "next/link";

type FooterProps = {
  siteName?: string;
  location?: string;
  instagram?: string;
  instagramHandle?: string;
  email?: string;
  etsyUrl?: string;
  artistUrl?: string;
  lelekMeaning?: string;
};

export function Footer({
  siteName = "Lelek Studio",
  location = "Berlin, Germany",
  instagram = "https://www.instagram.com/lelek.studio.berlin/",
  instagramHandle = "@lelek.studio.berlin",
  email = "lelekstudio@lelekstudio.com",
  etsyUrl = "https://www.etsy.com/shop/LelekStudio",
  artistUrl = "https://www.p-golebiewski.xyz",
  lelekMeaning = "Lelek - kozodoj - the nightjar",
}: FooterProps) {
  return (
    <footer className="bg-earth px-6 py-8 md:px-12">
      <div className="container flex flex-col items-center gap-5 text-center md:flex-row md:flex-wrap md:items-center md:justify-between md:text-left">
        <div>
          <p className="font-display text-[15px] text-[rgba(245,239,230,0.85)]">
            {siteName} · {location}
          </p>
          <p className="footer-lelek mt-1 font-serif text-xs italic text-[rgba(163,107,63,0.3)]">
            {lelekMeaning}
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6">
          <Link
            href={instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] uppercase tracking-[0.15em] text-[rgba(245,239,230,0.35)] transition-colors hover:text-[rgba(245,239,230,0.75)]"
          >
            {instagramHandle}
          </Link>
          <Link
            href={`mailto:${email}`}
            className="text-[11px] uppercase tracking-[0.15em] text-[rgba(245,239,230,0.35)] transition-colors hover:text-[rgba(245,239,230,0.75)]"
          >
            {email}
          </Link>
          <Link
            href={etsyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] uppercase tracking-[0.15em] text-[rgba(245,239,230,0.35)] transition-colors hover:text-[rgba(245,239,230,0.75)]"
          >
            Etsy
          </Link>
          <Link
            href={artistUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] uppercase tracking-[0.15em] text-[rgba(245,239,230,0.35)] transition-colors hover:text-[rgba(245,239,230,0.75)]"
          >
            Przemyslaw Golebiewski
          </Link>
        </div>
      </div>
    </footer>
  );
}
