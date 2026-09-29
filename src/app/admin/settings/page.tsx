"use client";

import { useEffect, useState } from "react";
import {
  AdminShell,
  AdminCard,
  AdminButton,
  AdminInput,
  AdminTextarea,
} from "@/components/admin/AdminShell";
import { AdminSeoTextarea } from "@/components/admin/AdminFieldHelpers";
import { LangPair } from "@/components/admin/BilingualField";
import { DEFAULT_DESCRIPTION, DEFAULT_TAGLINE } from "@/lib/brand";
import { suggestPl } from "@/lib/i18n/dictionary";
import { CONTACT_DEFAULTS } from "@/lib/legal";
import { apiGet, apiPatch, readApiResult, readPlainJson } from "@/lib/api";

type FieldDef =
  | { key: string; label: string; kind: "text" | "textarea"; hint?: string }
  | { key: string; label: string; kind: "seo-desc"; hint?: string };

type FieldGroup = {
  title: string;
  description?: string;
  fields: FieldDef[];
};

const TRANSLATABLE = new Set([
  "tagline",
  "description",
  "location",
  "contact_heading_1",
  "contact_heading_2",
  "contact_heading_3",
  "contact_sub",
  "contact_success",
  "contact_form_note",
  "datenschutz_body",
]);

const EN_FALLBACK: Record<string, string> = {
  tagline: DEFAULT_TAGLINE,
  description: DEFAULT_DESCRIPTION,
  contact_heading_1: CONTACT_DEFAULTS.heading1,
  contact_heading_2: CONTACT_DEFAULTS.heading2,
  contact_heading_3: CONTACT_DEFAULTS.heading3,
  contact_sub: CONTACT_DEFAULTS.sub,
  contact_success: CONTACT_DEFAULTS.success,
  contact_form_note: CONTACT_DEFAULTS.formNote,
};

