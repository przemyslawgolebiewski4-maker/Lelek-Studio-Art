"use client";

import { useState } from "react";
import { apiPost } from "@/lib/api";
import type { ArchitectsSection } from "@/types/content";

type FormState = "idle" | "open" | "success";

export function HomeArchitectsCta({ section: s }: { section: ArchitectsSection }) {
  const [formState, setFormState] = useState<FormState>("idle");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

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
      setError("Name, email and message are required.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await apiPost("/contact", form);
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }
      setFormState("success");
    } catch {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  const points = [
    { num: "01", title: s.point1Title ?? "Wall objects", body: s.point1Body ?? "Custom dimensions on request - functional and sculptural" },
    { num: "02", title: s.point2Title ?? "Table ceramics", body: s.point2Body ?? "Cups, bowls and vessels for hospitality and residential" },
    { num: "03", title: s.point3Title ?? "Sculptural objects", body: s.point3Body ?? "One-off pieces for interiors that demand presence" },
  ];

  return (
    <section className="arch">

      {/* LEFT - always visible */}
      <div className="arch-left">
        {s.eyebrow ? (
          <div className="arch-eyebrow">{s.eyebrow}</div>
        ) : null}

        <h2 className="arch-h2">
          {s.headline ?? "Objects for spaces"}
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
            {s.ctaText ?? "Get in touch"}
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
                <div className="arch-field-label">Name</div>
                <input
                  className="arch-field-input"
                  type="text"
                  placeholder="your name"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  required
                />
              </div>
              <div className="arch-field">
                <div className="arch-field-label">Studio</div>
                <input
                  className="arch-field-input"
                  type="text"
                  placeholder="studio or company"
                  value={form.company}
                  onChange={(e) => update("company", e.target.value)}
                />
              </div>
              <div className="arch-field">
                <div className="arch-field-label">Email</div>
                <input
                  className="arch-field-input"
                  type="email"
                  placeholder="your email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  required
                />
              </div>
              <div className="arch-field">
                <div className="arch-field-label">Project</div>
                <select
                  className="arch-field-input arch-field-select"
                  value={form.projectType}
                  onChange={(e) => update("projectType", e.target.value)}
                >
                  <option value="" disabled>select type</option>
                  <option>Residential</option>
                  <option>Hospitality</option>
                  <option>Concept store</option>
                  <option>Public space</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="arch-field arch-field-textarea">
                <div className="arch-field-label">Message</div>
                <textarea
                  className="arch-field-input"
                  placeholder="tell us about your project"
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
                  {submitting ? "Sending..." : "Send it \u2192"}
                </button>
                <button
                  type="button"
                  className="arch-cancel"
                  onClick={() => {
                    setFormState("idle");
                    setError("");
                  }}
                >
                  Cancel
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
              {s.formSuccessTitle ?? "Message received."}
            </div>
            <div className="arch-success-body">
              {s.formSuccessBody ?? "We will get back to you within 1-2 working days."}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
