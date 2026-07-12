"use client";

import { useEffect, useState } from "react";
import { AdminShell, AdminCard, AdminButton, AdminInput, AdminTextarea } from "@/components/admin/AdminShell";
import { apiGet, apiPatch } from "@/lib/api";

const SETTING_FIELDS: { key: string; label: string; multiline?: boolean }[] = [
  { key: "site_name", label: "Site name" },
  { key: "tagline", label: "Tagline" },
  { key: "description", label: "Description", multiline: true },
  { key: "email", label: "Email" },
  { key: "etsy_url", label: "Etsy URL" },
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
      const res = await apiGet("/admin/settings");
      const data = await res.json();
      if (res.ok) {
        setSettings(data);
      } else {
        setError(data.error ?? "Failed to load settings");
      }
      setLoading(false);
    }
    load();
  }, []);

  async function save() {
    setSaving(true);
    setError("");
    const res = await apiPatch("/admin/settings", { settings });
    const data = await res.json();
    setSaving(false);
    if (!res.ok || !data.ok) {
      setError(data.error ?? "Failed to save");
      return;
    }
    setSettings(data.settings ?? settings);
    setSaved(true);
  }

  return (
    <AdminShell title="Site settings" subtitle="Global site metadata and links">
      {loading ? <p className="text-metal">Loading...</p> : null}
      {error ? <p className="mb-4 text-rust-light">{error}</p> : null}

      <AdminCard className="max-w-2xl space-y-5">
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

        <div className="flex items-center gap-4 pt-2">
          <AdminButton onClick={save} disabled={saving}>
            {saving ? "Saving..." : "Save settings"}
          </AdminButton>
          {saved ? <span className="text-sm text-sand">Saved</span> : null}
        </div>
      </AdminCard>
    </AdminShell>
  );
}
