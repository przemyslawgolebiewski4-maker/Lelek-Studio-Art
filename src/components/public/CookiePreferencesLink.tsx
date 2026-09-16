"use client";

import { openConsentPreferences } from "@/lib/consent";

export function CookiePreferencesLink() {
  return (
    <button type="button" className="foot-consent" onClick={openConsentPreferences}>
      Cookie preferences
    </button>
  );
}
