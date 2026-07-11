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
    <section className="relative min-h-[100svh] max-h-[100svh] overflow-hidden bg-ink text-cream">
      <div className="absolute inset-0">
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
        <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/20 to-transparent" />
      </div>

      <div className="relative z-10 flex min-h-[100svh] max-h-[100svh] flex-col justify-end px-5 pb-8 pt-24 md:container md:pb-14 md:pt-28">
        <p className="eyebrow mb-4 text-cream/70">{content.eyebrow}</p>
        <h1 className="max-w-[12ch] text-[var(--text-hero)] leading-[0.92]">
          {content.headline}{" "}
          <span className="italic-serif block text-sand">{content.headlineEm}</span>
        </h1>
        {content.quote ? (
          <p className="italic-serif mt-4 max-w-md text-sm text-cream/60 md:text-base">
            &ldquo;{content.quote}&rdquo;
          </p>
        ) : null}
        <p className="mt-4 max-w-lg text-sm text-cream/75 md:text-base">{content.subheadline}</p>
        <div className="mt-6 flex flex-wrap gap-3 md:mt-8">
          {content.cta1Text ? (
            <Link href={content.cta1Url ?? "/collections"} className="btn-primary">
              {content.cta1Text} ↗
            </Link>
          ) : null}
          {content.cta2Text ? (
            <Link href={content.cta2Url ?? "/about"} className="btn-ghost">
              {content.cta2Text} ↗
            </Link>
          ) : null}
        </div>
        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-cream/35">
          Lelek - kozodoj - the nightjar
        </p>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-cream" aria-hidden />
    </section>
  );
}
