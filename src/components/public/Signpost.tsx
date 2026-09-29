"use client";

import Link from "next/link";
import { track } from "@vercel/analytics";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { SignpostSection } from "@/types/content";
import { SHOP_URL } from "@/lib/config";
import { localeText } from "@/lib/i18n/present";

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
  const locale = useLocale();
  const fallback = defaultCards(shopUrl).map((card) => ({
    ...card,
    label: localeText(locale, card.label),
    description: localeText(locale, card.description),
  }));
  const cards =
    section.cards && section.cards.length > 0
      ? section.cards.slice(0, 4).map((card) => ({
          ...card,
          label: localeText(locale, card.label),
          description: localeText(locale, card.description),
        }))
      : fallback.slice();

  while (cards.length < 4) {
    cards.push(fallback[cards.length]!);
  }

  const intro = localeText(
    locale,
    section.intro?.trim() ||
      "LELEK is the ceramic practice of Przemysław Gołębiewski. Organic and brutalist forms, shaped by hand - vessels, cups, lamps and objects that never repeat exactly.",
  );
  const tradeSignal = localeText(locale, section.tradeSignal?.trim() || "Designing a space? Let's talk");
  const tradeHref = section.tradeHref ?? "/for-architects";

  return (
    <section className="signpost-section" aria-label={localeText(locale, "Wayfinding")}>
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
