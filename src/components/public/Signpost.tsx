import Link from "next/link";
import type { SignpostSection } from "@/types/content";

const DEFAULT_CARDS = [
  {
    label: "Shop",
    description: "Ceramic objects, vessels, prints and wearable pieces for everyday use.",
    href: process.env.NEXT_PUBLIC_SHOP_URL || "/contact",
  },
  {
    label: "About",
    description: "The studio story and one-of-a-kind Originals for collectors.",
    href: "/about",
  },
  {
    label: "Process",
    description: "Notes on material, making and life in the Berlin studio.",
    href: "/journal",
  },
  {
    label: "Trade",
    description: "Commissions for hospitality, offices and private spaces.",
    href: "/for-architects",
  },
];

export function Signpost({ section }: { section: SignpostSection }) {
  const cards =
    section.cards && section.cards.length > 0
      ? section.cards.slice(0, 4)
      : DEFAULT_CARDS;

  while (cards.length < 4) {
    cards.push(DEFAULT_CARDS[cards.length]!);
  }

  const intro =
    section.intro ??
    "LELEK works across ceramics, sculpture and print. Originals for collectors. Stoneware, fine art posters and wearable pieces for everyday use.";
  const tradeSignal =
    section.tradeSignal ?? "Designing a space? Let's talk";
  const tradeHref = section.tradeHref ?? "/for-architects";

  return (
    <section className="signpost-section" aria-label="Wayfinding">
      <div className="signpost-intro">
        <p className="signpost-body">{intro}</p>
        <Link href={tradeHref} className="trade-signal">
          {tradeSignal}
        </Link>
      </div>

      <div className="signpost">
        {cards.map((card) => {
          const external = /^https?:\/\//i.test(card.href);
          if (external) {
            return (
              <a key={card.label + card.href} href={card.href} className="signpost-card">
                <span className="signpost-card-label">{card.label}</span>
                <span className="signpost-card-desc">{card.description}</span>
              </a>
            );
          }
          return (
            <Link key={card.label + card.href} href={card.href} className="signpost-card">
              <span className="signpost-card-label">{card.label}</span>
              <span className="signpost-card-desc">{card.description}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
