"use client";

import { useEffect, useState } from "react";
import { AdminShell, AdminCard, AdminButton, AdminInput, AdminTextarea } from "@/components/admin/AdminShell";
import { apiGet, apiPatch, readApiResult, readPlainJson } from "@/lib/api";

const SETTING_FIELDS: { key: string; label: string; multiline?: boolean }[] = [
  { key: "site_name", label: "Site name" },
  { key: "tagline", label: "Tagline" },
  { key: "description", label: "Description", multiline: true },
  { key: "email", label: "Email" },
  { key: "etsy_url", label: "Etsy URL" },
  { key: "acquire_label", label: "Acquire bar text (e.g. The collection, Enter shop, Browse objects)" },
  { key: "instagram", label: "Instagram URL" },
  { key: "instagram_handle", label: "Instagram handle" },
  { key: "artist_url", label: "Artist URL" },
  { key: "location", label: "Location" },
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
      // GET /admin/settings returns a plain settings map (no { ok: true } envelope)
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

  async function save() {
    setSaving(true);
    setError("");
    const res = await apiPatch("/admin/settings", { settings });
    const data = await readApiResult<{ settings?: Record<string, string> }>(res);
    setSaving(false);
    if (!data.ok) {
      setError(data.error);
      return;
    }
    setSettings(data.settings ?? settings);
    setSaved(true);
  }

  return (
    <AdminShell title="Site settings" subtitle="Global metadata - maps to nav, footer and SEO.">
      {loading ? <p className="admin-muted">Loading...</p> : null}
      {error ? <p className="admin-error">{error}</p> : null}

      <AdminCard className="admin-form-stack-lg" style={{ maxWidth: 640 }}>
        {SETTING_FIELDS.map(({ key, label, multiline }) =>
          multiline ? (
            <AdminTextarea
              key={key}
              label={label}
              rows={4}
              value={settings[key] ?? ""}
              onChange={(e) => {
                setSettings({ ...settings, [key]: e.target.value });
                setSaved(false);
              }}
            />
          ) : (
            <AdminInput
              key={key}
              label={label}
              value={settings[key] ?? ""}
              onChange={(e) => {
                setSettings({ ...settings, [key]: e.target.value });
                setSaved(false);
              }}
            />
          ),
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <AdminButton onClick={save} disabled={saving} className="filled">
            {saving ? "Saving..." : "Save settings"}
          </AdminButton>
          {saved ? <span className="admin-success">Saved</span> : null}
        </div>
      </AdminCard>
    </AdminShell>
  );
}
