"use client";

import Link from "next/link";
import { track } from "@vercel/analytics";
import type { SignpostSection } from "@/types/content";
import { SHOP_URL } from "@/lib/config";

function defaultCards(shopUrl: string) {
  return [
    {
      label: "Shop",
      description: "Vessels, cups, lamps and objects. Forms that repeat, never exactly.",
      href: shopUrl,
    },
    {
      label: "About",
      description: "Przemysław Gołębiewski - self-taught ceramist. Process first, always.",
      href: "/about",
    },
    {
      label: "Process",
      description: "Notes on clay, kiln, texture, and what the material decides.",
      href: "/journal",
    },
    {
      label: "Trade",
      description: "Works for spaces that can hold something raw, organic, or both.",
      href: "/for-architects",
    },
  ];
}

function trackSignpostClick(label: string, href: string) {
  track("signpost_card_click", { card: label, href });
}

export function Signpost({
  section,
  shopUrl = SHOP_URL,
}: {
  section: SignpostSection;
  shopUrl?: string;
}) {
  const fallback = defaultCards(shopUrl);
  const cards =
    section.cards && section.cards.length > 0
      ? section.cards.slice(0, 4)
      : fallback.slice();

  while (cards.length < 4) {
    cards.push(fallback[cards.length]!);
  }

  const intro =
    section.intro ??
    "LELEK is the ceramic practice of Przemysław Gołębiewski. Organic and brutalist forms, shaped by hand - vessels, cups, lamps and objects that never repeat exactly.";
  const tradeSignal =
    section.tradeSignal ?? "Designing a space? Let's talk";
  const tradeHref = section.tradeHref ?? "/for-architects";

  return (
    <section className="signpost-section" aria-label="Wayfinding">
      <div className="signpost-intro">
        <p className="signpost-body">{intro}</p>
        <Link
          href={tradeHref}
          className="trade-signal"
          onClick={() => trackSignpostClick("trade_signal", tradeHref)}
        >
          {tradeSignal}
        </Link>
      </div>

      <div className="signpost">
        {cards.map((card) => {
          const external = /^https?:\/\//i.test(card.href);
          if (external) {
            return (
              <a
                key={card.label + card.href}
                href={card.href}
                className="signpost-card"
                onClick={() => trackSignpostClick(card.label, card.href)}
              >
                <span className="signpost-card-label">{card.label}</span>
                <span className="signpost-card-desc">{card.description}</span>
              </a>
            );
          }
          return (
            <Link
              key={card.label + card.href}
              href={card.href}
              className="signpost-card"
              onClick={() => trackSignpostClick(card.label, card.href)}
            >
              <span className="signpost-card-label">{card.label}</span>
              <span className="signpost-card-desc">{card.description}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
