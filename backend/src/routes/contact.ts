import { Router } from "express";
import { Resend } from "resend";
import { connectDB } from "../lib/db";
import { Message } from "../models";

const router = Router();

router.post("/", async (req, res) => {
  try {
    if (req.body.website) {
      res.json({ ok: true });
      return;
    }

    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
    const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const subject = typeof req.body.subject === "string" ? req.body.subject.trim() : "";
    const message = typeof req.body.message === "string" ? req.body.message.trim() : "";
    const company = typeof req.body.company === "string" ? req.body.company.trim() : "";
    const projectType = typeof req.body.projectType === "string" ? req.body.projectType.trim() : "";
    const type =
      req.body.type === "architect" || req.body.type === "custom-order"
        ? req.body.type
        : "general";

    if (!name || !email || !message) {
      res.status(400).json({ ok: false, error: "Name, email and message required" });
      return;
    }

    await connectDB();
    await Message.create({ name, email, subject, message, type, company, projectType });

    const resendKey = process.env.RESEND_KEY;
    const adminEmail = process.env.ADMIN_EMAIL;
    if (resendKey && adminEmail) {
      const resend = new Resend(resendKey);
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
            <p><strong>Type:</strong> ${type}</p>
            ${company ? `<p><strong>Company:</strong> ${company}</p>` : ""}
            ${projectType ? `<p><strong>Project type:</strong> ${projectType}</p>` : ""}
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Subject:</strong> ${subject || "-"}</p>
            <div style="background:#FAF6F1;padding:20px;margin-top:16px;border-left:3px solid #A36B3F">
              <p style="white-space:pre-wrap">${message}</p>
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
