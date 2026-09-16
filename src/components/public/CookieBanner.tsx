"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import {
  CONSENT_OPEN_EVENT,
  readConsent,
  writeConsent,
} from "@/lib/consent";

export function CookieBanner() {
  const pathname = usePathname();
  const titleId = useId();
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
              Cookie consent
            </h2>
            <p>
              We and our partners, including Google, use cookies for analytics and marketing.
              These load only after you accept.{" "}
              <Link href="/datenschutz">Privacy Policy</Link>
            </p>
          </div>
          <div className="cookie-banner__actions">
            <button type="button" className="btn-brutal" onClick={() => setShowPrefs(true)}>
              Manage preferences
            </button>
            <button type="button" className="btn-brutal filled" onClick={() => save(true, true)}>
              Accept
            </button>
            <button type="button" className="btn-brutal" onClick={() => save(false, false)}>
              Decline
            </button>
          </div>
        </div>
      ) : null}

      {showPrefs ? (
        <div className="cookie-prefs" role="presentation">
          <button
            type="button"
            className="cookie-prefs__overlay"
            aria-label="Close cookie preferences"
            onClick={() => setShowPrefs(false)}
          />
          <div
            className="cookie-prefs__panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${titleId}-prefs`}
          >
            <div className="cookie-prefs__head">
              <h2 id={`${titleId}-prefs`}>Cookie and privacy preferences</h2>
              <div className="cookie-prefs__actions">
                <button type="button" className="btn-brutal filled" onClick={() => save(true, true)}>
                  Accept all
                </button>
                <button type="button" className="btn-brutal" onClick={() => save(false, false)}>
                  Decline all
                </button>
                <button
                  type="button"
                  className="btn-brutal"
                  onClick={() => save(analytics, marketing)}
                >
                  Save my choices
                </button>
              </div>
            </div>

            <p className="cookie-prefs__lede">
              Required cookies keep the site working. Analytics and marketing stay off until you
              choose them. Details: <Link href="/datenschutz">Datenschutz</Link>.
            </p>

            <ul className="cookie-prefs__list">
              <li>
                <span>
                  <strong>Required</strong>
                  <small>Needed for the site, language and your cookie choice.</small>
                </span>
                <span className="cookie-prefs__lock">On</span>
              </li>
              <li>
                <label>
                  <span>
                    <strong>Analytics</strong>
                    <small>Google Analytics — how the studio site is used. Shared with the shop.</small>
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
                    <strong>Marketing</strong>
                    <small>Google ads and measurement across studio and shop.</small>
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
