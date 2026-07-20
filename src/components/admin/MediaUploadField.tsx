"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { uploadMedia, type UploadProgress } from "@/lib/media-upload";
import { formatFileSize } from "@/lib/upload-utils";

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
  const [progress, setProgress] = useState<UploadProgress | null>(null);
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
    setProgress(null);
    setError("");
    const result = await uploadMedia(file, folder, (event) => setProgress(event));
    setUploading(false);
    setProgress(null);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    onChange(result.url);
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
            <button type="button" className="admin-table-action" onClick={() => inputRef.current?.click()} disabled={uploading}>
              Replace
            </button>
            <button type="button" className="admin-table-action" onClick={() => onChange("")} disabled={uploading}>
              Remove
            </button>
          </div>
          {uploading ? (
            <div className="admin-media-preview-uploading">
              <span>Uploading… {progress ? `${progress.percentage}%` : ""}</span>
              {progress ? (
                <div className="admin-upload-progress">
                  <div className="admin-upload-progress-bar" style={{ width: `${progress.percentage}%` }} />
                </div>
              ) : null}
            </div>
          ) : null}
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
            <div className="admin-upload-status">
              <span className="admin-upload-title">
                Uploading… {progress ? `${progress.percentage}%` : ""}
              </span>
              {progress ? (
                <span className="admin-upload-sub">
                  {formatFileSize(progress.loaded)} / {formatFileSize(progress.total)}
                </span>
              ) : null}
            </div>
          ) : (
            <>
              <span className="admin-upload-title">
                Drop {mode === "video" ? "video" : "image"} here or click to upload
              </span>
              <span className="admin-upload-sub">
                {mode === "video"
                  ? "MP4 or WebM, max 80 MB - H.264, 720p recommended for faster upload"
                  : "JPG, PNG, WebP"}
              </span>
            </>
          )}
        </div>
      )}

      {uploading && progress ? (
        <div className="admin-upload-progress" aria-hidden="true">
          <div className="admin-upload-progress-bar" style={{ width: `${progress.percentage}%` }} />
        </div>
      ) : null}

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
        placeholder="Or paste URL - /images/… or https://…"
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
  hint?: string;
  thumbnailPosition?: string;
  onThumbnailPositionChange?: (position: string) => void;
};

export function ImageListField({
  label,
  value,
  onChange,
  folder,
  hint,
  thumbnailPosition = "center",
  onThumbnailPositionChange,
}: ImageListFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const urls = value
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  async function uploadFiles(files: FileList) {
    setUploading(true);
    setError("");
    const added: string[] = [];
    for (const file of Array.from(files)) {
      const result = await uploadMedia(file, folder);
      if (result.ok) added.push(result.url);
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

  function onDragStart(index: number) {
    setDragIndex(index);
  }

  function onDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    setDragOverIndex(index);
  }

  function onDrop(e: React.DragEvent, dropIndex: number) {
    e.preventDefault();
    if (dragIndex === null || dragIndex === dropIndex) {
      setDragIndex(null);
      setDragOverIndex(null);
      return;
    }
    const reordered = [...urls];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(dropIndex, 0, moved);
    onChange(reordered.join("\n"));
    setDragIndex(null);
    setDragOverIndex(null);
  }

  function onDragEnd() {
    setDragIndex(null);
    setDragOverIndex(null);
  }

  const POSITION_OPTIONS = [
    { value: "center", label: "Center" },
    { value: "top center", label: "Top" },
    { value: "bottom center", label: "Bottom" },
    { value: "center left", label: "Left" },
    { value: "center right", label: "Right" },
  ];

  return (
    <div className="admin-field">
      <span className="admin-field-label">{label}</span>

      {urls.length > 0 ? (
        <div className="admin-gallery-wrap">
          <div className="admin-gallery">
            {urls.map((url, i) => (
              <div
                key={`${url}-${i}`}
                className={`admin-gallery-item${dragOverIndex === i ? " admin-gallery-item--dragover" : ""}${dragIndex === i ? " admin-gallery-item--dragging" : ""}`}
                draggable
                onDragStart={() => onDragStart(i)}
                onDragOver={(e) => onDragOver(e, i)}
                onDrop={(e) => onDrop(e, i)}
                onDragEnd={onDragEnd}
              >
                <Image
                  src={url}
                  alt=""
                  fill
                  className="object-cover"
                  unoptimized
                  sizes="120px"
                  style={{ objectPosition: i === 0 ? thumbnailPosition : "center" }}
                />
                {i === 0 && (
                  <span className="admin-gallery-badge">Thumbnail</span>
                )}
                <button
                  type="button"
                  className="admin-gallery-remove"
                  onClick={() => removeAt(i)}
                  aria-label="Remove image"
                >
                  ×
                </button>
                <div className="admin-gallery-drag-hint" aria-hidden="true">⠿</div>
              </div>
            ))}
          </div>

          {onThumbnailPositionChange && (
            <div className="admin-thumb-position">
              <span className="admin-field-label" style={{ fontSize: "11px", marginBottom: "6px", display: "block" }}>
                Thumbnail crop position
              </span>
              <div className="admin-thumb-position-btns">
                {POSITION_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`admin-thumb-pos-btn${thumbnailPosition === opt.value ? " active" : ""}`}
                    onClick={() => onThumbnailPositionChange(opt.value)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <p className="admin-field-hint" style={{ marginTop: "6px" }}>
                Controls how the first image is cropped in catalog tiles (1:1 square).
              </p>
            </div>
          )}
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
          <span className="admin-muted">Uploading...</span>
        ) : (
          <span className="admin-upload-title">
            Add product images - click or drop multiple files
          </span>
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

      {hint ? <p className="admin-field-hint">{hint}</p> : null}
      {error ? <p className="admin-error" style={{ marginTop: 8 }}>{error}</p> : null}
    </div>
  );
}
