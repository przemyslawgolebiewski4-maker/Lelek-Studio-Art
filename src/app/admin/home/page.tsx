"use client";

import { useEffect, useState } from "react";
import {
  AdminShell,
  AdminCard,
  AdminButton,
  AdminInput,
  AdminTextarea,
} from "@/components/admin/AdminShell";
import { apiGet, apiPatch } from "@/lib/api";
import type { HomeSectionKey } from "@/lib/site";

type SectionRow = {
  _id: string;
  sectionKey: HomeSectionKey;
  order: number;
  visible: boolean;
  content: Record<string, string | unknown>;
};

const SECTION_LABELS: Record<HomeSectionKey, string> = {
  hero: "Hero",
  story: "Story / About",
  elements: "Elements",
  featured: "Featured",
  architects: "Architects CTA",
  journal: "Journal teaser",
  find: "Find us",
};

function contentToFields(content: Record<string, unknown>): { key: string; value: string }[] {
  return Object.entries(content).map(([key, value]) => ({
    key,
    value: typeof value === "string" ? value : JSON.stringify(value, null, 2),
  }));
}

function fieldsToContent(fields: { key: string; value: string }[]): Record<string, unknown> {
  const content: Record<string, unknown> = {};
  for (const { key, value } of fields) {
    if (!key.trim()) continue;
    try {
      content[key.trim()] = JSON.parse(value);
    } catch {
      content[key.trim()] = value;
    }
  }
  return content;
}

export default function AdminHomePage() {
  const [sections, setSections] = useState<SectionRow[]>([]);
  const [selectedKey, setSelectedKey] = useState<HomeSectionKey | null>(null);
  const [fields, setFields] = useState<{ key: string; value: string }[]>([]);
  const [visible, setVisible] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  async function loadSections() {
    setLoading(true);
    const res = await apiGet("/admin/sections");
    const data = await res.json();
    if (!res.ok || !data.ok) {
      setError(data.error ?? "Failed to load sections");
      setLoading(false);
      return;
    }
    setSections(data.sections);
    setLoading(false);
  }

  useEffect(() => {
    loadSections();
  }, []);

  function selectSection(section: SectionRow) {
    setSelectedKey(section.sectionKey);
    setVisible(section.visible);
    setFields(contentToFields(section.content as Record<string, unknown>));
    setSaved(false);
    setError("");
  }

  function updateField(index: number, part: "key" | "value", value: string) {
    setFields((prev) => prev.map((f, i) => (i === index ? { ...f, [part]: value } : f)));
    setSaved(false);
  }

  async function saveSection() {
    if (!selectedKey) return;
    setSaving(true);
    setError("");
    const content = fieldsToContent(fields);
    const res = await apiPatch(`/admin/sections/${selectedKey}`, { content, visible });
    const data = await res.json();
    setSaving(false);
    if (!res.ok || !data.ok) {
      setError(data.error ?? "Failed to save");
      return;
    }
    setSaved(true);
    await loadSections();
  }

  const selected = sections.find((s) => s.sectionKey === selectedKey) ?? null;

  return (
    <AdminShell title="Home sections" subtitle="Edit homepage and page content blocks">
      {loading ? <p className="text-metal">Loading...</p> : null}
      {error ? <p className="mb-4 text-rust-light">{error}</p> : null}

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="space-y-2">
          {sections.map((section) => (
            <button
              key={section.sectionKey}
              type="button"
              onClick={() => selectSection(section)}
              className={`w-full border p-4 text-left transition-colors ${
                selectedKey === section.sectionKey
                  ? "border-rust bg-peat/60"
                  : "border-sand/20 bg-peat/30 hover:border-sand/40"
              }`}
            >
              <p className="text-sm text-cream">{SECTION_LABELS[section.sectionKey]}</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-metal">
                {section.sectionKey} · {section.visible ? "visible" : "hidden"}
              </p>
            </button>
          ))}
        </div>

        <AdminCard>
          {selected ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-4 border-b border-sand/15 pb-4">
                <h2 className="font-serif text-2xl text-cream">
                  {SECTION_LABELS[selected.sectionKey]}
                </h2>
                <label className="flex items-center gap-2 text-sm text-sand">
                  <input
                    type="checkbox"
                    checked={visible}
                    onChange={(e) => {
                      setVisible(e.target.checked);
                      setSaved(false);
                    }}
                  />
                  Visible
                </label>
              </div>

              {fields.map((field, index) => (
                <div key={index} className="grid gap-3 md:grid-cols-[180px_1fr]">
                  <AdminInput
                    label="Field"
                    value={field.key}
                    onChange={(e) => updateField(index, "key", e.target.value)}
                  />
                  <AdminTextarea
                    label="Value"
                    rows={field.value.includes("\n") ? 4 : 2}
                    value={field.value}
                    onChange={(e) => updateField(index, "value", e.target.value)}
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={() => setFields((prev) => [...prev, { key: "", value: "" }])}
                className="font-mono text-[11px] uppercase tracking-[0.14em] text-metal hover:text-cream"
              >
                + Add field
              </button>

              <div className="flex items-center gap-4 pt-4">
                <AdminButton onClick={saveSection} disabled={saving}>
                  {saving ? "Saving..." : "Save section"}
                </AdminButton>
                {saved ? <span className="text-sm text-sand">Saved</span> : null}
              </div>
            </div>
          ) : (
            <p className="text-metal">Select a section to edit.</p>
          )}
        </AdminCard>
      </div>
    </AdminShell>
  );
}
