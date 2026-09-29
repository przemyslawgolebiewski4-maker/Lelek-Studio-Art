"use client";

import { useState } from "react";
import { useT } from "@/components/i18n/LocaleProvider";
import { apiPost } from "@/lib/api";

export type ContactCopy = {
  headingLine1?: string;
  headingLine2?: string;
  headingLine3?: string;
  sub?: string;
  successMessage?: string;
  formNote?: string;
};

const DEFAULTS: Required<ContactCopy> = {
  headingLine1: "Connect",
  headingLine2: "with",
  headingLine3: "the clay.",
  sub: "Wall objects, commissions, a piece for the home - or simply to say something. I work intuitively. I will respond the same way.",
  successMessage: "Message sent. Thank you - we will reply soon.",
  formNote: "lelekstudio@lelekstudio.com\nClay Stories Berlin",
};

export default function ContactForm({ copy }: { copy?: ContactCopy }) {
  const c = { ...DEFAULTS, ...copy };
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    type: "general" as "general" | "architect",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const tr = useT();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const res = await apiPost("/contact", form);
    const data = await res.json();

    if (!res.ok || !data.ok) {
      setStatus("error");
      setError(data.error ?? tr("contact.error"));
      return;
    }

    setStatus("success");
    setForm({ name: "", email: "", subject: "", message: "", type: "general" });
  }

  return (
    <section className="contact">
      <div className="contact-head">
        <h1 className="contact-h">
          {c.headingLine1}
          <br />
          {c.headingLine2}
          <br />
          {c.headingLine3}
        </h1>
        <p className="contact-sub">{c.sub}</p>
      </div>

      {status === "success" ? (
        <div className="contact-form">
          <p className="contact-sub" style={{ opacity: 0.6 }}>
            {c.successMessage}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="contact-form">
          {error ? <p className="form-error">{error}</p> : null}

          <div className="form-row">
            <div className="form-lbl">{tr("contact.name")}</div>
            <input
              className="form-inp"
              type="text"
              placeholder={tr("contact.namePh")}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-lbl">{tr("contact.email")}</div>
            <input
              className="form-inp"
              type="email"
              placeholder={tr("contact.emailPh")}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-lbl">{tr("contact.about")}</div>
            <input
              className="form-inp"
              type="text"
              placeholder={tr("contact.aboutPh")}
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-lbl">{tr("contact.message")}</div>
            <textarea
              className="form-inp"
              placeholder={tr("contact.messagePh")}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="form-submit" disabled={status === "loading"}>
              {status === "loading" ? tr("contact.sending") : `${tr("contact.send")} →`}
            </button>
            <div className="form-note" style={{ whiteSpace: "pre-line" }}>
              {c.formNote}
            </div>
          </div>
        </form>
      )}
    </section>
  );
}
