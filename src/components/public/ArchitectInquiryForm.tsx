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
    <div className="mt-12 border border-ink/10 bg-sand/10 p-6 md:p-8">
      {status === "success" ? (
        <p className="border border-ink/10 bg-cream p-4 text-sm">
          Thank you — your inquiry has been sent. We will reply within a few business days.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="grid gap-5">
          {error ? <p className="text-sm text-rust">{error}</p> : null}

          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="eyebrow mb-2 block">Name</span>
              <input
                className="w-full border border-ink/20 bg-cream px-3 py-2 outline-none focus:border-rust"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </label>

            <label className="block">
              <span className="eyebrow mb-2 block">Email</span>
              <input
                type="email"
                className="w-full border border-ink/20 bg-cream px-3 py-2 outline-none focus:border-rust"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="eyebrow mb-2 block">Company / Studio</span>
              <input
                className="w-full border border-ink/20 bg-cream px-3 py-2 outline-none focus:border-rust"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
              />
            </label>

            <label className="block">
              <span className="eyebrow mb-2 block">Project type</span>
              <select
                className="w-full border border-ink/20 bg-cream px-3 py-2 outline-none focus:border-rust"
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

          <label className="block">
            <span className="eyebrow mb-2 block">Subject</span>
            <input
              className="w-full border border-ink/20 bg-cream px-3 py-2 outline-none focus:border-rust"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder="Wall objects for a hotel lobby"
            />
          </label>

          <label className="block">
            <span className="eyebrow mb-2 block">Project details</span>
            <textarea
              rows={6}
              className="w-full border border-ink/20 bg-cream px-3 py-2 outline-none focus:border-rust"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Timeline, dimensions, quantity, location..."
              required
            />
          </label>

          <button
            type="submit"
            disabled={status === "loading"}
            className="btn-primary w-fit disabled:opacity-60"
          >
            {status === "loading" ? "Sending..." : "Send inquiry"}
          </button>
        </form>
      )}
    </div>
  );
}
