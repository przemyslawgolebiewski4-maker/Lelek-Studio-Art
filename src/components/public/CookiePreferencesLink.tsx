"use client";

import { openConsentPreferences } from "@/lib/consent";

export function CookiePreferencesLink({ label = "Cookie preferences" }: { label?: string }) {
  return (
    <button type="button" className="foot-consent" onClick={openConsentPreferences}>
      {label}
    </button>
  );
}
