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
    <section className="contact">
      <div className="contact-head">
        <h1 className="contact-h">
          Connect
          <br />
          with
          <br />
          the clay.
        </h1>
        <p className="contact-sub">
          Wall objects, custom orders, interior projects — or simply to say something. I work
          intuitively. I will respond the same way.
        </p>
      </div>

      {status === "success" ? (
        <div className="contact-form">
          <p className="contact-sub" style={{ opacity: 0.6 }}>
            Message sent. Thank you — we will reply soon.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="contact-form">
          {error ? <p className="form-error">{error}</p> : null}

          <div className="form-row">
            <div className="form-lbl">Name</div>
            <input
              className="form-inp"
              type="text"
              placeholder="your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-lbl">Email</div>
            <input
              className="form-inp"
              type="email"
              placeholder="your email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-lbl">About</div>
            <input
              className="form-inp"
              type="text"
              placeholder="interior project / custom order / other"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-lbl">Message</div>
            <textarea
              className="form-inp"
              placeholder="say something honest"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="form-submit" disabled={status === "loading"}>
              {status === "loading" ? "Sending..." : "Send it →"}
            </button>
            <div className="form-note">
              lelekstudio@lelekstudio.com
              <br />
              Clay Stories Berlin
            </div>
          </div>
        </form>
      )}
    </section>
  );
}
