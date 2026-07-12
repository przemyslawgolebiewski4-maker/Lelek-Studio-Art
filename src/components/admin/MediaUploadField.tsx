"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { apiUpload } from "@/lib/api";

type MediaUploadFieldProps = {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder: string;
  accept?: string;
  hint?: string;
  mode?: "image" | "video" | "any";
};

export function MediaUploadField({
  label,
  value,
  onChange,
  folder,
  accept,
  hint,
  mode = "image",
}: MediaUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const defaultAccept =
    mode === "video"
      ? "video/mp4,video/webm"
      : mode === "any"
        ? "image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
        : "image/jpeg,image/png,image/webp,image/gif";

  async function uploadFile(file: File) {
    setUploading(true);
    setError("");
    const { res, data } = await apiUpload(file, folder);
    setUploading(false);
    if (!res.ok || !data.ok || !data.url) {
      setError(data.error ?? "Upload failed");
      return;
    }
    onChange(data.url);
  }

  function onFilePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = "";
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }

  const isVideo = value.match(/\.(mp4|webm)(\?|$)/i);

  return (
    <div className="admin-field">
      <span className="admin-field-label">{label}</span>

      {value ? (
        <div className="admin-media-preview">
          {isVideo ? (
            <video src={value} muted playsInline controls className="admin-media-preview-el" />
          ) : (
            <Image
              src={value}
              alt=""
              width={480}
              height={320}
              className="admin-media-preview-el"
              unoptimized
            />
          )}
          <div className="admin-media-preview-actions">
            <button type="button" className="admin-table-action" onClick={() => inputRef.current?.click()}>
              Replace
            </button>
            <button type="button" className="admin-table-action" onClick={() => onChange("")}>
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`admin-upload-zone ${dragOver ? "is-drag" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
          }}
          role="button"
          tabIndex={0}
        >
          {uploading ? (
            <span className="admin-muted">Uploading…</span>
          ) : (
            <>
              <span className="admin-upload-title">
                Drop {mode === "video" ? "video" : "image"} here or click to upload
              </span>
              <span className="admin-upload-sub">JPG, PNG, WebP{mode !== "image" ? ", MP4" : ""}</span>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept ?? defaultAccept}
        className="admin-upload-input"
        onChange={onFilePick}
      />

      <input
        className="admin-field-input admin-url-fallback"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Or paste URL — /images/… or https://…"
      />

      {hint ? <p className="admin-field-hint">{hint}</p> : null}
      {error ? <p className="admin-error" style={{ marginTop: 8 }}>{error}</p> : null}
    </div>
  );
}

type ImageListFieldProps = {
  label: string;
  value: string;
  onChange: (urls: string) => void;
  folder: string;
};

export function ImageListField({ label, value, onChange, folder }: ImageListFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const urls = value
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  async function uploadFiles(files: FileList) {
    setUploading(true);
    setError("");
    const added: string[] = [];
    for (const file of Array.from(files)) {
      const { res, data } = await apiUpload(file, folder);
      if (res.ok && data.ok && data.url) added.push(data.url);
    }
    setUploading(false);
    if (added.length === 0) {
      setError("No files uploaded");
      return;
    }
    onChange([...urls, ...added].join("\n"));
  }

  function removeAt(index: number) {
    onChange(urls.filter((_, i) => i !== index).join("\n"));
  }

  return (
    <div className="admin-field">
      <span className="admin-field-label">{label}</span>

      {urls.length > 0 ? (
        <div className="admin-gallery">
          {urls.map((url, i) => (
            <div key={`${url}-${i}`} className="admin-gallery-item">
              <Image src={url} alt="" fill className="object-cover" unoptimized sizes="120px" />
              <button type="button" className="admin-gallery-remove" onClick={() => removeAt(i)}>
                ×
              </button>
            </div>
          ))}
        </div>
      ) : null}

      <div
        className="admin-upload-zone"
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
      >
        {uploading ? (
          <span className="admin-muted">Uploading…</span>
        ) : (
          <span className="admin-upload-title">Add product images — click or drop multiple files</span>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        className="admin-upload-input"
        onChange={(e) => {
          if (e.target.files?.length) uploadFiles(e.target.files);
          e.target.value = "";
        }}
      />

      <textarea
        className="admin-field-input"
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="One image URL per line (optional manual edit)"
        style={{ marginTop: 12, fontStyle: "normal", fontFamily: "var(--font-mono)", fontSize: "12px" }}
      />

      {error ? <p className="admin-error" style={{ marginTop: 8 }}>{error}</p> : null}
    </div>
  );
}
