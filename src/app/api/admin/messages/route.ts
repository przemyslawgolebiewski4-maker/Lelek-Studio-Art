import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin, isUnauthorized } from "@/lib/auth";
import { Message } from "@/models";

export async function GET() {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  await connectDB();
  const messages = await Message.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ ok: true, messages });
}

export async function PATCH(request: NextRequest) {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  try {
    const body = await request.json();
    const id = typeof body.id === "string" ? body.id : "";
    if (!id) {
      return NextResponse.json({ ok: false, error: "Message id required" }, { status: 400 });
    }

    await connectDB();
    const message = await Message.findByIdAndUpdate(
      id,
      { read: body.read !== undefined ? Boolean(body.read) : true },
      { new: true },
    ).lean();

    if (!message) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, message });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Update failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
