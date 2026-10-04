"use client";

import { useState } from "react";
import { useT } from "@/components/i18n/LocaleProvider";
import { apiPost } from "@/lib/api";

const MAX_FILES = 4;
const MAX_BYTES = 4 * 1024 * 1024;
const ACCEPT = new Set(["image/jpeg", "image/png", "image/webp"]);

type FormState = {
  name: string;
  email: string;
  company: string;
  projectType: string;
  location: string;
  dimensions: string;
  timeline: string;
  message: string;
  website: string;
};

const EMPTY: FormState = {
  name: "",
  email: "",
  company: "",
  projectType: "",
  location: "",
  dimensions: "",
  timeline: "",
  message: "",
  website: "",
};

async function uploadInquiryImage(file: File): Promise<string> {
  const body = new FormData();
  body.append("file", file);
  const res = await fetch("/api/inquiry-upload", { method: "POST", body });
  let data: { ok?: boolean; url?: string; error?: string } = {};
  try {
    data = await res.json();
  } catch {
    throw new Error("Could not upload the image");
  }
  if (!res.ok || !data.ok || typeof data.url !== "string") {
    throw new Error(data.error || "Could not upload the image");
  }
  return data.url;
}

export function ArchitectInquiryForm({
  successTitle = "Message received.",
  successBody = "Thank you. I will reply within a few business days.",
}: {
  successTitle?: string;
  successBody?: string;
}) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const tr = useT();

  function update(key: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function addFiles(list: FileList | null) {
    if (!list?.length) return;
    const next = [...files];
    let rejected = "";
    for (const file of Array.from(list)) {
      if (next.length >= MAX_FILES) {
        rejected = tr("form.imagesMax");
        break;
      }
      if (!ACCEPT.has(file.type)) {
        rejected = tr("form.imagesType");
        continue;
      }
      if (file.size > MAX_BYTES) {
        rejected = tr("form.imagesSize");
        continue;
      }
      next.push(file);
    }
    setFiles(next);
    setError(rejected);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    try {
      const attachments: string[] = [];
      if (!form.website) {
        for (const file of files) {
          attachments.push(await uploadInquiryImage(file));
        }
      }

      const res = await apiPost("/contact", {
        name: form.name,
        email: form.email,
        company: form.company,
        projectType: form.projectType,
        location: form.location,
        dimensions: form.dimensions,
        timeline: form.timeline,
        message: form.message,
        attachments,
        website: form.website,
        type: "architect",
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setStatus("error");
        setError(data.error ?? tr("contact.error"));
        return;
      }
      setStatus("success");
      setForm(EMPTY);
      setFiles([]);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : tr("contact.error"));
    }
  }

  if (status === "success") {
    return (
      <div className="trade-form-success" role="status">
        <p className="trade-form-success-h">{successTitle}</p>
        <p className="story-body">{successBody}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="form-light trade-inquiry">
      <div className="trade-hp" aria-hidden="true">
        <label htmlFor="arch-website">Website</label>
        <input
          id="arch-website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={(e) => update("website", e.target.value)}
        />
      </div>

      {error ? (
        <p className="form-error trade-form-error" role="alert">
          {error}
        </p>
      ) : null}

      <div className="form-row">
        <label className="form-lbl" htmlFor="arch-name">
          {tr("form.name")}
        </label>
        <input
          id="arch-name"
          className="form-inp"
          autoComplete="name"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          required
        />
      </div>

      <div className="form-row">
        <label className="form-lbl" htmlFor="arch-email">
          {tr("form.email")}
        </label>
        <input
          id="arch-email"
          type="email"
          className="form-inp"
          autoComplete="email"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          required
        />
      </div>

      <div className="form-row">
        <label className="form-lbl" htmlFor="arch-studio">
          {tr("form.studio")}
        </label>
        <input
          id="arch-studio"
          className="form-inp"
          autoComplete="organization"
          value={form.company}
          onChange={(e) => update("company", e.target.value)}
          placeholder={tr("form.optional")}
        />
      </div>

      <div className="form-row">
        <label className="form-lbl" htmlFor="arch-project">
          {tr("form.project")}
        </label>
        <select
          id="arch-project"
          className="form-inp"
          value={form.projectType}
          onChange={(e) => update("projectType", e.target.value)}
        >
          <option value="">{tr("form.optional")}</option>
          <option value="Residential">{tr("form.residential")}</option>
          <option value="Hospitality">{tr("form.hospitality")}</option>
          <option value="Commercial">{tr("form.commercial")}</option>
          <option value="Other">{tr("form.other")}</option>
        </select>
      </div>

      <div className="form-row">
        <label className="form-lbl" htmlFor="arch-location">
          {tr("form.location")}
        </label>
        <input
          id="arch-location"
          className="form-inp"
          value={form.location}
          onChange={(e) => update("location", e.target.value)}
          placeholder={tr("form.locationPh")}
        />
      </div>

      <div className="form-row">
        <label className="form-lbl" htmlFor="arch-dimensions">
          {tr("form.dimensions")}
        </label>
        <input
          id="arch-dimensions"
          className="form-inp"
          value={form.dimensions}
          onChange={(e) => update("dimensions", e.target.value)}
          placeholder={tr("form.dimensionsPh")}
        />
      </div>

      <div className="form-row">
        <label className="form-lbl" htmlFor="arch-timeline">
          {tr("form.timeline")}
        </label>
        <input
          id="arch-timeline"
          className="form-inp"
          value={form.timeline}
          onChange={(e) => update("timeline", e.target.value)}
          placeholder={tr("form.timelinePh")}
        />
      </div>

      <div className="form-row">
        <label className="form-lbl" htmlFor="arch-message">
          {tr("form.message")}
        </label>
        <textarea
          id="arch-message"
          className="form-inp"
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          placeholder={tr("form.messagePh")}
          required
        />
      </div>

      <div className="form-row trade-file-row">
        <span className="form-lbl" id="arch-refs-label">
          {tr("form.references")}
        </span>
        <div className="trade-file">
          <label className="trade-file-btn">
            {tr("form.addImages")}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              aria-labelledby="arch-refs-label"
              onChange={(e) => {
                addFiles(e.target.files);
                e.target.value = "";
              }}
            />
          </label>
          <p className="trade-file-hint">{tr("form.imagesHint")}</p>
          {files.length > 0 ? (
            <ul className="trade-file-list">
              {files.map((file, index) => (
                <li key={`${file.name}-${index}`}>
                  <span>{file.name}</span>
                  <button
                    type="button"
                    onClick={() => setFiles((prev) => prev.filter((_, i) => i !== index))}
                  >
                    {tr("form.remove")}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="form-submit" disabled={status === "loading"}>
          {status === "loading" ? tr("form.sending") : tr("form.sendInquiry")}
        </button>
      </div>
    </form>
  );
}
