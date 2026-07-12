"use client";

import { useState } from "react";
import { apiPost } from "@/lib/api";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    type: "general" as "general" | "architect",
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
    setForm({ name: "", email: "", subject: "", message: "", type: "general" });
  }

  return (
    <section className="section-pad page-top find-sec">
      <div className="container max-w-xl">
        <div className="sec-tag">Contact</div>
        <h1>Say something honest</h1>
        <p className="sec-intro mt-4">
          Questions about a piece, a commission, or collaboration — write directly.
        </p>

        {status === "success" ? (
          <p className="story-body mt-10">Message sent. Thank you — we will reply soon.</p>
        ) : (
          <form onSubmit={handleSubmit} className="form-panel grid gap-6">
            {error ? <p className="text-sm text-terra">{error}</p> : null}

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

            <label className="form-field">
              <span className="sec-tag !opacity-100">Type</span>
              <select
                className="form-input"
                value={form.type}
                onChange={(e) =>
                  setForm({ ...form, type: e.target.value as "general" | "architect" })
                }
              >
                <option value="general">General inquiry</option>
                <option value="architect">Architect / trade</option>
              </select>
            </label>

            <label className="form-field">
              <span className="sec-tag !opacity-100">Subject</span>
              <input
                className="form-input"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
              />
            </label>

            <label className="form-field">
              <span className="sec-tag !opacity-100">Message</span>
              <textarea
                rows={6}
                className="form-input resize-none"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
              />
            </label>

            <button
              type="submit"
              disabled={status === "loading"}
              className="btn-line-terra w-fit disabled:opacity-60"
            >
              {status === "loading" ? "Sending..." : "Send message →"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
