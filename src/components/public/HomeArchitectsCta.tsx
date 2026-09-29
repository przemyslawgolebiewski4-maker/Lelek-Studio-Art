"use client";

import { useState } from "react";
import { useLocale, useT } from "@/components/i18n/LocaleProvider";
import { localeText } from "@/lib/i18n/present";
import { apiPost } from "@/lib/api";
import type { ArchitectsSection } from "@/types/content";

type FormState = "idle" | "open" | "success";

export function HomeArchitectsCta({ section: s }: { section: ArchitectsSection }) {
  const [formState, setFormState] = useState<FormState>("idle");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const locale = useLocale();
  const tr = useT();

  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    projectType: "",
    message: "",
    type: "architect" as const,
  });

  function update(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError(tr("form.required"));
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await apiPost("/contact", form);
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error ?? tr("form.fail"));
        setSubmitting(false);
        return;
      }
      setFormState("success");
    } catch {
      setError(tr("form.network"));
      setSubmitting(false);
    }
  }

  const points = [
    { num: "01", title: localeText(locale, s.point1Title || "Wall objects"), body: localeText(locale, s.point1Body || "Handbuilt ceramic pieces for walls. Each exists once.") },
    { num: "02", title: localeText(locale, s.point2Title || "Vessels and objects"), body: localeText(locale, s.point2Body || "Sculptural forms for shelves, tables and surfaces. Selected, not configured.") },
    { num: "03", title: localeText(locale, s.point3Title || "Functional ceramics"), body: localeText(locale, s.point3Body || "Cups, bowls and vessels - forms that repeat, never exactly. Shaped by hand, not by mold.") },
  ];

  return (
    <section className="arch">

      {/* LEFT - always visible */}
      <div className="arch-left">
        {s.eyebrow ? (
          <div className="arch-eyebrow">{s.eyebrow}</div>
        ) : null}

        <h2 className="arch-h2">
          {localeText(locale, s.headline || "Objects for spaces")}
          {s.headlineEm ? (
            <> <em>{s.headlineEm}</em></>
          ) : null}
        </h2>

        {s.sub ? (
          <p className="arch-body">{s.sub}</p>
        ) : null}

        <div className="arch-points">
          {points.map((p) => (
            <div key={p.num} className="arch-point">
              <div className="arch-point-num">{p.num}</div>
              <div className="arch-point-text">
                <strong>{p.title}</strong>
                {p.body}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT - three states */}
      <div className="arch-right">

        {/* STATE 1: button */}
        {formState === "idle" && (
          <button
            className="arch-btn"
            onClick={() => setFormState("open")}
          >
            {localeText(locale, s.ctaText || "Get in touch")}
          </button>
        )}

        {/* STATE 2: inline form */}
        {formState === "open" && (
          <div className="arch-form-wrap">
            {s.formTitle ? (
              <div className="arch-form-title">{s.formTitle}</div>
            ) : null}

            <form onSubmit={handleSubmit} noValidate>
              <div className="arch-field">
                <div className="arch-field-label">{tr("form.name")}</div>
                <input
                  className="arch-field-input"
                  type="text"
                  placeholder={tr("contact.namePh")}
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  required
                />
              </div>
              <div className="arch-field">
                <div className="arch-field-label">{tr("form.studio")}</div>
                <input
                  className="arch-field-input"
                  type="text"
                  placeholder={tr("form.studioPh")}
                  value={form.company}
                  onChange={(e) => update("company", e.target.value)}
                />
              </div>
              <div className="arch-field">
                <div className="arch-field-label">{tr("form.email")}</div>
                <input
                  className="arch-field-input"
                  type="email"
                  placeholder={tr("contact.emailPh")}
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  required
                />
              </div>
              <div className="arch-field">
                <div className="arch-field-label">{tr("form.project")}</div>
                <select
                  className="arch-field-input arch-field-select"
                  value={form.projectType}
                  onChange={(e) => update("projectType", e.target.value)}
                >
                  <option value="" disabled>{tr("form.select")}</option>
                  <option>{tr("form.residential")}</option>
                  <option>{tr("form.hospitality")}</option>
                  <option>{tr("form.concept")}</option>
                  <option>{tr("form.public")}</option>
                  <option>{tr("form.other")}</option>
                </select>
              </div>
              <div className="arch-field arch-field-textarea">
                <div className="arch-field-label">{tr("form.message")}</div>
                <textarea
                  className="arch-field-input"
                  placeholder={tr("form.detailsPh")}
                  rows={3}
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  required
                />
              </div>

              {error ? (
                <p className="arch-error">{error}</p>
              ) : null}

              <div className="arch-form-actions">
                <button
                  type="submit"
                  className="arch-submit"
                  disabled={submitting}
                >
                  {submitting ? tr("form.sending") : `${tr("form.send")} →`}
                </button>
                <button
                  type="button"
                  className="arch-cancel"
                  onClick={() => {
                    setFormState("idle");
                    setError("");
                  }}
                >
                  {tr("form.cancel")}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STATE 3: success */}
        {formState === "success" && (
          <div className="arch-success">
            <div className="arch-success-num">01</div>
            <div className="arch-success-h">
              {localeText(locale, s.formSuccessTitle || "Message received.")}
            </div>
            <div className="arch-success-body">
              {localeText(locale, s.formSuccessBody || "We will get back to you within 1-2 working days.")}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
