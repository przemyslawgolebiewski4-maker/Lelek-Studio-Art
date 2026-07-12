import Image from "next/image";
import Link from "next/link";

export type HeroContent = {
  eyebrow?: string;
  headline?: string;
  headlineEm?: string;
  quote?: string;
  subheadline?: string;
  image?: string;
  imageMobile?: string;
  imageAlt?: string;
  cta1Text?: string;
  cta1Url?: string;
  cta2Text?: string;
  cta2Url?: string;
};

export function Hero({ content }: { content: HeroContent }) {
  const image = content.image ?? "/images/hero/hero-main.jpg";
  const imageMobile = content.imageMobile ?? "/images/hero/hero-main-mobile.jpg";

  return (
    <section className="relative flex min-h-screen items-end overflow-hidden">
      <div className="absolute inset-0 bg-clay">
        <Image
          src={imageMobile}
          alt={content.imageAlt ?? "Lelek Studio Berlin - handmade ceramics"}
          fill
          priority
          className="object-cover opacity-90 md:hidden"
          sizes="100vw"
        />
        <Image
          src={image}
          alt={content.imageAlt ?? "Lelek Studio Berlin - handmade ceramics"}
          fill
          priority
          className="hidden object-cover opacity-90 md:block"
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(30, 22, 16, 0.62) 0%, rgba(30, 22, 16, 0.12) 55%, transparent 100%)",
          }}
        />
      </div>

      <div className="relative z-[2] w-full max-w-[720px] px-6 pb-16 pt-28 md:container md:px-12 md:pb-[72px]">
        {content.eyebrow ? (
          <p className="mb-[18px] text-[10px] uppercase tracking-[0.4em] text-[rgba(245,239,230,0.65)]">
            {content.eyebrow}
          </p>
        ) : null}
        <h1 className="mb-3.5 max-w-[12ch] text-[var(--text-hero)] leading-[1.02] tracking-[-0.02em] text-cream">
          {content.headline}{" "}
          {content.headlineEm ? <em className="text-clay not-italic">{content.headlineEm}</em> : null}
        </h1>
        {content.quote ? (
          <p className="hero-quote mb-2.5 font-serif text-[17px] italic leading-snug text-[rgba(245,239,230,0.45)]">
            &ldquo;{content.quote}&rdquo;
          </p>
        ) : null}
        {content.subheadline ? (
          <p className="mb-9 max-w-[560px] font-serif text-[clamp(18px,2.2vw,22px)] font-light italic leading-normal text-[rgba(245,239,230,0.78)]">
            {content.subheadline}
          </p>
        ) : null}
        <div className="flex flex-wrap gap-7">
          {content.cta1Text ? (
            <Link href={content.cta1Url ?? "/collections"} className="btn-line">
              {content.cta1Text} →
            </Link>
          ) : null}
          {content.cta2Text ? (
            <Link href={content.cta2Url ?? "/about"} className="btn-line">
              {content.cta2Text} →
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
