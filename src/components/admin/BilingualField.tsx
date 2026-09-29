"use client";

import { AdminInput, AdminTextarea } from "@/components/admin/AdminShell";
import { displayPl, writePl } from "@/lib/i18n/cms";

export function LangPair({
  label,
  en,
  pl,
  onEn,
  onPl,
  multiline,
  rows = 3,
  placeholder,
}: {
  label: string;
  en: string;
  pl: string;
  onEn: (value: string) => void;
  onPl: (value: string) => void;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <div className="admin-lang-block">
      <div className="admin-lang-block-label">{label}</div>
      <div className="admin-lang-pair">
        {multiline ? (
          <>
            <AdminTextarea label="English" rows={rows} value={en} placeholder={placeholder} onChange={(e) => onEn(e.target.value)} />
            <AdminTextarea label="Polski" rows={rows} value={pl} onChange={(e) => onPl(e.target.value)} />
          </>
        ) : (
          <>
            <AdminInput label="English" value={en} placeholder={placeholder} onChange={(e) => onEn(e.target.value)} />
            <AdminInput label="Polski" value={pl} onChange={(e) => onPl(e.target.value)} />
          </>
        )}
      </div>
    </div>
  );
}

export function CmsLangField({
  content,
  onChange,
  name,
  label,
  multiline,
  rows,
  placeholder,
  fallbackEn,
}: {
  content: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
  name: string;
  label: string;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
  fallbackEn?: string;
}) {
  const en = typeof content[name] === "string" ? (content[name] as string) : "";
  const pl = displayPl(content, name, en, fallbackEn ?? placeholder);
  return (
    <LangPair
      label={label}
      en={en}
      pl={pl}
      multiline={multiline}
      rows={rows}
      placeholder={placeholder}
      onEn={(value) => onChange({ ...content, [name]: value })}
      onPl={(value) => onChange(writePl(content, name, value))}
    />
  );
}
