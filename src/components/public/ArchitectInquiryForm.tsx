"use client";

import { useState } from "react";
import { useT } from "@/components/i18n/LocaleProvider";
import { apiPost } from "@/lib/api";

export function ArchitectInquiryForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    projectType: "",
    subject: "",
    message: "",
    type: "architect" as const,
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
    setForm({
      name: "",
      email: "",
      company: "",
      projectType: "",
      subject: "",
      message: "",
      type: "architect",
    });
  }

  if (status === "success") {
    return (
      <p className="story-body">
        {tr("form.success")}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="form-light">
      {error ? <p className="form-error" style={{ color: "var(--B)" }}>{error}</p> : null}

      <div className="form-row">
        <div className="form-lbl">{tr("form.name")}</div>
        <input
          className="form-inp"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-lbl">{tr("form.email")}</div>
        <input
          type="email"
          className="form-inp"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-lbl">{tr("form.company")}</div>
        <input
          className="form-inp"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
        />
      </div>

      <div className="form-row">
        <div className="form-lbl">{tr("form.project")}</div>
        <select
          className="form-inp"
          value={form.projectType}
          onChange={(e) => setForm({ ...form, projectType: e.target.value })}
        >
          <option value="">{tr("form.select")}</option>
          <option value="residential">{tr("form.residential")}</option>
          <option value="hospitality">{tr("form.hospitality")}</option>
          <option value="retail">{tr("form.retail")}</option>
          <option value="office">{tr("form.office")}</option>
          <option value="other">{tr("form.other")}</option>
        </select>
      </div>

      <div className="form-row">
        <div className="form-lbl">{tr("form.subject")}</div>
        <input
          className="form-inp"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          placeholder={tr("form.subjectPh")}
        />
      </div>

      <div className="form-row">
        <div className="form-lbl">{tr("form.details")}</div>
        <textarea
          className="form-inp"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder={tr("form.detailsPh")}
          required
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="form-submit" disabled={status === "loading"}>
          {status === "loading" ? tr("form.sending") : `${tr("form.send")} →`}
        </button>
      </div>
    </form>
  );
}
