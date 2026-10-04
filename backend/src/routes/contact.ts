import { Router } from "express";
import { Resend } from "resend";
import { connectDB } from "../lib/db";
import { Message } from "../models";

const router = Router();

function clip(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function inquiryAttachments(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const out: string[] = [];
  for (const item of value) {
    if (typeof item !== "string") continue;
    const url = item.trim();
    if (!url || url.length > 500) continue;
    if (url.startsWith("/uploads/inquiries/")) {
      out.push(url);
    } else {
      try {
        const parsed = new URL(url);
        const blob =
          parsed.protocol === "https:" &&
          parsed.hostname.endsWith(".blob.vercel-storage.com") &&
          parsed.pathname.includes("/inquiries/");
        if (blob) out.push(url);
      } catch {
        continue;
      }
    }
    if (out.length >= 4) break;
  }
  return out;
}

router.post("/", async (req, res) => {
  try {
    if (req.body.website) {
      res.json({ ok: true });
      return;
    }

    const name = clip(req.body.name, 200);
    const email = clip(req.body.email, 200).toLowerCase();
    const subject = clip(req.body.subject, 200);
    const message = clip(req.body.message, 8000);
    const company = clip(req.body.company, 200);
    const projectType = clip(req.body.projectType, 80);
    const location = clip(req.body.location, 300);
    const dimensions = clip(req.body.dimensions, 300);
    const timeline = clip(req.body.timeline, 300);
    const attachments = inquiryAttachments(req.body.attachments);
    const type =
      req.body.type === "architect" || req.body.type === "custom-order"
        ? req.body.type
        : "general";

    if (!name || !email || !message) {
      res.status(400).json({ ok: false, error: "Name, email and message required" });
      return;
    }

    await connectDB();
    await Message.create({
      name,
      email,
      subject,
      message,
      type,
      company,
      projectType,
      location,
      dimensions,
      timeline,
      attachments,
    });

    const resendKey = process.env.RESEND_KEY;
    const adminEmail = process.env.ADMIN_EMAIL;
    if (resendKey && adminEmail) {
      const resend = new Resend(resendKey);
      const rows = [
        ["Type", type],
        ["Name", name],
        ["Email", email],
        ["Studio", company],
        ["Project", projectType],
        ["Location", location],
        ["Dimensions", dimensions],
        ["Timeline", timeline],
        ["Subject", subject],
      ]
        .filter(([, value]) => value)
        .map(
          ([label, value]) =>
            `<p><strong>${esc(label)}:</strong> ${
              label === "Email" ? `<a href="mailto:${esc(value)}">${esc(value)}</a>` : esc(value)
            }</p>`,
        )
        .join("");
      const files =
        attachments.length > 0
          ? `<p><strong>References:</strong></p><ul>${attachments
              .map((url) => `<li><a href="${esc(url)}">${esc(url)}</a></li>`)
              .join("")}</ul>`
          : "";

      await resend.emails.send({
        from: "Lelek Studio <contact@lelekstudio.com>",
        to: adminEmail,
        replyTo: email,
        subject: `New message from ${name} - ${type}`,
        html: `
          <div style="font-family:Georgia,serif;max-width:600px;color:#3A2F28">
            <h2 style="font-weight:400;border-bottom:1px solid #E6D8C7;padding-bottom:16px">
              New message from lelekstudio.com
            </h2>
            ${rows}
            ${files}
            <div style="background:#FAF6F1;padding:20px;margin-top:16px;border-left:3px solid #A36B3F">
              <p style="white-space:pre-wrap">${esc(message)}</p>
            </div>
          </div>
        `,
      });
    }

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
});

export default router;
