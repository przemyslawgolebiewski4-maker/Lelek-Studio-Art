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

  if (status === "success") {
    return (
      <p className="story-body">
        Thank you - your inquiry has been sent. We will reply within a few business days.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="form-light">
      {error ? <p className="form-error" style={{ color: "var(--B)" }}>{error}</p> : null}

      <div className="form-row">
        <div className="form-lbl">Name</div>
        <input
          className="form-inp"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-lbl">Email</div>
        <input
          type="email"
          className="form-inp"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-lbl">Company</div>
        <input
          className="form-inp"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
        />
      </div>

      <div className="form-row">
        <div className="form-lbl">Project</div>
        <select
          className="form-inp"
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
      </div>

      <div className="form-row">
        <div className="form-lbl">Subject</div>
        <input
          className="form-inp"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          placeholder="Wall objects for a hotel lobby"
        />
      </div>

      <div className="form-row">
        <div className="form-lbl">Details</div>
        <textarea
          className="form-inp"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder="Timeline, dimensions, quantity, location..."
          required
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="form-submit" disabled={status === "loading"}>
          {status === "loading" ? "Sending..." : "Send inquiry →"}
        </button>
      </div>
    </form>
  );
}
