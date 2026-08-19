"use client";

import {
  createContext,
  useContext,
  useState,
  startTransition,
  type ReactNode,
} from "react";
import Link from "next/link";
import Image from "next/image";
import { SITE_URL } from "@/lib/config";
import { isProductCategory, CATEGORY_TAB_LABELS } from "@/lib/categories";
import type { ReservePublicData } from "@/lib/reserve";
import {
  RESERVE_COPY,
  RESERVE_LANGS,
  formatReserveDate,
  type ReserveLang,
} from "@/lib/reserve-i18n";

type ReserveLangContextValue = {
  lang: ReserveLang;
  setLang: (lang: ReserveLang) => void;
  t: (typeof RESERVE_COPY)[ReserveLang];
};

const ReserveLangContext = createContext<ReserveLangContextValue | null>(null);

function useReserveLang() {
  const ctx = useContext(ReserveLangContext);
  if (!ctx) {
    throw new Error("useReserveLang must be used within ReserveShell");
  }
  return ctx;
}

function formatEuro(price: number | null) {
  if (price == null || Number.isNaN(price)) return null;
  return `€${price.toFixed(2)}`;
}

function categoryLabel(category?: string) {
  if (!category) return "";
  if (isProductCategory(category)) return CATEGORY_TAB_LABELS[category];
  return category;
}

function photoTag(data: ReservePublicData) {
  const parts = [data.catalogCode].filter(Boolean);
  if (data.material?.trim()) parts.push(data.material.trim());
  return parts.join(" · ");
}

function ProductPhoto({
  data,
  unavailableLabel,
}: {
  data: ReservePublicData;
  unavailableLabel?: string;
}) {
  const src = data.imageUrl?.trim() || "";
  return (
    <div className={`reserve-photo${unavailableLabel ? " is-unavailable" : ""}`}>
      {src ? (
        <Image
          src={src}
          alt={data.title}
          fill
          sizes="(max-width: 480px) 100vw, 420px"
          className="reserve-photo-img"
          priority
          unoptimized={/^https?:\/\//i.test(src)}
        />
      ) : (
        <div className="reserve-photo-fallback" aria-hidden />
      )}
      {unavailableLabel ? (
        <div className="reserve-photo-overlay">
          <span className="reserve-photo-stamp">{unavailableLabel}</span>
        </div>
      ) : (
        <span className="reserve-photo-tag">{photoTag(data)}</span>
      )}
    </div>
  );
}

function LangToggle() {
  const { lang, setLang, t } = useReserveLang();
  return (
    <div className="reserve-lang" role="group" aria-label={t.langLabel}>
      {RESERVE_LANGS.map((code) => (
        <button
          key={code}
          type="button"
          className={`reserve-lang-btn${lang === code ? " is-active" : ""}`}
          aria-pressed={lang === code}
          onClick={() => startTransition(() => setLang(code))}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

export function ReserveAvailable({
  data,
  instagramUrl,
}: {
  data: ReservePublicData;
  instagramUrl: string;
}) {
  const { lang, t } = useReserveLang();
  const price = formatEuro(data.price);
  const until = formatReserveDate(data.exhibitionEndDate, lang);
  const showPay =
    data.exhibitionStatus === "available" && Boolean(data.revolutPaymentLink);

  return (
    <div className="reserve-state">
      <ProductPhoto data={data} />
      <div className="reserve-body">
        {categoryLabel(data.category) ? (
          <div className="reserve-cat">{categoryLabel(data.category)}</div>
        ) : null}
        <h1 className="reserve-title">{data.title}</h1>
        {price ? <div className="reserve-price">{price}</div> : null}

        {showPay ? (
          <div className="reserve-pickup-copy">
            <p>
              {t.displayThrough(until ?? t.displayThroughFallback)}{" "}
              {t.keepConfirmation}
            </p>
            <p>{t.wantToday}</p>
            <p>
              {t.morePopupsBefore}
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
                @lelek.berlin
              </a>
              {t.morePopupsAfter}
            </p>
          </div>
        ) : null}

        {showPay ? (
          <a href={data.revolutPaymentLink!} className="reserve-btn-pay">
            {t.payCta}
          </a>
        ) : null}

        {showPay ? <div className="reserve-pay-icons">{t.payIcons}</div> : null}

        {showPay ? (
          <p className="reserve-legal-note">
            {t.legalBefore}
            <Link href="/widerrufsrecht">{t.returnPolicy}</Link>
            {t.legalAnd}
            <Link href="/impressum">{t.impressum}</Link>.
          </p>
        ) : null}

        <div className="reserve-desc">
          <b>{t.displayOnlyHere}</b>
          {data.description ? <span> {data.description}</span> : null}
        </div>

        <div className="reserve-exhib-note">{t.reservedExclusive}</div>
      </div>
    </div>
  );
}

export function ReserveUnavailable({
  data,
  instagramUrl,
  email,
}: {
  data: ReservePublicData;
  instagramUrl: string;
  email: string;
}) {
  const { t } = useReserveLang();
  const label =
    data.exhibitionStatus === "reserved" ? t.stampReserved : t.stampSold;
  const cat = categoryLabel(data.category);
  const meta = [cat, data.catalogCode].filter(Boolean).join(" · ");

  return (
    <div className="reserve-state">
      <ProductPhoto data={data} unavailableLabel={label} />
      <div className="reserve-body reserve-body-center">
        {meta ? <div className="reserve-cat">{meta}</div> : null}
        <h1 className="reserve-title">{t.unavailableTitle}</h1>
        <p className="reserve-unavailable-copy">{t.unavailableCopy}</p>
        <div className="reserve-contact-row">
          <a
            href={instagramUrl}
            className="reserve-contact-btn primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
          <a href={`mailto:${email}`} className="reserve-contact-btn">
            Email
          </a>
        </div>
        <div className="reserve-similar">
          <Link href={SITE_URL}>{t.seeCollection}</Link>
        </div>
      </div>
    </div>
  );
}

export function ReserveNotFound({ code }: { code: string }) {
  const { t } = useReserveLang();
  return (
    <div className="reserve-state reserve-not-found">
      <div className="reserve-body reserve-body-center">
        <div className="reserve-cat">{t.notFoundEyebrow}</div>
        <h1 className="reserve-title">{t.notFoundTitle}</h1>
        <p className="reserve-unavailable-copy">{t.notFoundCopy(code)}</p>
        <a href={SITE_URL} className="reserve-btn-pay">
          {t.goHome}
        </a>
      </div>
    </div>
  );
}

export function ReserveShell({
  locationName,
  code,
  children,
}: {
  locationName?: string;
  code: string;
  children: ReactNode;
}) {
  const [lang, setLang] = useState<ReserveLang>("en");
  const value: ReserveLangContextValue = {
    lang,
    setLang,
    t: RESERVE_COPY[lang],
  };

  return (
    <ReserveLangContext.Provider value={value}>
      <div className="reserve-page" lang={lang}>
        <div className="reserve-phone">
          <header className="reserve-header">
            <Link href={SITE_URL} className="reserve-logo">
              <b>LELEK</b>
            </Link>
            <div className="reserve-header-right">
              {locationName ? (
                <div className="reserve-loc-tag">{locationName}</div>
              ) : null}
              <LangToggle />
            </div>
          </header>
          {children}
          <footer className="reserve-footer">
            lelekstudio.com/reserve/{(code || "").toLowerCase()}
          </footer>
        </div>
      </div>
    </ReserveLangContext.Provider>
  );
}
