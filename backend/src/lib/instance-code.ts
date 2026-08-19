import { ExhibitionItem } from "../models/ExhibitionItem";

/** Base catalog before instance suffix: CE-001, SI-011, WO-004 */
export const CATALOG_CODE_RE = /^[A-Z]{2,3}-\d{3}$/;

/** Full instance: CE-001-01 */
export const INSTANCE_CODE_RE = /^[A-Z]{2,3}-\d{3}-\d{2}$/;

export function normalizeCatalogCode(raw: string): string | null {
  const code = raw.trim().toUpperCase();
  return CATALOG_CODE_RE.test(code) ? code : null;
}

export function isValidInstanceCode(raw: string): boolean {
  return INSTANCE_CODE_RE.test(raw.trim().toUpperCase());
}

export function buildDisplayLabel(catalogCode: string, title: string, sequence: number): string {
  const seq = String(sequence).padStart(2, "0");
  const cleanTitle = title.trim() || "Piece";
  return `${catalogCode} · ${cleanTitle} #${seq}`;
}

/**
 * Allocate next instanceCode for a catalog design. Sequence is per catalogCode.
 * Retries on unique-index collisions. Client cannot choose the number.
 */
export async function allocateInstanceCodes(
  catalogRaw: string,
  title: string,
): Promise<{
  catalogCode: string;
  sequence: number;
  instanceCode: string;
  displayLabel: string;
}> {
  const catalogCode = normalizeCatalogCode(catalogRaw);
  if (!catalogCode) {
    throw new Error(
      "Catalog code must look like CE-001 (2–3 letters, hyphen, 3 digits) before creating an instance.",
    );
  }

  for (let attempt = 0; attempt < 8; attempt++) {
    const last = await ExhibitionItem.findOne({ catalogCode })
      .sort({ sequence: -1 })
      .select("sequence")
      .lean();
    const sequence = (last?.sequence ?? 0) + 1;
    if (sequence > 99) {
      throw new Error(`Maximum of 99 instances reached for ${catalogCode}.`);
    }
    const instanceCode = `${catalogCode}-${String(sequence).padStart(2, "0")}`;
    const displayLabel = buildDisplayLabel(catalogCode, title, sequence);

    const clash = await ExhibitionItem.exists({ instanceCode });
    if (clash) continue;

    return { catalogCode, sequence, instanceCode, displayLabel };
  }

  throw new Error("Could not allocate a unique instance code — try again.");
}
