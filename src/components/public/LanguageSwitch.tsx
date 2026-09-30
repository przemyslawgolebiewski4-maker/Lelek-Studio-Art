"use client";

import { useRouter } from "next/navigation";
import { useT } from "@/components/i18n/LocaleProvider";
import { LOCALE_COOKIE, type Locale } from "@/lib/i18n/locale";

export function LanguageSwitch({ locale }: { locale: Locale }) {
  const router = useRouter();
  const tr = useT();

  function choose(next: Locale) {
    if (next === locale) return;
    const host = window.location.hostname;
    const shared = host === "lelekstudio.com" || host.endsWith(".lelekstudio.com");
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    if (shared) {
      document.cookie = `${LOCALE_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax${secure}`;
      document.cookie = `${LOCALE_COOKIE}=${next}; Path=/; Max-Age=31536000; SameSite=Lax; Domain=.lelekstudio.com${secure}`;
    } else {
      document.cookie = `${LOCALE_COOKIE}=${next}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`;
    }
    router.refresh();
  }

  return (
    <div className="lang-switch" role="group" aria-label={tr("lang.label")}>
      <button
        type="button"
        className={locale === "pl" ? "is-active" : undefined}
        aria-pressed={locale === "pl"}
        onClick={() => choose("pl")}
      >
        PL
      </button>
      <button
        type="button"
        className={locale === "en" ? "is-active" : undefined}
        aria-pressed={locale === "en"}
        onClick={() => choose("en")}
      >
        EN
      </button>
    </div>
  );
}
