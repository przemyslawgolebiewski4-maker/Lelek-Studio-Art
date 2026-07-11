"use client";

import { useState } from "react";

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

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
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
    <section className="section-pad pt-28">
      <div className="container max-w-xl">
        <p className="eyebrow mb-3">Contact</p>
        <h1 className="text-[var(--text-3xl)]">Say something honest</h1>
        <p className="mt-4 text-metal">
          Questions about a piece, a commission, or collaboration - write directly.
        </p>

        {status === "success" ? (
          <p className="mt-8 border border-ink/10 bg-sand/20 p-4 text-sm">
            Message sent. Thank you - we will reply soon.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-10 grid gap-5">
            {error ? <p className="text-sm text-rust">{error}</p> : null}

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

            <label className="block">
              <span className="eyebrow mb-2 block">Type</span>
              <select
                className="w-full border border-ink/20 bg-cream px-3 py-2 outline-none focus:border-rust"
                value={form.type}
                onChange={(e) =>
                  setForm({ ...form, type: e.target.value as "general" | "architect" })
                }
              >
                <option value="general">General inquiry</option>
                <option value="architect">Architect / trade</option>
              </select>
            </label>

            <label className="block">
              <span className="eyebrow mb-2 block">Subject</span>
              <input
                className="w-full border border-ink/20 bg-cream px-3 py-2 outline-none focus:border-rust"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
              />
            </label>

            <label className="block">
              <span className="eyebrow mb-2 block">Message</span>
              <textarea
                rows={6}
                className="w-full border border-ink/20 bg-cream px-3 py-2 outline-none focus:border-rust"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
              />
            </label>

            <button
              type="submit"
              disabled={status === "loading"}
              className="btn-primary w-fit disabled:opacity-60"
            >
              {status === "loading" ? "Sending..." : "Send message"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
