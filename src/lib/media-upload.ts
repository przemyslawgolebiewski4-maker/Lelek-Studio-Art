import { upload } from "@vercel/blob/client";
import {
  buildStoragePath,
  shouldUseMultipart,
  validateUploadFile,
} from "@/lib/upload-utils";

export type UploadProgress = {
  loaded: number;
  total: number;
  percentage: number;
};

export type UploadResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

async function uploadViaServer(file: File, folder: string): Promise<UploadResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const res = await fetch("/api/admin/upload", {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  const data = (await res.json()) as { ok?: boolean; url?: string; error?: string };
  if (!res.ok || !data.ok || !data.url) {
    return { ok: false, error: data.error ?? "Upload failed" };
  }
  return { ok: true, url: data.url };
}

export async function uploadMedia(
  file: File,
  folder: string,
  onProgress?: (progress: UploadProgress) => void,
): Promise<UploadResult> {
  const validationError = validateUploadFile(file);
  if (validationError) {
    return { ok: false, error: validationError };
  }

  if (!/^[a-z0-9-]+$/.test(folder)) {
    return { ok: false, error: "Invalid folder" };
  }

  if (typeof window !== "undefined") {
    try {
      const pathname = buildStoragePath(folder, file);
      const blob = await upload(pathname, file, {
        access: "public",
        handleUploadUrl: "/api/admin/upload/client",
        contentType: file.type,
        multipart: shouldUseMultipart(file),
        onUploadProgress: onProgress,
      });
      return { ok: true, url: blob.url };
    } catch {
      /* Fall back to server route (local dev without Blob client token) */
    }
  }

  return uploadViaServer(file, folder);
}
