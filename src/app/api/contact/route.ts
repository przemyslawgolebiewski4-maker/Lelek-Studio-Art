import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Message } from "@/models";

async function sendResendEmail(payload: {
  name: string;
  email: string;
  subject: string;
  message: string;
  type: string;
}) {
  const apiKey = process.env.RESEND_KEY;
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!apiKey || !adminEmail) {
    throw new Error("Email configuration missing");
  }

  const typeLabel = payload.type === "architect" ? "Architect inquiry" : "General contact";
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "contact@lelekstudio.com",
      to: adminEmail,
      reply_to: payload.email,
      subject: `[Lelek Studio] ${payload.subject || typeLabel} - from ${payload.name}`,
      html: `
        <div style="font-family:Georgia,serif;max-width:600px;color:#3A2F28">
          <h2 style="font-weight:400;border-bottom:1px solid #E6D8C7;padding-bottom:16px">
            New message from lelekstudio.com
          </h2>
          <p><strong>Type:</strong> ${typeLabel}</p>
          <p><strong>Name:</strong> ${payload.name}</p>
          <p><strong>Email:</strong> <a href="mailto:${payload.email}">${payload.email}</a></p>
          <p><strong>Subject:</strong> ${payload.subject || "-"}</p>
          <div style="background:#FAF6F1;padding:20px;margin-top:16px;border-left:3px solid #A36B3F">
            <p style="white-space:pre-wrap">${payload.message}</p>
          </div>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Resend error: ${err}`);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const subject = typeof body.subject === "string" ? body.subject.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const type = body.type === "architect" ? "architect" : "general";

    if (!name || !email || !message) {
      return NextResponse.json({ ok: false, error: "Name, email and message required" }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
    }

    await connectDB();
    await Message.create({ name, email, subject, message, type });

    try {
      await sendResendEmail({ name, email, subject, message, type });
    } catch (emailError) {
      console.error("Resend failed:", emailError);
      // Message saved - still return ok if DB save succeeded
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to send message";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
