"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AdminShell,
  AdminButton,
  AdminCard,
  AdminInput,
  AdminSelect,
} from "@/components/admin/AdminShell";
import { apiGet, apiPost, apiPatch, readApiResult } from "@/lib/api";
import type {
  AdminLocation,
  ExhibitionProduct,
  ExhibitionStatus,
  LocationSummary,
  ProductOption,
} from "@/types/exhibition";
import { LabelSheet, type LabelSheetItem } from "@/components/admin/popups/LabelSheet";

function formatEuro(n: unknown) {
  const v = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(v)) return "—";
  return `€${v.toFixed(2)}`;
}

function formatDateRange(start: string, end: string) {
  const opts: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  const s = new Date(start);
  const e = new Date(end);
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return "—";
  return `${s.toLocaleDateString("en-GB", opts)} – ${e.toLocaleDateString("en-GB", opts)}`;
}

function statusLabel(status: ExhibitionStatus | null | undefined) {
  if (status === "available") return "Available";
  if (status === "reserved") return "Reserved";
  if (status === "sold") return "Sold";
  return "—";
}

function exportSettlementCsv(
  location: AdminLocation,
  products: ExhibitionProduct[],
  summary: LocationSummary,
) {
  const rows: string[][] = [
    ["Location", location.name],
    ["Address", location.address],
    ["Commission %", String(location.commissionPercent)],
    ["Sold count", String(summary.soldCount)],
    ["Sold total", summary.soldTotal.toFixed(2)],
    ["Commission owed", summary.commissionOwed.toFixed(2)],
    ["Net for Przemek", summary.netForPrzemek.toFixed(2)],
    [],
    ["Catalog", "Title", "Price", "Status", "Pickup authorized", "Sold at"],
    ...products.map((p) => [
      p.catalog || "",
      p.title,
      p.price != null ? String(p.price) : "",
      p.exhibitionStatus || "",
      p.pickupAuthorized ? "yes" : "no",
      p.soldAt ? new Date(p.soldAt).toISOString() : "",
    ]),
  ];
  const csv = rows
    .map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
    )
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `lelek-settlement-${location.name.replace(/\s+/g, "-").toLowerCase()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

type LocationBundle = {
  location: AdminLocation;
  products: ExhibitionProduct[];
  summary: LocationSummary;
};

const EMPTY_SUMMARY: LocationSummary = {
  soldCount: 0,
  soldTotal: 0,
  commissionOwed: 0,
  netForPrzemek: 0,
};

type LocationFormState = {
  name: string;
  address: string;
  contactPerson: string;
  commissionPercent: string;
  startDate: string;
  endDate: string;
};

const EMPTY_LOCATION_FORM: LocationFormState = {
  name: "",
  address: "",
  contactPerson: "",
  commissionPercent: "20",
  startDate: "",
  endDate: "",
};

export function PopupsAdmin() {
  const [bundles, setBundles] = useState<LocationBundle[]>([]);
  const [catalog, setCatalog] = useState<ProductOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showNewLocation, setShowNewLocation] = useState(false);
  const [locationForm, setLocationForm] = useState<LocationFormState>(EMPTY_LOCATION_FORM);
  const [savingLocation, setSavingLocation] = useState(false);
  const [addForLocationId, setAddForLocationId] = useState<string | null>(null);
  const [addProductId, setAddProductId] = useState("");
  const [addRevolutLink, setAddRevolutLink] = useState("");
  const [savingAdd, setSavingAdd] = useState(false);
  const [editProduct, setEditProduct] = useState<ExhibitionProduct | null>(null);
  const [editLink, setEditLink] = useState("");
  const [editStatus, setEditStatus] = useState<ExhibitionStatus>("available");
  const [savingEdit, setSavingEdit] = useState(false);
  const [confirmPickupId, setConfirmPickupId] = useState<string | null>(null);
  const [busyProductId, setBusyProductId] = useState<string | null>(null);
  /** Selected product ids for label sheet, scoped by locationId */
  const [selectedByLocation, setSelectedByLocation] = useState<Record<string, string[]>>({});
  const [labelSheet, setLabelSheet] = useState<LabelSheetItem[] | null>(null);
  const [editPrice, setEditPrice] = useState("");
  const [editLocationId, setEditLocationId] = useState<string | null>(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError("");

    const [locRes, prodRes] = await Promise.all([
      apiGet("/admin/locations"),
      apiGet("/admin/products"),
    ]);
    const locData = await readApiResult<{ locations: AdminLocation[] }>(locRes);
    const prodData = await readApiResult<{ products: ProductOption[] }>(prodRes);

    if (!locData.ok) {
      setError(locData.error);
      setLoading(false);
      return;
    }
    if (!prodData.ok) {
      setError(prodData.error);
      setLoading(false);
      return;
    }

    setCatalog(prodData.products);

    const next: LocationBundle[] = await Promise.all(
      locData.locations.map(async (location) => {
        const [productsRes, summaryRes] = await Promise.all([
          apiGet(`/admin/locations/${location._id}/products`),
          apiGet(`/admin/locations/${location._id}/summary`),
        ]);
        const productsData = await readApiResult<{
          products: ExhibitionProduct[];
        }>(productsRes);
        const summaryData = await readApiResult<LocationSummary>(summaryRes);
        return {
          location,
          products: productsData.ok ? productsData.products : [],
          summary: summaryData.ok
            ? {
                soldCount: summaryData.soldCount,
                soldTotal: summaryData.soldTotal,
                commissionOwed: summaryData.commissionOwed,
                netForPrzemek: summaryData.netForPrzemek,
              }
            : EMPTY_SUMMARY,
        };
      }),
    );

    setBundles(next);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const availableForAdd = useMemo(
    () => catalog.filter((p) => p.published && !p.locationId),
    [catalog],
  );

  async function createLocation() {
    setSavingLocation(true);
    setError("");
    const res = await apiPost("/admin/locations", {
      name: locationForm.name.trim(),
      address: locationForm.address.trim(),
      contactPerson: locationForm.contactPerson.trim(),
      commissionPercent: Number(locationForm.commissionPercent),
      startDate: locationForm.startDate,
      endDate: locationForm.endDate,
      active: true,
    });
    const data = await readApiResult(res);
    setSavingLocation(false);
    if (!data.ok) {
      setError(data.error);
      return;
    }
    setLocationForm(EMPTY_LOCATION_FORM);
    setShowNewLocation(false);
    await loadAll();
  }

  async function patchExhibition(
    productId: string,
    body: Record<string, unknown>,
  ): Promise<boolean> {
    setBusyProductId(productId);
    setError("");
    const res = await apiPatch(`/admin/products/${productId}/exhibition`, body);
    const data = await readApiResult(res);
    setBusyProductId(null);
    if (!data.ok) {
      setError(data.error);
      return false;
    }
    await loadAll();
    return true;
  }

  async function addItemToLocation() {
    if (!addForLocationId || !addProductId) return;
    setSavingAdd(true);
    const ok = await patchExhibition(addProductId, {
      locationId: addForLocationId,
      exhibitionStatus: "available",
      revolutPaymentLink: addRevolutLink.trim() || null,
      pickupAuthorized: false,
    });
    setSavingAdd(false);
    if (ok) {
      setAddForLocationId(null);
      setAddProductId("");
      setAddRevolutLink("");
    }
  }

  async function saveEditProduct() {
    if (!editProduct) return;
    setSavingEdit(true);
    const priceRaw = editPrice.trim().replace(",", ".");
    const priceNum = priceRaw === "" ? null : Number(priceRaw);
    if (priceRaw !== "" && !Number.isFinite(priceNum)) {
      setError("Price must be a number");
      setSavingEdit(false);
      return;
    }
    const priceRes = await apiPatch(`/admin/products/${editProduct._id}`, {
      price: priceNum,
    });
    const priceData = await readApiResult(priceRes);
    if (!priceData.ok) {
      setError(priceData.error);
      setSavingEdit(false);
      return;
    }
    const ok = await patchExhibition(editProduct._id, {
      exhibitionStatus: editStatus,
      revolutPaymentLink: editLink.trim() || null,
    });
    setSavingEdit(false);
    if (ok) setEditProduct(null);
  }

  function toggleSelected(locationId: string, productId: string) {
    setSelectedByLocation((prev) => {
      const current = prev[locationId] ?? [];
      const next = current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId];
      return { ...prev, [locationId]: next };
    });
  }

  function openLabelSheet(locationId: string, products: ExhibitionProduct[]) {
    const selected = selectedByLocation[locationId] ?? [];
    const items: LabelSheetItem[] = products
      .filter((p) => selected.includes(p._id))
      .map((p) => ({
        productId: p._id,
        locationId,
        catalogCode: (p.catalog || "").trim(),
        title: p.title,
      }))
      .filter((p) => p.catalogCode);
    if (items.length === 0) {
      setError("Select at least one product with a catalog code to print labels.");
      return;
    }
    setLabelSheet(items);
  }

  async function changeStatus(productId: string, status: ExhibitionStatus) {
    await patchExhibition(productId, { exhibitionStatus: status });
  }

  async function setPickupAuthorized(productId: string, value: boolean) {
    if (value) {
      setConfirmPickupId(productId);
      return;
    }
    await patchExhibition(productId, { pickupAuthorized: false });
  }

  async function confirmPickupOn() {
    if (!confirmPickupId) return;
    const id = confirmPickupId;
    setConfirmPickupId(null);
    await patchExhibition(id, { pickupAuthorized: true });
  }

  return (
    <AdminShell
      title="Pop-ups"
      subtitle="Manage pieces on consignment at partner locations."
      actions={
        <AdminButton
          variant="ghost"
          className="admin-btn-accent"
          onClick={() => setShowNewLocation((v) => !v)}
        >
          {showNewLocation ? "Cancel" : "+ New location"}
        </AdminButton>
      }
    >
      {labelSheet ? (
        <LabelSheet items={labelSheet} onClose={() => setLabelSheet(null)} />
      ) : null}

      <div className={labelSheet ? "no-print" : undefined}>
      {loading ? <p className="admin-muted">Loading...</p> : null}
      {error ? <p className="admin-error">{error}</p> : null}

      {showNewLocation ? (
        <AdminCard className="admin-form-stack popup-form-card">
          <p className="admin-list-item-title">New location</p>
          <div className="admin-form-row-2">
            <AdminInput
              label="Name"
              value={locationForm.name}
              onChange={(e) => setLocationForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
            <AdminInput
              label="Address"
              value={locationForm.address}
              onChange={(e) => setLocationForm((f) => ({ ...f, address: e.target.value }))}
              required
            />
          </div>
          <div className="admin-form-row-2">
            <AdminInput
              label="Contact person"
              value={locationForm.contactPerson}
              onChange={(e) =>
                setLocationForm((f) => ({ ...f, contactPerson: e.target.value }))
              }
            />
            <AdminInput
              label="Commission %"
              type="number"
              min={0}
              max={100}
              value={locationForm.commissionPercent}
              onChange={(e) =>
                setLocationForm((f) => ({ ...f, commissionPercent: e.target.value }))
              }
              required
            />
          </div>
          <div className="admin-form-row-2">
            <AdminInput
              label="Start date"
              type="date"
              value={locationForm.startDate}
              onChange={(e) => setLocationForm((f) => ({ ...f, startDate: e.target.value }))}
              required
            />
            <AdminInput
              label="End date"
              type="date"
              value={locationForm.endDate}
              onChange={(e) => setLocationForm((f) => ({ ...f, endDate: e.target.value }))}
              required
            />
          </div>
          <div className="admin-shell-actions">
            <AdminButton
              variant="primary"
              disabled={savingLocation}
              onClick={createLocation}
            >
              {savingLocation ? "Saving..." : "Create location"}
            </AdminButton>
          </div>
        </AdminCard>
      ) : null}

      {!loading && bundles.length === 0 ? (
        <p className="admin-muted">No pop-up locations yet. Create one to assign pieces.</p>
      ) : null}

      {bundles.map(({ location, products, summary }) => {
        const totalItems = products.length || location.itemCount || 0;
        return (
          <section key={location._id} className="popup-location">
            <div className="popup-location-head">
              <div>
                <div className="popup-location-name">
                  {location.name}{" "}
                  {location.active ? (
                    <span className="popup-badge-active">Active</span>
                  ) : (
                    <span className="popup-badge-inactive">Inactive</span>
                  )}
                </div>
                <div className="popup-location-meta">
                  {location.commissionPercent}% commission ·{" "}
                  {formatDateRange(location.startDate, location.endDate)} ·{" "}
                  {location.address}
                </div>
              </div>
              <div className="popup-location-stats">
                <div className="popup-stat">
                  <div className="popup-stat-v">
                    {summary.soldCount}/{totalItems}
                  </div>
                  <div className="popup-stat-l">Sold</div>
                </div>
                <div className="popup-stat">
                  <div className="popup-stat-v">{formatEuro(summary.soldTotal)}</div>
                  <div className="popup-stat-l">Revenue</div>
                </div>
                <div className="popup-stat">
                  <div className="popup-stat-v">
                    {summary.soldCount > 0 ? formatEuro(summary.commissionOwed) : "—"}
                  </div>
                  <div className="popup-stat-l">Commission owed</div>
                </div>
              </div>
            </div>

            <div className="popup-location-toolbar">
              <AdminButton
                variant="ghost"
                onClick={() => {
                  setAddForLocationId(location._id);
                  setAddProductId("");
                  setAddRevolutLink("");
                }}
              >
                + Add item
              </AdminButton>
              <AdminButton
                variant="ghost"
                onClick={() => openLabelSheet(location._id, products)}
                disabled={(selectedByLocation[location._id] ?? []).length === 0}
              >
                Print selected as label sheet
              </AdminButton>
            </div>

            {addForLocationId === location._id ? (
              <AdminCard className="admin-form-stack popup-form-card">
                <p className="admin-list-item-title">Add item to {location.name}</p>
                <AdminSelect
                  label="Published product"
                  value={addProductId}
                  onChange={(e) => setAddProductId(e.target.value)}
                >
                  <option value="">Select a product…</option>
                  {availableForAdd.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.catalog ? `${p.catalog} — ` : ""}
                      {p.title}
                      {p.locationId === location._id ? " (already here)" : ""}
                    </option>
                  ))}
                </AdminSelect>
                <AdminInput
                  label="Revolut Payment Link"
                  value={addRevolutLink}
                  onChange={(e) => setAddRevolutLink(e.target.value)}
                  placeholder="https://checkout.revolut.com/..."
                />
                <div className="admin-shell-actions">
                  <AdminButton
                    variant="primary"
                    disabled={savingAdd || !addProductId}
                    onClick={addItemToLocation}
                  >
                    {savingAdd ? "Saving..." : "Assign to location"}
                  </AdminButton>
                  <AdminButton variant="ghost" onClick={() => setAddForLocationId(null)}>
                    Cancel
                  </AdminButton>
                </div>
              </AdminCard>
            ) : null}

            <div className="admin-table-wrap popup-table-wrap">
              <table className="admin-table popup-table">
                <thead>
                  <tr>
                    <th className="popup-check-col">
                      <span className="sr-only">Select</span>
                    </th>
                    <th>Item</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Pickup authorized</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="admin-muted">
                        No items assigned yet.
                      </td>
                    </tr>
                  ) : null}
                  {products.map((product) => {
                    const status = product.exhibitionStatus ?? null;
                    const thumb = product.images?.[0];
                    const busy = busyProductId === product._id;
                    const checked = (selectedByLocation[location._id] ?? []).includes(
                      product._id,
                    );
                    return (
                      <tr key={product._id}>
                        <td className="popup-check-col">
                          <input
                            type="checkbox"
                            checked={checked}
                            disabled={!product.catalog?.trim()}
                            title={
                              product.catalog?.trim()
                                ? "Select for label sheet"
                                : "Catalog code required for QR label"
                            }
                            onChange={() => toggleSelected(location._id, product._id)}
                            aria-label={`Select ${product.title} for labels`}
                          />
                        </td>
                        <td>
                          <div className="popup-item-cell">
                            {thumb ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={thumb}
                                alt=""
                                className="popup-item-thumb"
                              />
                            ) : (
                              <div className="popup-item-thumb popup-item-thumb-empty" />
                            )}
                            <div>
                              <div className="admin-soft">{product.title}</div>
                              <div className="popup-item-code">{product.catalog || "—"}</div>
                            </div>
                          </div>
                        </td>
                        <td className="popup-mono">{formatEuro(product.price)}</td>
                        <td>
                          <div className="popup-status-cell">
                            <span
                              className={`popup-status mono ${status ?? "none"}`}
                            >
                              {statusLabel(status)}
                            </span>
                            <select
                              className="popup-status-select"
                              aria-label={`Status for ${product.title}`}
                              value={status ?? ""}
                              disabled={busy}
                              onChange={(e) => {
                                const v = e.target.value as ExhibitionStatus;
                                if (v) changeStatus(product._id, v);
                              }}
                            >
                              <option value="available">Available</option>
                              <option value="reserved">Reserved</option>
                              <option value="sold">Sold</option>
                            </select>
                          </div>
                        </td>
                        <td>
                          {status === "sold" ? (
                            confirmPickupId === product._id ? (
                              <div className="popup-confirm">
                                <span className="popup-toggle-label">
                                  Confirm — settled with location?
                                </span>
                                <div className="popup-confirm-actions">
                                  <button
                                    type="button"
                                    className="admin-table-action"
                                    disabled={busy}
                                    onClick={confirmPickupOn}
                                  >
                                    Confirm
                                  </button>
                                  <button
                                    type="button"
                                    className="admin-table-action admin-muted"
                                    onClick={() => setConfirmPickupId(null)}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="popup-toggle-wrap">
                                <button
                                  type="button"
                                  className={`popup-toggle${product.pickupAuthorized ? " on" : ""}`}
                                  aria-pressed={Boolean(product.pickupAuthorized)}
                                  aria-label="Pickup authorized"
                                  disabled={busy}
                                  onClick={() =>
                                    setPickupAuthorized(
                                      product._id,
                                      !product.pickupAuthorized,
                                    )
                                  }
                                >
                                  <span className="popup-toggle-dot" />
                                </button>
                                <span className="popup-toggle-label">
                                  {product.pickupAuthorized
                                    ? "Yes"
                                    : "No — settle first"}
                                </span>
                              </div>
                            )
                          ) : (
                            <span className="popup-toggle-label">—</span>
                          )}
                        </td>
                        <td>
                          <div className="popup-row-actions">
                            <button
                              type="button"
                              className="popup-icon-btn"
                              aria-label="Edit exhibition fields"
                              onClick={() => {
                                setEditProduct(product);
                                setEditLocationId(location._id);
                                setEditLink(product.revolutPaymentLink ?? "");
                                setEditStatus(
                                  (product.exhibitionStatus as ExhibitionStatus) ||
                                    "available",
                                );
                                setEditPrice(
                                  product.price != null && Number.isFinite(Number(product.price))
                                    ? String(product.price)
                                    : "",
                                );
                              }}
                            >
                              ✎
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="popup-location-foot">
              <div className="popup-commission-summary">
                Sold:{" "}
                <b>
                  {summary.soldCount} pcs / {formatEuro(summary.soldTotal)}
                </b>{" "}
                · Commission ({location.commissionPercent}%):{" "}
                <b>{formatEuro(summary.commissionOwed)}</b> · You keep:{" "}
                <b>{formatEuro(summary.netForPrzemek)}</b> (before Revolut fee)
              </div>
              <AdminButton
                variant="ghost"
                onClick={() => exportSettlementCsv(location, products, summary)}
              >
                Export settlement
              </AdminButton>
            </div>
          </section>
        );
      })}

      {editProduct ? (
        <div className="popup-modal-backdrop" role="presentation">
          <button
            type="button"
            className="popup-modal-scrim"
            aria-label="Close"
            onClick={() => setEditProduct(null)}
          />
          <div className="popup-modal">
            <AdminCard className="admin-form-stack" style={{ maxWidth: 480 }}>
              <p className="admin-list-item-title">Edit · {editProduct.title}</p>
              <AdminInput
                label="Price (EUR)"
                type="number"
                min={0}
                step="0.01"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
                placeholder="e.g. 31"
              />
              <AdminSelect
                label="Exhibition status"
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value as ExhibitionStatus)}
              >
                <option value="available">Available</option>
                <option value="reserved">Reserved</option>
                <option value="sold">Sold</option>
              </AdminSelect>
              <AdminInput
                label="Revolut Payment Link"
                value={editLink}
                onChange={(e) => setEditLink(e.target.value)}
              />
              <div className="admin-shell-actions">
                <AdminButton variant="primary" disabled={savingEdit} onClick={saveEditProduct}>
                  {savingEdit ? "Saving..." : "Save"}
                </AdminButton>
                {editLocationId && editProduct.catalog?.trim() ? (
                  <a
                    className="admin-btn ghost"
                    href={`/api/proxy/admin/locations/${editLocationId}/products/${editProduct._id}/qr`}
                    download
                  >
                    Download QR PNG
                  </a>
                ) : null}
                <AdminButton
                  variant="ghost"
                  onClick={() =>
                    patchExhibition(editProduct._id, {
                      locationId: null,
                      exhibitionStatus: null,
                      revolutPaymentLink: null,
                      pickupAuthorized: false,
                    }).then((ok) => {
                      if (ok) setEditProduct(null);
                    })
                  }
                >
                  Remove from location
                </AdminButton>
                <AdminButton variant="ghost" onClick={() => setEditProduct(null)}>
                  Cancel
                </AdminButton>
              </div>
            </AdminCard>
          </div>
        </div>
      ) : null}

      <div className="popup-note">
        Pickup authorized stays off until you flip it manually — buyers should not collect
        until commission with the location is settled.
      </div>
      </div>
    </AdminShell>
  );
}
