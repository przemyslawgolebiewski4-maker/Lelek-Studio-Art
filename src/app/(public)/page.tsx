import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/public/Hero";
import { FeaturedWorks } from "@/components/public/FeaturedWorks";
import { DEFAULT_HERO, getPublicHomeData } from "@/lib/site";

export const metadata: Metadata = {
  title: "Lelek Studio Berlin - Shaped by hand, guided by instinct",
  description:
    "Handmade stoneware objects, vessels and wall pieces by ceramist Przemyslaw Golebiewski in Berlin.",
};

export const revalidate = 60;

export default async function HomePage() {
  const { hero, featured } = await getPublicHomeData();

  return (
    <>
      <Hero content={Object.keys(hero).length > 0 ? hero : DEFAULT_HERO} />

      <section className="section-pad">
        <div className="container grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="cat-num mb-6">001</p>
            <p className="eyebrow mb-3">The story</p>
            <h2 className="text-[var(--text-3xl)]">
              From peatlands <span className="italic-serif text-rust">to clay</span>
            </h2>
            <p className="italic-serif mt-6 max-w-md text-metal">
              Earth remembers every hand. Self-taught ceramist working in Berlin - guided by
              instinct, shaped by earth.
            </p>
            <Link href="/about" className="btn-text mt-8 inline-block">
              Read the full story ↗
            </Link>
          </div>
          <div className="border-[3px] border-ink bg-sand/30 p-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-metal">
              I. Earth / II. Water / III. Fire / IV. Air
            </p>
          </div>
        </div>
      </section>

      {featured.length > 0 ? <FeaturedWorks products={featured} /> : null}

      <section className="section-pad bg-peat text-cream">
        <div className="container max-w-3xl">
          <h2 className="text-[var(--text-2xl)] md:text-[var(--text-3xl)]">
            Looking for something made by hand, not manufactured?
          </h2>
          <p className="mt-4 max-w-xl text-sand">
            Ceramics for residential, hospitality, and concept stores.
          </p>
          <Link
            href="/for-architects"
            className="btn-primary mt-8 inline-flex border-cream bg-transparent text-cream hover:bg-cream hover:text-ink"
          >
            Get in touch ↗
          </Link>
        </div>
      </section>
    </>
  );
}
