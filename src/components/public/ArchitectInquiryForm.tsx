"use client";

import { useState } from "react";
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const res = await apiPost("/contact", form);
    const data = await res.json();

    if (!res.ok || !data.ok) {
      setStatus("error");
      setError(data.error ?? "Something went wrong");
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

  return (
    <>
      {status === "success" ? (
        <p className="story-body">
          Thank you — your inquiry has been sent. We will reply within a few business days.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="grid gap-6">
          {error ? <p className="text-sm text-terra">{error}</p> : null}

          <div className="grid gap-6 md:grid-cols-2">
            <label className="form-field">
              <span className="sec-tag !opacity-100">Name</span>
              <input
                className="form-input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </label>

            <label className="form-field">
              <span className="sec-tag !opacity-100">Email</span>
              <input
                type="email"
                className="form-input"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </label>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <label className="form-field">
              <span className="sec-tag !opacity-100">Company / Studio</span>
              <input
                className="form-input"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
              />
            </label>

            <label className="form-field">
              <span className="sec-tag !opacity-100">Project type</span>
              <select
                className="form-input"
                value={form.projectType}
                onChange={(e) => setForm({ ...form, projectType: e.target.value })}
              >
                <option value="">Select...</option>
                <option value="residential">Residential</option>
                <option value="hospitality">Hospitality</option>
                <option value="retail">Retail / concept store</option>
                <option value="office">Office / workspace</option>
                <option value="other">Other</option>
              </select>
            </label>
          </div>

          <label className="form-field">
            <span className="sec-tag !opacity-100">Subject</span>
            <input
              className="form-input"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder="Wall objects for a hotel lobby"
            />
          </label>

          <label className="form-field">
            <span className="sec-tag !opacity-100">Project details</span>
            <textarea
              rows={6}
              className="form-input resize-none"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Timeline, dimensions, quantity, location..."
              required
            />
          </label>

          <button
            type="submit"
            disabled={status === "loading"}
            className="btn-line-terra w-fit disabled:opacity-60"
          >
            {status === "loading" ? "Sending..." : "Send inquiry →"}
          </button>
        </form>
      )}
    </>
  );
}
