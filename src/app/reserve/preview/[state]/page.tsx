import type { Metadata } from "next";
import type { ReservePublicData } from "@/lib/reserve";
import {
  ReserveAvailable,
  ReserveNotFound,
  ReserveShell,
  ReserveUnavailable,
} from "@/components/public/ReserveView";

export const metadata: Metadata = {
  title: "Reserve preview",
  robots: { index: false, follow: false },
};

type PageProps = { params: Promise<{ state: string }> };

  const DEMO: ReservePublicData = {
  title: "Cream Iron Oxide, Wire Wrapped",
  catalogCode: "SI-011",
  instanceCode: "SI-011-01",
  category: "ceramics",
  material: "250ml",
  price: 31,
  imageUrl: "/images/ceramics/cup-1.jpg",
  description:
    "Stoneware, two thrown forms joined by a visible band of stainless steel wire. A single piece, available for pickup at this location once paid.",
  exhibitionStatus: "available",
  locationName: "Kawiarnia Sowa",
  exhibitionEndDate: "2026-09-30T00:00:00.000Z",
  revolutPaymentLink: "https://checkout.revolut.com/pay/demo-link",
};

/**
 * Local/visual preview of reserve states without Mongo.
 * /reserve/preview/available | reserved | sold | 404
 */
export default async function ReservePreviewPage({ params }: PageProps) {
  const { state } = await params;
  const email = "lelekstudio@lelekstudio.com";
  const instagramUrl = "https://www.instagram.com/lelek.studio.berlin/";

  if (state === "404" || state === "not-found") {
    return (
      <ReserveShell code="unknown">
        <ReserveNotFound code="UNKNOWN" />
      </ReserveShell>
    );
  }

  if (state === "reserved" || state === "sold") {
    const data: ReservePublicData = {
      ...DEMO,
      exhibitionStatus: state,
    };
    // Explicitly omit revolutPaymentLink (mirrors API)
    delete (data as { revolutPaymentLink?: string }).revolutPaymentLink;
    return (
      <ReserveShell locationName={data.locationName} code={data.instanceCode || data.catalogCode}>
        <ReserveUnavailable data={data} instagramUrl={instagramUrl} email={email} />
      </ReserveShell>
    );
  }

  // available (default)
  return (
    <ReserveShell
      locationName={DEMO.locationName}
      code={DEMO.instanceCode || DEMO.catalogCode}
    >
      <ReserveAvailable data={DEMO} />
    </ReserveShell>
  );
}
