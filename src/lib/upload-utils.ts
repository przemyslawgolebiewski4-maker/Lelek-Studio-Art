const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const VIDEO_TYPES = new Set(["video/mp4", "video/webm"]);

export const MAX_IMAGE_BYTES = 12 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 80 * 1024 * 1024;
export const MULTIPART_THRESHOLD_BYTES = 5 * 1024 * 1024;

export const ALLOWED_UPLOAD_TYPES = [...IMAGE_TYPES, ...VIDEO_TYPES];

export function isImageType(type: string) {
  return IMAGE_TYPES.has(type);
}

export function isVideoType(type: string) {
  return VIDEO_TYPES.has(type);
}

export function isAllowedUploadType(type: string) {
  return isImageType(type) || isVideoType(type);
}

export function safeUploadName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-").slice(0, 80);
}

export function buildStoragePath(folder: string, file: File) {
  const ext = file.name.match(/\.[a-z0-9]+$/i)?.[0]?.toLowerCase() ?? (isVideoType(file.type) ? ".mp4" : ".jpg");
  const filename = `${Date.now()}-${safeUploadName(file.name.replace(/\.[a-z0-9]+$/i, ""))}${ext}`;
  return `uploads/${folder}/${filename}`;
}

export function validateUploadFile(file: File): string | null {
  if (!file.size) return "No file provided";
  if (!isAllowedUploadType(file.type)) {
    return "Use JPG, PNG, WebP, GIF, MP4 or WebM";
  }
  if (isImageType(file.type) && file.size > MAX_IMAGE_BYTES) {
    return "Image max 12 MB";
  }
  if (isVideoType(file.type) && file.size > MAX_VIDEO_BYTES) {
    return "Video max 80 MB";
  }
  return null;
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function shouldUseMultipart(file: File) {
  return isVideoType(file.type) || file.size >= MULTIPART_THRESHOLD_BYTES;
}
