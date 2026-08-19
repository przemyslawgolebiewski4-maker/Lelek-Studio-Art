import Link from "next/link";
import Image from "next/image";
import { SITE_URL } from "@/lib/config";
import { isProductCategory, CATEGORY_TAB_LABELS } from "@/lib/categories";
import type { ReservePublicData } from "@/lib/reserve";

function formatEuro(price: number | null) {
  if (price == null || Number.isNaN(price)) return null;
  return `€${price.toFixed(2)}`;
}

function formatDisplayDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
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

export function ReserveAvailable({
  data,
  instagramUrl,
}: {
  data: ReservePublicData;
  instagramUrl: string;
}) {
  const price = formatEuro(data.price);
  const until = formatDisplayDate(data.exhibitionEndDate);
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
              This piece will be on display here through{" "}
              {until ?? "the end of this exhibition"}. Please keep your payment
              confirmation - you&apos;ll need it to collect.
            </p>
            <p>
              Want it today instead? Just show your payment confirmation to a member
              of staff and they can hand it over right away.
            </p>
            <p>
              More pop-ups coming - follow{" "}
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
                @lelek.berlin
              </a>{" "}
              on Instagram to see where this collection shows up next.
            </p>
          </div>
        ) : null}

        {showPay ? (
          <a href={data.revolutPaymentLink!} className="reserve-btn-pay">
            Reserve and pay now
          </a>
        ) : null}

        {showPay ? (
          <div className="reserve-pay-icons">Card · Apple Pay · Google Pay</div>
        ) : null}

        {showPay ? (
          <p className="reserve-legal-note">
            By paying you agree to our{" "}
            <Link href="/widerrufsrecht">Return Policy</Link> and{" "}
            <Link href="/impressum">Impressum</Link>.
          </p>
        ) : null}

        <div className="reserve-desc">
          <b>This piece is on display only here.</b>
          {data.description ? <span> {data.description}</span> : null}
        </div>

        <div className="reserve-exhib-note">
          Once you scan and pay for this QR code, the piece is reserved exclusively
          for you - no one else can buy it.
        </div>
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
  const label = data.exhibitionStatus === "reserved" ? "Reserved" : "Sold";
  const cat = categoryLabel(data.category);
  const meta = [cat, data.catalogCode].filter(Boolean).join(" · ");

  return (
    <div className="reserve-state">
      <ProductPhoto data={data} unavailableLabel={label} />
      <div className="reserve-body reserve-body-center">
        {meta ? <div className="reserve-cat">{meta}</div> : null}
        <h1 className="reserve-title">This piece is no longer available</h1>
        <p className="reserve-unavailable-copy">
          Someone was faster. If you&apos;d like something similar, or want to know
          when the next piece arrives - get in touch.
        </p>
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
          <Link href={SITE_URL}>See the full collection → lelekstudio.com</Link>
        </div>
      </div>
    </div>
  );
}

export function ReserveNotFound({ code }: { code: string }) {
  return (
    <div className="reserve-state reserve-not-found">
      <div className="reserve-body reserve-body-center">
        <div className="reserve-cat">Reserve</div>
        <h1 className="reserve-title">We couldn&apos;t find this piece</h1>
        <p className="reserve-unavailable-copy">
          It may no longer be part of an active exhibition
          {code ? `, or the code “${code}” is incorrect` : ""}.
        </p>
        <a href={SITE_URL} className="reserve-btn-pay">
          Go to lelekstudio.com
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
  children: React.ReactNode;
}) {
  return (
    <div className="reserve-page">
      <div className="reserve-phone">
        <header className="reserve-header">
          <Link href={SITE_URL} className="reserve-logo">
            <b>LELEK</b>
          </Link>
          {locationName ? (
            <div className="reserve-loc-tag">{locationName}</div>
          ) : null}
        </header>
        {children}
        <footer className="reserve-footer">
          lelekstudio.com/reserve/{(code || "").toLowerCase()}
        </footer>
      </div>
    </div>
  );
}
