export const CONSENT_STORAGE_KEY = "lelek-cookie-consent";
export const CONSENT_OPEN_EVENT = "lelek-open-consent";

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID?.trim() || "GT-NML4M7CV";

export const GA_LINKER_DOMAINS = [
  "lelekstudio.com",
  "www.lelekstudio.com",
  "shop.lelekstudio.com",
] as const;

export type ConsentChoice = {
  decided: boolean;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
};

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

export const CONSENT_BOOTSTRAP_SCRIPT = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  ad_storage: 'denied',
  analytics_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  wait_for_update: 500
});
try {
  var raw = localStorage.getItem('${CONSENT_STORAGE_KEY}');
  if (raw) {
    var c = JSON.parse(raw);
    if (c && c.decided) {
      gtag('consent', 'update', {
        analytics_storage: c.analytics ? 'granted' : 'denied',
        ad_storage: c.marketing ? 'granted' : 'denied',
        ad_user_data: c.marketing ? 'granted' : 'denied',
        ad_personalization: c.marketing ? 'granted' : 'denied'
      });
    }
  }
} catch (e) {}
`;

export function readConsent(): ConsentChoice | null {
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentChoice;
    if (typeof parsed?.decided !== "boolean") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeConsent(choice: Omit<ConsentChoice, "updatedAt" | "decided">): ConsentChoice {
  const next: ConsentChoice = {
    decided: true,
    analytics: choice.analytics,
    marketing: choice.marketing,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(next));
  applyConsent(next);
  return next;
}

export function applyConsent(choice: Pick<ConsentChoice, "analytics" | "marketing">) {
  if (typeof window.gtag !== "function") return;
  window.gtag("consent", "update", {
    analytics_storage: choice.analytics ? "granted" : "denied",
    ad_storage: choice.marketing ? "granted" : "denied",
    ad_user_data: choice.marketing ? "granted" : "denied",
    ad_personalization: choice.marketing ? "granted" : "denied",
  });
}

export function openConsentPreferences() {
  window.dispatchEvent(new Event(CONSENT_OPEN_EVENT));
}
