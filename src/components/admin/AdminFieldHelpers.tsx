"use client";

import { AdminInput, AdminTextarea } from "@/components/admin/AdminShell";

export function AdminCharCount({
  value,
  softLimit,
}: {
  value: string;
  softLimit: number;
}) {
  const len = value.length;
  const over = len > softLimit;
  return (
    <p
      className="admin-muted"
      style={{
        marginTop: "-6px",
        marginBottom: "8px",
        color: over ? "#8a2b2b" : undefined,
      }}
    >
      {len} / ~{softLimit} characters{over ? " - over recommended length" : ""}
    </p>
  );
}

export function AdminSeoInput({
  label,
  value,
  onChange,
  softLimit = 60,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  softLimit?: number;
  placeholder?: string;
}) {
  return (
    <div>
      <AdminInput
        label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      <AdminCharCount value={value} softLimit={softLimit} />
    </div>
  );
}

export function AdminSeoTextarea({
  label,
  value,
  onChange,
  softLimit = 155,
  rows = 2,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  softLimit?: number;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <div>
      <AdminTextarea
        label={label}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      <AdminCharCount value={value} softLimit={softLimit} />
    </div>
  );
}

/** Consistent reorder controls for repeatable admin lists (up/down buttons). */
export function AdminReorderControls({
  index,
  total,
  onMove,
  onRemove,
}: {
  index: number;
  total: number;
  onMove: (from: number, to: number) => void;
  onRemove?: () => void;
}) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
      <button
        type="button"
        className="admin-btn ghost"
        disabled={index === 0}
        onClick={() => onMove(index, index - 1)}
      >
        Move up
      </button>
      <button
        type="button"
        className="admin-btn ghost"
        disabled={index >= total - 1}
        onClick={() => onMove(index, index + 1)}
      >
        Move down
      </button>
      {onRemove ? (
        <button type="button" className="admin-btn ghost" onClick={onRemove}>
          Remove
        </button>
      ) : null}
    </div>
  );
}

export function moveItem<T>(items: T[], from: number, to: number): T[] {
  if (to < 0 || to >= items.length || from === to) return items;
  const next = items.slice();
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item!);
  return next;
}
