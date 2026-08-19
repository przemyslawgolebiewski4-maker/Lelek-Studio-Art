import { API_BASE, API_FETCH_TIMEOUT_MS, shouldSkipApiFetch } from "@/lib/config";

export type ReserveExhibitionStatus = "available" | "reserved" | "sold";

export type ReservePublicData = {
  title: string;
  catalogCode: string;
  category?: string;
  material?: string;
  price: number | null;
  imageUrl: string;
  description: string;
  exhibitionStatus: ReserveExhibitionStatus;
  locationName: string;
  exhibitionEndDate: string;
  /** Present only when exhibitionStatus === "available" */
  revolutPaymentLink?: string | null;
};

/** Fetch buyer reserve payload. Returns null on 404 / miss / offline API. Never caches. */
export async function fetchReserveByCode(
  catalogCode: string,
): Promise<ReservePublicData | null> {
  const code = catalogCode.trim();
  if (!code || shouldSkipApiFetch()) return null;

  try {
    const res = await fetch(
      `${API_BASE}/public/reserve/${encodeURIComponent(code)}`,
      {
        cache: "no-store",
        signal: AbortSignal.timeout(API_FETCH_TIMEOUT_MS),
      },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as ReservePublicData;
    if (
      !data ||
      (data.exhibitionStatus !== "available" &&
        data.exhibitionStatus !== "reserved" &&
        data.exhibitionStatus !== "sold")
    ) {
      return null;
    }
    return data;
  } catch {
    return null;
  }
}
