import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { getAdminSession } from "@/lib/session";
import {
  buildStoragePath,
  isVideoType,
  validateUploadFile,
} from "@/lib/upload-utils";

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

  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "No file provided" }, { status: 400 });
  }

  const validationError = validateUploadFile(file);
  if (validationError) {
    return NextResponse.json({ ok: false, error: validationError }, { status: 400 });
  }

  const isVideo = isVideoType(file.type);
  const storagePath = buildStoragePath(folder, file);
  const buffer = Buffer.from(await file.arrayBuffer());

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const blob = await put(storagePath, buffer, {
        access: "public",
        contentType: file.type,
        addRandomSuffix: false,
        multipart: isVideo || file.size >= 5 * 1024 * 1024,
      });
      return NextResponse.json({ ok: true, url: blob.url });
    } catch (err) {
      return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
    }
  }

  if (process.env.NODE_ENV === "development") {
    try {
      const filename = path.basename(storagePath);
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
