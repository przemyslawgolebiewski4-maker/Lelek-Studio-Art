"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AdminShell,
  AdminCard,
  AdminButton,
} from "@/components/admin/AdminShell";
import {
  HeroSectionEditor,
  StorySectionEditor,
  ElementsSectionEditor,
  TextSectionEditor,
  FindSectionEditor,
  FeaturedSectionEditor,
} from "@/components/admin/home/HomeSectionEditors";
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
  story: "Story",
  elements: "Elements",
  featured: "Featured works",
  architects: "Architects",
  journal: "Journal teaser",
  find: "Find us",
};

const SECTION_DESCRIPTIONS: Partial<Record<HomeSectionKey, string>> = {
  hero: "First screen — upload photo or short loop video, edit headline and buttons.",
  story: "Section below hero — studio story with image or video.",
  elements: "Earth · Water · Fire · Air labels.",
  featured: "Video + product thumbnails. Products marked Visible on Home appear below the video.",
  architects: "B2B call-to-action block.",
  journal: "Journal teaser heading (posts from Journal admin).",
  find: "Studio address and Etsy links.",
};

export default function AdminHomePage() {
  const [sections, setSections] = useState<SectionRow[]>([]);
  const [selectedKey, setSelectedKey] = useState<HomeSectionKey>("hero");
  const [draft, setDraft] = useState<Record<string, unknown>>({});
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

  useEffect(() => {
    const section = sections.find((s) => s.sectionKey === selectedKey);
    if (!section) return;
    setDraft(section.content as Record<string, unknown>);
    setVisible(section.visible);
    setSaved(false);
    setError("");
  }, [selectedKey, sections]);

  async function saveSection() {
    if (!selectedKey) return;
    setSaving(true);
    setError("");
    const res = await apiPatch(`/admin/sections/${selectedKey}`, { content: draft, visible });
    const data = await res.json();
    setSaving(false);
    if (!res.ok || !data.ok) {
      setError(data.error ?? "Failed to save");
      return;
    }
    setSaved(true);
    await loadSections();
  }

  function renderEditor() {
    const onChange = (next: Record<string, unknown>) => {
      setDraft(next);
      setSaved(false);
    };

    switch (selectedKey) {
      case "hero":
        return <HeroSectionEditor content={draft} onChange={onChange} />;
      case "story":
        return <StorySectionEditor content={draft} onChange={onChange} />;
      case "elements":
        return <ElementsSectionEditor content={draft} onChange={onChange} />;
      case "featured":
        return <FeaturedSectionEditor content={draft} onChange={onChange} />;
      case "architects":
        return (
          <TextSectionEditor
            content={draft}
            onChange={onChange}
            description={SECTION_DESCRIPTIONS.architects}
            fields={[
              { key: "eyebrow", label: "Eyebrow" },
              { key: "headline", label: "Headline" },
              { key: "sub", label: "Subtext", multiline: true },
              { key: "body", label: "Body", multiline: true },
              { key: "ctaText", label: "Button text" },
              { key: "ctaUrl", label: "Button link", hint: "e.g. /for-architects" },
            ]}
          />
        );
      case "journal":
        return (
          <TextSectionEditor
            content={draft}
            onChange={onChange}
            description={SECTION_DESCRIPTIONS.journal}
            fields={[
              { key: "eyebrow", label: "Eyebrow" },
              { key: "heading", label: "Heading" },
              { key: "headingEm", label: "Heading emphasis" },
              { key: "sub", label: "Intro", multiline: true },
            ]}
          />
        );
      case "find":
        return <FindSectionEditor content={draft} onChange={onChange} />;
      default:
        return null;
    }
  }

  return (
    <AdminShell
      title="Homepage"
      subtitle="Edit each section with live fields — upload images and videos directly."
      actions={
        <Link href="/" target="_blank" className="admin-btn ghost">
          Preview site ↗
        </Link>
      }
    >
      {loading ? <p className="admin-muted">Loading...</p> : null}
      {error ? <p className="admin-error">{error}</p> : null}

      <div className="admin-home-layout">
        <nav className="admin-section-nav" aria-label="Homepage sections">
          {(Object.keys(SECTION_LABELS) as HomeSectionKey[]).map((key) => {
            const section = sections.find((s) => s.sectionKey === key);
            return (
              <button
                key={key}
                type="button"
                className={`admin-section-tab ${selectedKey === key ? "is-active" : ""}`}
                onClick={() => setSelectedKey(key)}
              >
                <span className="admin-section-tab-label">{SECTION_LABELS[key]}</span>
                {section && !section.visible ? (
                  <span className="admin-section-tab-meta">hidden</span>
                ) : null}
              </button>
            );
          })}
        </nav>

        <AdminCard>
          <div className="admin-section-toolbar">
            <div>
              <h2 className="admin-panel-title" style={{ margin: 0, border: "none", padding: 0 }}>
                {SECTION_LABELS[selectedKey]}
              </h2>
              {SECTION_DESCRIPTIONS[selectedKey] ? (
                <p className="admin-muted" style={{ marginTop: 8 }}>
                  {SECTION_DESCRIPTIONS[selectedKey]}
                </p>
              ) : null}
            </div>
            <label className="admin-checkbox">
              <input
                type="checkbox"
                checked={visible}
                onChange={(e) => {
                  setVisible(e.target.checked);
                  setSaved(false);
                }}
              />
              Visible on site
            </label>
          </div>

          {renderEditor()}

          <div className="admin-save-bar">
            <AdminButton onClick={saveSection} disabled={saving} className="filled">
              {saving ? "Saving..." : "Save section"}
            </AdminButton>
            {saved ? <span className="admin-success">Saved — changes live after revalidate (~1 min)</span> : null}
          </div>
        </AdminCard>
      </div>
    </AdminShell>
  );
}
