"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { useT } from "@/components/i18n/LocaleProvider";
import {
  CONSENT_OPEN_EVENT,
  readConsent,
  writeConsent,
} from "@/lib/consent";
import { studioHref } from "@/lib/links";

export function CookieBanner() {
  const pathname = usePathname();
  const titleId = useId();
  const tr = useT();
  const [ready, setReady] = useState(false);
  const [showBar, setShowBar] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    if (pathname.startsWith("/admin")) {
      setReady(true);
      return;
    }

    const stored = readConsent();
    if (stored?.decided) {
      setAnalytics(stored.analytics);
      setMarketing(stored.marketing);
    } else {
      setShowBar(true);
    }
    setReady(true);

    const openPrefs = () => {
      const current = readConsent();
      setAnalytics(current?.analytics ?? false);
      setMarketing(current?.marketing ?? false);
      setShowBar(false);
      setShowPrefs(true);
    };

    window.addEventListener(CONSENT_OPEN_EVENT, openPrefs);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, openPrefs);
  }, [pathname]);

  if (!ready || pathname.startsWith("/admin")) return null;

  function save(nextAnalytics: boolean, nextMarketing: boolean) {
    writeConsent({ analytics: nextAnalytics, marketing: nextMarketing });
    setAnalytics(nextAnalytics);
    setMarketing(nextMarketing);
    setShowBar(false);
    setShowPrefs(false);
  }

  return (
    <>
      {showBar ? (
        <div className="cookie-banner" role="dialog" aria-modal="false" aria-labelledby={titleId}>
          <div className="cookie-banner__copy">
            <h2 id={titleId} className="cookie-banner__title">
              {tr("cookie.title")}
            </h2>
            <p>
              {tr("cookie.body")}{" "}
              <Link href={studioHref("/datenschutz")}>{tr("cookie.privacy")}</Link>
            </p>
          </div>
          <div className="cookie-banner__actions">
            <button type="button" className="btn-brutal" onClick={() => setShowPrefs(true)}>
              {tr("cookie.manage")}
            </button>
            <button type="button" className="btn-brutal filled" onClick={() => save(true, true)}>
              {tr("cookie.accept")}
            </button>
            <button type="button" className="btn-brutal" onClick={() => save(false, false)}>
              {tr("cookie.decline")}
            </button>
          </div>
        </div>
      ) : null}

      {showPrefs ? (
        <div className="cookie-prefs" role="presentation">
          <button
            type="button"
            className="cookie-prefs__overlay"
            aria-label={tr("cookie.close")}
            onClick={() => setShowPrefs(false)}
          />
          <div
            className="cookie-prefs__panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${titleId}-prefs`}
          >
            <div className="cookie-prefs__head">
              <h2 id={`${titleId}-prefs`}>{tr("cookie.prefsTitle")}</h2>
              <div className="cookie-prefs__actions">
                <button type="button" className="btn-brutal filled" onClick={() => save(true, true)}>
                  {tr("cookie.acceptAll")}
                </button>
                <button type="button" className="btn-brutal" onClick={() => save(false, false)}>
                  {tr("cookie.declineAll")}
                </button>
                <button
                  type="button"
                  className="btn-brutal"
                  onClick={() => save(analytics, marketing)}
                >
                  {tr("cookie.save")}
                </button>
              </div>
            </div>

            <p className="cookie-prefs__lede">
              {tr("cookie.lede")} <Link href={studioHref("/datenschutz")}>{tr("cookie.privacy")}</Link>.
            </p>

            <ul className="cookie-prefs__list">
              <li>
                <span>
                  <strong>{tr("cookie.required")}</strong>
                  <small>{tr("cookie.requiredHelp")}</small>
                </span>
                <span className="cookie-prefs__lock">{tr("cookie.on")}</span>
              </li>
              <li>
                <label>
                  <span>
                    <strong>{tr("cookie.analytics")}</strong>
                    <small>{tr("cookie.analyticsHelp")}</small>
                  </span>
                  <input
                    type="checkbox"
                    checked={analytics}
                    onChange={(event) => setAnalytics(event.target.checked)}
                  />
                </label>
              </li>
              <li>
                <label>
                  <span>
                    <strong>{tr("cookie.marketing")}</strong>
                    <small>{tr("cookie.marketingHelp")}</small>
                  </span>
                  <input
                    type="checkbox"
                    checked={marketing}
                    onChange={(event) => setMarketing(event.target.checked)}
                  />
                </label>
              </li>
            </ul>
          </div>
        </div>
      ) : null}
    </>
  );
}
