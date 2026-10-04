import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { buildStoragePath, isImageType } from "@/lib/upload-utils";

const MAX_BYTES = 4 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);

function originAllowed(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    const host = new URL(origin).hostname;
    return (
      host === "localhost" ||
      host === "127.0.0.1" ||
      host === "lelekstudio.com" ||
      host.endsWith(".lelekstudio.com") ||
      host.endsWith(".vercel.app")
    );
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  if (!originAllowed(request)) {
    return NextResponse.json({ ok: false, error: "Upload not allowed" }, { status: 403 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "No file provided" }, { status: 400 });
  }
  if (!isImageType(file.type) || !ALLOWED.has(file.type)) {
    return NextResponse.json({ ok: false, error: "Use JPG, PNG or WebP" }, { status: 400 });
  }
  if (!file.size || file.size > MAX_BYTES) {
    return NextResponse.json({ ok: false, error: "Each image can be up to 4 MB" }, { status: 400 });
  }

  const storagePath = buildStoragePath("inquiries", file);
  const buffer = Buffer.from(await file.arrayBuffer());

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const blob = await put(storagePath, buffer, {
        access: "public",
        contentType: file.type,
        addRandomSuffix: true,
      });
      return NextResponse.json({ ok: true, url: blob.url });
    } catch (err) {
      return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
    }
  }

  if (process.env.NODE_ENV === "development") {
    try {
      const filename = path.basename(storagePath);
      const dir = path.join(process.cwd(), "public", "uploads", "inquiries");
      await mkdir(dir, { recursive: true });
      await writeFile(path.join(dir, filename), buffer);
      return NextResponse.json({ ok: true, url: `/uploads/inquiries/${filename}` });
    } catch (err) {
      return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
    }
  }

  return NextResponse.json(
    {
      ok: false,
      error: "Image upload is unavailable right now. Send the inquiry without images, or email them.",
    },
    { status: 501 },
  );
}
