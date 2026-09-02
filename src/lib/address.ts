/** Visit studio address fallback when Admin → Home → Find us → Studio address is empty. */
export const DEFAULT_VISIT_STUDIO_ADDRESS = "Kollwitzstrasse 82\n10435 Berlin";

export const DEFAULT_VISIT_STUDIO_NAME = "Clay Stories Berlin";

export type ParsedPostalAddress = {
  streetAddress: string;
  postalCode: string;
  addressLocality: string;
  addressCountry: string;
};

const DEFAULT_PARSED: ParsedPostalAddress = {
  streetAddress: "Kollwitzstrasse 82",
  postalCode: "10435",
  addressLocality: "Berlin",
  addressCountry: "DE",
};

/** Parse free-text studio_address from Admin (e.g. "Kollwitzstrasse 82\\n10435 Berlin"). */
export function parseStudioAddress(raw: string | undefined): ParsedPostalAddress {
  const text = raw?.trim();
  if (!text) return DEFAULT_PARSED;

  const lines = text.split(/\n+/).map((line) => line.trim()).filter(Boolean);
  if (lines.length === 0) return DEFAULT_PARSED;

  const commaMatch = text.match(/^(.+?),\s*(\d{5})\s+(.+)$/);
  if (commaMatch) {
    return {
      streetAddress: commaMatch[1].trim(),
      postalCode: commaMatch[2],
      addressLocality: commaMatch[3].trim(),
      addressCountry: "DE",
    };
  }

  const streetAddress = lines[0] || DEFAULT_PARSED.streetAddress;
  let postalCode = DEFAULT_PARSED.postalCode;
  let addressLocality = DEFAULT_PARSED.addressLocality;

  for (const line of lines.slice(1)) {
    const postalMatch = line.match(/^(\d{5})\s+(.+)$/);
    if (postalMatch) {
      postalCode = postalMatch[1];
      addressLocality = postalMatch[2].trim();
      break;
    }
  }

  return {
    streetAddress,
    postalCode,
    addressLocality,
    addressCountry: "DE",
  };
}
