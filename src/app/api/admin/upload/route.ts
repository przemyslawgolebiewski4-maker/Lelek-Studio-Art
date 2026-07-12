import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { getAdminSession } from "@/lib/session";

const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const VIDEO_TYPES = new Set(["video/mp4", "video/webm"]);
const MAX_IMAGE_BYTES = 12 * 1024 * 1024;
const MAX_VIDEO_BYTES = 80 * 1024 * 1024;

function safeName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-").slice(0, 80);
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file");
  const folderRaw = formData.get("folder");
  const folder =
    typeof folderRaw === "string" && /^[a-z0-9-]+$/.test(folderRaw) ? folderRaw : "misc";

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ ok: false, error: "No file provided" }, { status: 400 });
  }

  const isImage = IMAGE_TYPES.has(file.type);
  const isVideo = VIDEO_TYPES.has(file.type);
  if (!isImage && !isVideo) {
    return NextResponse.json(
      { ok: false, error: "Use JPG, PNG, WebP, GIF, MP4 or WebM" },
      { status: 400 },
    );
  }

  if (isImage && file.size > MAX_IMAGE_BYTES) {
    return NextResponse.json({ ok: false, error: "Image max 12 MB" }, { status: 400 });
  }
  if (isVideo && file.size > MAX_VIDEO_BYTES) {
    return NextResponse.json({ ok: false, error: "Video max 80 MB" }, { status: 400 });
  }

  const ext = path.extname(file.name) || (isVideo ? ".mp4" : ".jpg");
  const filename = `${Date.now()}-${safeName(path.basename(file.name, ext))}${ext.toLowerCase()}`;
  const storagePath = `uploads/${folder}/${filename}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const blob = await put(storagePath, buffer, {
        access: "public",
        contentType: file.type,
        addRandomSuffix: false,
      });
      return NextResponse.json({ ok: true, url: blob.url });
    } catch (err) {
      return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
    }
  }

  if (process.env.NODE_ENV === "development") {
    try {
      const dir = path.join(process.cwd(), "public", "uploads", folder);
      await mkdir(dir, { recursive: true });
      await writeFile(path.join(dir, filename), buffer);
      return NextResponse.json({ ok: true, url: `/${storagePath}` });
    } catch (err) {
      return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
    }
  }

  return NextResponse.json(
    {
      ok: false,
      error:
        "Upload requires BLOB_READ_WRITE_TOKEN on Vercel. Add it in project env, or paste an image URL manually.",
    },
    { status: 501 },
  );
}