const FIELD_GROUPS: FieldGroup[] = [
  {
    title: "Identity & SEO defaults",
    description: "Used in the footer, document title fallbacks, and Organization JSON-LD.",
    fields: [
      { key: "site_name", label: "Site name", kind: "text" },
      { key: "tagline", label: "Tagline", kind: "text" },
      { key: "description", label: "Default meta description", kind: "seo-desc", hint: "Google / answer engines: start with “Przemysław Gołębiewski is a self-taught ceramist…”. Keep it third person." },
      { key: "location", label: "Location (footer)", kind: "text" },
      {
        key: "organization_logo",
        label: "Organization logo URL (JSON-LD)",
        kind: "text",
        hint: "Absolute or site-relative URL. Falls back to /images/og-image.png when empty.",
      },
      {
        key: "same_as_urls",
        label: "sameAs URLs (one per line)",
        kind: "textarea",
        hint: "Appended to Organization JSON-LD sameAs after Instagram + Shop. One URL per line (e.g. https://www.etsy.com/shop/LelekStudio). Do not repeat Instagram or Shop — those come from the fields above.",
      },
    ],
  },
  {
    title: "Contact & social",
    description: "Email and Instagram appear in the footer and contact page.",
    fields: [
      { key: "email", label: "Contact email", kind: "text" },
      { key: "instagram", label: "Instagram URL", kind: "text" },
    ],
  },
  {
    title: "Shop links",
    description:
      "Primary Shop URL drives nav, footer, About CTA, Find Online block, and Organization sameAs. If empty, the site falls back to NEXT_PUBLIC_SHOP_URL.",
    fields: [
      {
        key: "shop_url",
        label: "Shop URL (primary)",
        kind: "text",
        hint: "Primary shop destination (Shopify). Falls back to https://shop.lelekstudio.com if empty. No deploy needed.",
      },
    ],
  },
  {
    title: "Contact page copy",
    description: "Heading lines and form messages on /contact. Empty fields use site defaults.",
    fields: [
      { key: "contact_heading_1", label: "Heading line 1", kind: "text" },
      { key: "contact_heading_2", label: "Heading line 2", kind: "text" },
      { key: "contact_heading_3", label: "Heading line 3", kind: "text" },
      { key: "contact_sub", label: "Supporting paragraph", kind: "textarea" },
      { key: "contact_success", label: "Success message after send", kind: "text" },
      { key: "contact_form_note", label: "Form note (under submit)", kind: "textarea" },
    ],
  },
  {
    title: "Legal pages",
    description:
      "Impressum and Widerrufsbelehrung are maintained in code (legal review). Datenschutz supports Markdown headings and falls back to site defaults when empty.",
    fields: [
      { key: "datenschutz_body", label: "Datenschutz body (Markdown)", kind: "textarea" },
    ],
  },
];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      const res = await apiGet("/admin/settings");
      const data = await readPlainJson<Record<string, string>>(res);
      if (!data.ok) {
        setError(data.error);
        setLoading(false);
        return;
      }
      setSettings(data.data);
      setLoading(false);
    }
    load();
  }, []);

  function setField(key: string, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    setError("");
    const next = { ...settings };
    for (const key of TRANSLATABLE) {
      const plKey = `${key}_pl`;
      if (!next[plKey]?.trim()) {
        const suggested = suggestPl(next[key] || EN_FALLBACK[key] || "");
        if (suggested) next[plKey] = suggested;
      }
    }
    const res = await apiPatch("/admin/settings", { settings: next });
    const data = await readApiResult<{ settings?: Record<string, string> }>(res);
    setSaving(false);
    if (!data.ok) {
      setError(data.error);
      return;
    }
    setSettings(data.settings ?? next);
    setSaved(true);
  }

  return (
    <AdminShell
      title="Site settings"
      subtitle="Global identity, contact copy, legal text, and SEO defaults. Homepage sections live under Homepage."
    >
      {loading ? <p className="admin-muted">Loading...</p> : null}
      {error ? <p className="admin-error">{error}</p> : null}

      <AdminCard className="admin-form-stack-lg" style={{ maxWidth: 720 }}>
        {FIELD_GROUPS.map((group) => (
          <div key={group.title} className="admin-field-group">
            <h3 className="admin-group-title">{group.title}</h3>
            {group.description ? <p className="admin-muted">{group.description}</p> : null}
            {group.fields.map((field) => {
              const value = settings[field.key] ?? "";
              if (TRANSLATABLE.has(field.key)) {
                const plKey = `${field.key}_pl`;
                const pl =
                  settings[plKey] ??
                  suggestPl(value || EN_FALLBACK[field.key] || "");
                const rows = field.key === "datenschutz_body" ? 14 : field.kind === "text" ? 2 : 4;
                return (
                  <div key={field.key}>
                    <LangPair
                      label={field.label}
                      en={value}
                      pl={pl}
                      multiline={field.kind !== "text"}
                      rows={rows}
                      onEn={(next) => setField(field.key, next)}
                      onPl={(next) => setField(plKey, next)}
                    />
                    {field.hint ? <p className="admin-muted">{field.hint}</p> : null}
                  </div>
                );
              }
              if (field.kind === "seo-desc") {
                return (
                  <div key={field.key}>
                    <AdminSeoTextarea
                      label={field.label}
                      value={value}
                      onChange={(v) => setField(field.key, v)}
                      rows={field.key === "description" ? 3 : 2}
                    />
                    {field.hint ? <p className="admin-muted">{field.hint}</p> : null}
                  </div>
                );
              }
              if (field.kind === "textarea") {
                const rows =
                  field.key === "datenschutz_body"
                    ? 14
                    : field.key === "same_as_urls"
                      ? 4
                      : 3;
                return (
                  <div key={field.key}>
                    <AdminTextarea
                      label={field.label}
                      rows={rows}
                      value={value}
                      onChange={(e) => setField(field.key, e.target.value)}
                    />
                    {field.hint ? <p className="admin-muted">{field.hint}</p> : null}
                  </div>
                );
              }
              return (
                <div key={field.key}>
                  <AdminInput
                    label={field.label}
                    value={value}
                    onChange={(e) => setField(field.key, e.target.value)}
                  />
                  {field.hint ? <p className="admin-muted">{field.hint}</p> : null}
                </div>
              );
            })}
          </div>
        ))}

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <AdminButton onClick={save} disabled={saving} className="filled">
            {saving ? "Saving..." : "Save settings"}
          </AdminButton>
          {saved ? (
            <span className="admin-success">Saved - live after revalidate (~1 min)</span>
          ) : null}
        </div>
      </AdminCard>
    </AdminShell>
  );
}
