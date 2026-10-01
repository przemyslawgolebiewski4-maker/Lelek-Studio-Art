"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PortfolioEditor } from "@/components/admin/portfolio/PortfolioEditor";
import { AdminButton, AdminCard, AdminShell } from "@/components/admin/AdminShell";
import { apiGet, apiPatch, readApiResult } from "@/lib/api";
import { stampSectionPl } from "@/lib/i18n/cms";

const DEFAULT_CONTENT: Record<string, unknown> = {
  name: "Przemysław Gołębiewski",
  role: "visual artist",
  bannerImage: "",
  bannerVideo: "",
  bannerAlt: "",
  intro: "",
  navAbout: "About",
  navGalleries: "Galleries",
  navContact: "Contact",
  aboutHeading: "About",
  aboutBody: "",
  aboutImage: "",
  aboutImageAlt: "",
  galleriesHeading: "Galleries",
  galleriesIntro: "",
  contactHeading: "Contact",
  contactBody: "",
  contactEmail: "",
  works: [],
};

type SectionRow = {
  sectionKey: string;
  visible: boolean;
  content: Record<string, unknown>;
};

export default function AdminPortfolioPage() {
  const [draft, setDraft] = useState<Record<string, unknown>>(DEFAULT_CONTENT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const res = await apiGet("/admin/sections");
      const data = await readApiResult<{ sections: SectionRow[] }>(res);
      if (cancelled) return;
      if (!data.ok) {
        setError(data.error);
        setLoading(false);
        return;
      }
      const section = data.sections.find((item) => item.sectionKey === "portfolio");
      if (section) {
        setDraft({ ...DEFAULT_CONTENT, ...section.content });
      }
      setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function save() {
    setSaving(true);
    setError("");
    const content = stampSectionPl("portfolio", draft);
    const res = await apiPatch("/admin/sections/portfolio", { content, visible: true, order: 20 });
    const data = await readApiResult(res);
    setSaving(false);
    if (!data.ok) {
      setError(data.error);
      return;
    }
    setSaved(true);
  }

  return (
    <AdminShell
      title="Portfolio"
      subtitle="Przemysław Gołębiewski. Photos and all page copy for the maker site."
      actions={
        <Link href="/portfolio" target="_blank" className="admin-btn ghost">
          Preview portfolio ↗
        </Link>
      }
    >
      {loading ? <p className="admin-muted">Loading...</p> : null}
      {error ? <p className="admin-error">{error}</p> : null}
      {loading ? null : (
        <AdminCard>
          <PortfolioEditor
            content={draft}
            onChange={(next) => {
              setDraft(next);
              setSaved(false);
            }}
          />
          <div className="admin-save-bar">
            <AdminButton onClick={save} disabled={saving} className="filled">
              {saving ? "Saving..." : "Save portfolio"}
            </AdminButton>
            {saved ? <span className="admin-success">Saved. The public page updates within about a minute.</span> : null}
          </div>
        </AdminCard>
      )}
    </AdminShell>
  );
}
