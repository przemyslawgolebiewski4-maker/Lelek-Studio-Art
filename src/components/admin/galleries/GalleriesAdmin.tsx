"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AdminShell,
  AdminButton,
  AdminCard,
  AdminInput,
} from "@/components/admin/AdminShell";
import { apiGet, apiPost, apiPatch, apiDelete, readApiResult } from "@/lib/api";
import type { Gallery } from "@/types/gallery";

type GalleryFormState = {
  name: string;
  url: string;
  city: string;
  active: boolean;
  order: string;
};

const EMPTY_FORM: GalleryFormState = {
  name: "",
  url: "",
  city: "",
  active: true,
  order: "0",
};

export function GalleriesAdmin() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState<GalleryFormState>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiGet("/admin/galleries");
      const data = await readApiResult<{ galleries: Gallery[] }>(res);
      if (!data.ok) {
        setError(data.error);
        setGalleries([]);
        return;
      }
      setGalleries(data.galleries ?? []);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function startEdit(gallery: Gallery) {
    setEditingId(gallery._id);
    setForm({
      name: gallery.name,
      url: gallery.url,
      city: gallery.city ?? "",
      active: Boolean(gallery.active),
      order: String(gallery.order ?? 0),
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  async function saveGallery() {
    setSaving(true);
    setError("");
    const payload = {
      name: form.name.trim(),
      url: form.url.trim(),
      city: form.city.trim(),
      active: form.active,
      order: Number(form.order) || 0,
    };
    try {
      const res = editingId
        ? await apiPatch(`/admin/galleries/${editingId}`, payload)
        : await apiPost("/admin/galleries", payload);
      const data = await readApiResult(res);
      if (!data.ok) {
        setError(data.error);
        return;
      }
      cancelEdit();
      await load();
    } catch (err) {
      setError(String(err));
    } finally {
      setSaving(false);
    }
  }

  async function removeGallery(id: string) {
    if (!window.confirm("Delete this gallery? This cannot be undone.")) return;
    setBusyId(id);
    setError("");
    try {
      const res = await apiDelete(`/admin/galleries/${id}`);
      const data = await readApiResult(res);
      if (!data.ok) {
        setError(data.error);
        return;
      }
      if (editingId === id) cancelEdit();
      await load();
    } catch (err) {
      setError(String(err));
    } finally {
      setBusyId(null);
    }
  }

  async function toggleActive(gallery: Gallery) {
    setBusyId(gallery._id);
    setError("");
    try {
      const res = await apiPatch(`/admin/galleries/${gallery._id}`, {
        active: !gallery.active,
      });
      const data = await readApiResult(res);
      if (!data.ok) {
        setError(data.error);
        return;
      }
      await load();
    } catch (err) {
      setError(String(err));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <AdminShell
      title="Galleries"
      subtitle="Partners that show LELEK Originals. Used on About cards and the public Galleries page."
    >
      {error ? <p className="admin-error">{error}</p> : null}

      <AdminCard>
        <h2 className="admin-card-title" style={{ marginBottom: 16 }}>
          {editingId ? "Edit gallery" : "Add gallery"}
        </h2>
        <div className="admin-form-stack">
          <AdminInput
            label="Name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
          />
          <AdminInput
            label="Website URL"
            value={form.url}
            onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
            placeholder="https://"
            required
          />
          <div className="admin-form-row-2">
            <AdminInput
              label="City"
              value={form.city}
              onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
              placeholder="optional"
            />
            <AdminInput
              label="Order"
              type="number"
              value={form.order}
              onChange={(e) => setForm((f) => ({ ...f, order: e.target.value }))}
            />
          </div>
          <label className="admin-checkbox">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
            />
            Active (visible on public /galleries)
          </label>
          <div style={{ display: "flex", gap: 12 }}>
            <AdminButton
              variant="primary"
              disabled={saving || !form.name.trim() || !form.url.trim()}
              onClick={saveGallery}
            >
              {saving ? "Saving..." : editingId ? "Update gallery" : "Create gallery"}
            </AdminButton>
            {editingId ? (
              <AdminButton variant="ghost" onClick={cancelEdit}>
                Cancel
              </AdminButton>
            ) : null}
          </div>
        </div>
      </AdminCard>

      <div className="admin-table-wrap" style={{ marginTop: 24 }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>City</th>
              <th>URL</th>
              <th>Active</th>
              <th>Order</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="admin-muted">
                  Loading…
                </td>
              </tr>
            ) : null}
            {!loading && galleries.length === 0 ? (
              <tr>
                <td colSpan={6} className="admin-muted">
                  No galleries yet.
                </td>
              </tr>
            ) : null}
            {galleries.map((gallery) => {
              const busy = busyId === gallery._id;
              return (
                <tr key={gallery._id}>
                  <td className="admin-soft">{gallery.name}</td>
                  <td className="admin-muted">{gallery.city || "—"}</td>
                  <td className="popup-mono">
                    <a href={gallery.url} target="_blank" rel="noopener noreferrer">
                      {gallery.url.replace(/^https?:\/\//i, "")}
                    </a>
                  </td>
                  <td>
                    <button
                      type="button"
                      className={`popup-toggle${gallery.active ? " on" : ""}`}
                      aria-pressed={gallery.active}
                      disabled={busy}
                      onClick={() => toggleActive(gallery)}
                    >
                      <span className="popup-toggle-dot" />
                    </button>
                  </td>
                  <td className="popup-mono">{gallery.order ?? 0}</td>
                  <td>
                    <div className="popup-row-actions">
                      <button
                        type="button"
                        className="admin-table-action"
                        disabled={busy}
                        onClick={() => startEdit(gallery)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="admin-table-action admin-muted"
                        disabled={busy}
                        onClick={() => removeGallery(gallery._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
