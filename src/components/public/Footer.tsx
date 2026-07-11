import Link from "next/link";

type FooterProps = {
  siteName?: string;
  instagram?: string;
  instagramHandle?: string;
  email?: string;
  etsyUrl?: string;
  artistUrl?: string;
  lelekMeaning?: string;
};

export function Footer({
  siteName = "Lelek Studio",
  instagram = "https://www.instagram.com/lelek.studio.berlin/",
  instagramHandle = "@lelek.studio.berlin",
  email = "lelekstudio@lelekstudio.com",
  etsyUrl = "https://www.etsy.com/shop/LelekStudio",
  artistUrl = "https://www.p-golebiewski.xyz",
  lelekMeaning = "Lelek - kozodoj - the nightjar",
}: FooterProps) {
  return (
    <footer className="border-t border-sand bg-ink text-cream">
      <div className="container grid gap-8 py-12 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="serif text-2xl">{siteName}</p>
          <p className="mt-2 italic-serif text-sm text-sand">{lelekMeaning}</p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-3 font-mono text-[10px] uppercase tracking-[0.16em] text-sand">
          <Link href={instagram} target="_blank" rel="noopener noreferrer">
            {instagramHandle}
          </Link>
          <Link href={`mailto:${email}`}>{email}</Link>
          <Link href={etsyUrl} target="_blank" rel="noopener noreferrer">
            Etsy
          </Link>
          <Link href={artistUrl} target="_blank" rel="noopener noreferrer">
            Przemyslaw Golebiewski
          </Link>
        </div>
      </div>
      <div className="border-t border-peat px-5 py-4 font-mono text-[10px] uppercase tracking-[0.18em] text-metal">
        <div className="container flex flex-wrap justify-between gap-2">
          <span>Berlin / Earth / Fire / Hand</span>
          <span>Since 2026</span>
        </div>
      </div>
    </footer>
  );
}
