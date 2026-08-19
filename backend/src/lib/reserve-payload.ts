/**
 * Pure builder for the public reserve payload.
 * revolutPaymentLink is included ONLY when status === "available".
 */
export type ReserveSource = {
  title: string;
  catalogCode: string;
  instanceCode: string;
  category?: string;
  material?: string;
  price: number | null;
  imageUrl: string;
  description: string;
  exhibitionStatus: "available" | "reserved" | "sold";
  revolutPaymentLink?: string | null;
  locationName: string;
  exhibitionEndDate: Date | string;
};

export function buildReservePublicPayload(src: ReserveSource): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    title: src.title,
    catalogCode: src.catalogCode,
    instanceCode: src.instanceCode,
    category: src.category ?? "",
    material: src.material ?? "",
    price: src.price,
    imageUrl: src.imageUrl,
    description: src.description ?? "",
    exhibitionStatus: src.exhibitionStatus,
    locationName: src.locationName,
    exhibitionEndDate: src.exhibitionEndDate,
  };

  if (src.exhibitionStatus === "available") {
    payload.revolutPaymentLink = src.revolutPaymentLink ?? null;
  }
  // When reserved/sold: deliberately omit revolutPaymentLink key

  return payload;
}
