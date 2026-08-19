"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AdminShell,
  AdminButton,
  AdminCard,
  AdminInput,
  AdminSelect,
} from "@/components/admin/AdminShell";
import { apiGet, apiPost, apiPatch, apiDelete, readApiResult } from "@/lib/api";
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
      p.instanceCode || p.catalog || "",
      p.displayLabel || p.title,
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
    () => catalog.filter((p) => p.published && Boolean(p.catalog?.trim())),
    [catalog],
  );

  const selectedAddProduct = useMemo(
    () => availableForAdd.find((p) => p._id === addProductId) ?? null,
    [availableForAdd, addProductId],
  );

  const selectedAddPrice =
    selectedAddProduct?.price != null && Number.isFinite(Number(selectedAddProduct.price))
      ? Number(selectedAddProduct.price)
      : null;

  const instanceCountByCatalog = useMemo(() => {
    const map = new Map<string, number>();
    for (const bundle of bundles) {
      for (const p of bundle.products) {
        const key = (p.catalogCode || p.catalog || "").toUpperCase();
        if (!key) continue;
        map.set(key, (map.get(key) ?? 0) + 1);
      }
    }
    return map;
  }, [bundles]);

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

  async function patchItem(
    itemId: string,
    body: Record<string, unknown>,
  ): Promise<boolean> {
    setBusyProductId(itemId);
    setError("");
    const res = await apiPatch(`/admin/exhibition-items/${itemId}`, body);
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
    const product = availableForAdd.find((p) => p._id === addProductId);
    const priceOk =
      product?.price != null && Number.isFinite(Number(product.price));
    if (!priceOk) {
      setError(
        "This product has no price. Set Price (EUR) on the Products page before adding it to a pop-up.",
      );
      return;
    }
    setSavingAdd(true);
    setError("");
    const res = await apiPost(`/admin/locations/${addForLocationId}/items`, {
      productId: addProductId,
      revolutPaymentLink: addRevolutLink.trim() || null,
    });
    const data = await readApiResult(res);
    setSavingAdd(false);
    if (!data.ok) {
      setError(data.error);
      return;
    }
    setAddForLocationId(null);
    setAddProductId("");
    setAddRevolutLink("");
    await loadAll();
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
    const priceRes = await apiPatch(`/admin/products/${editProduct.productId}`, {
      price: priceNum,
    });
    const priceData = await readApiResult(priceRes);
    if (!priceData.ok) {
      setError(priceData.error);
      setSavingEdit(false);
      return;
    }
    const ok = await patchItem(editProduct._id, {
      exhibitionStatus: editStatus,
      revolutPaymentLink: editLink.trim() || null,
    });
    setSavingEdit(false);
    if (ok) setEditProduct(null);
  }

  function toggleSelected(locationId: string, itemId: string) {
    setSelectedByLocation((prev) => {
      const current = prev[locationId] ?? [];
      const next = current.includes(itemId)
        ? current.filter((id) => id !== itemId)
        : [...current, itemId];
      return { ...prev, [locationId]: next };
    });
  }

  function openLabelSheet(locationId: string, products: ExhibitionProduct[]) {
    const selected = selectedByLocation[locationId] ?? [];
    const items: LabelSheetItem[] = products
      .filter((p) => selected.includes(p._id))
      .map((p) => ({
        itemId: p._id,
        locationId,
        instanceCode: p.instanceCode,
        displayLabel: p.displayLabel,
        title: p.title,
      }))
      .filter((p) => p.instanceCode);
    if (items.length === 0) {
      setError("Select at least one exhibition item with an instance code to print labels.");
      return;
    }
    setLabelSheet(items);
  }

  async function changeStatus(itemId: string, status: ExhibitionStatus) {
    await patchItem(itemId, { exhibitionStatus: status });
  }

  async function setPickupAuthorized(itemId: string, value: boolean) {
    if (value) {
      setConfirmPickupId(itemId);
      return;
    }
    await patchItem(itemId, { pickupAuthorized: false });
  }

  async function confirmPickupOn() {
    if (!confirmPickupId) return;
    const id = confirmPickupId;
    setConfirmPickupId(null);
    await patchItem(id, { pickupAuthorized: true });
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
                <p className="admin-list-item-title">Add piece to {location.name}</p>
                <p className="admin-muted">
                  Creates a new physical instance (e.g. CE-001-01, then CE-001-02). Same design can
                  have many units at one or more locations. Price always comes from the product —
                  not per instance.
                </p>
                <AdminSelect
                  label="Published product (design)"
                  value={addProductId}
                  onChange={(e) => setAddProductId(e.target.value)}
                >
                  <option value="">Select a product…</option>
                  {availableForAdd.map((p) => {
                    const cat = (p.catalog || "").toUpperCase();
                    const n = instanceCountByCatalog.get(cat) ?? 0;
                    const priceLabel =
                      p.price != null && Number.isFinite(Number(p.price))
                        ? ` · ${formatEuro(p.price)}`
                        : " · no price";
                    return (
                      <option key={p._id} value={p._id}>
                        {cat ? `${cat} — ` : ""}
                        {p.title}
                        {priceLabel}
                        {n > 0 ? ` (${n} instance${n === 1 ? "" : "s"} already)` : ""}
                      </option>
                    );
                  })}
                </AdminSelect>

                {selectedAddProduct && addForLocationId === location._id ? (
                  <div className="popup-inherited-price">
                    {selectedAddPrice != null ? (
                      <>
                        <div className="popup-inherited-price-value">
                          Price inherited from {(selectedAddProduct.catalog || "").toUpperCase() || "product"}:{" "}
                          <b>{formatEuro(selectedAddPrice)}</b>
                        </div>
                        <p className="admin-muted" style={{ marginTop: 6 }}>
                          Edit this on the Products page to change it for all instances of this
                          design.
                        </p>
                      </>
                    ) : (
                      <p className="admin-error" style={{ marginBottom: 0 }}>
                        No price on this product. Open Products → set Price (EUR) before adding to a
                        pop-up.
                      </p>
                    )}
                  </div>
                ) : null}

                <AdminInput
                  label="Revolut Payment Link"
                  value={addRevolutLink}
                  onChange={(e) => setAddRevolutLink(e.target.value)}
                  placeholder="https://checkout.revolut.com/..."
                />
                <div className="admin-shell-actions">
                  <AdminButton
                    variant="primary"
                    disabled={savingAdd || !addProductId || selectedAddPrice == null}
                    onClick={addItemToLocation}
                  >
                    {savingAdd ? "Saving..." : "Create instance at location"}
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
                            disabled={!product.instanceCode?.trim()}
                            title={
                              product.instanceCode?.trim()
                                ? "Select for label sheet"
                                : "Instance code required for QR label"
                            }
                            onChange={() => toggleSelected(location._id, product._id)}
                            aria-label={`Select ${product.displayLabel || product.title} for labels`}
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
                              <div className="admin-soft">
                                {product.displayLabel || product.title}
                              </div>
                              <div className="popup-item-code">
                                {product.instanceCode || product.catalogCode || "—"}
                              </div>
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
              <p className="admin-list-item-title">Edit · {editProduct.displayLabel || editProduct.title}</p>
              <AdminInput
                label="Price (EUR) — shared by all instances of this design"
                type="number"
                min={0}
                step="0.01"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
                placeholder="e.g. 31"
              />
              <p className="admin-muted" style={{ marginTop: "-8px" }}>
                Saves on the parent Product ({(editProduct.catalogCode || editProduct.catalog || "").toUpperCase() || "catalog"}).
                Exhibition items do not store their own price.
              </p>
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
                {editLocationId && editProduct.instanceCode?.trim() ? (
                  <a
                    className="admin-btn ghost"
                    href={`/api/proxy/admin/locations/${editLocationId}/items/${editProduct._id}/qr`}
                    download
                  >
                    Download QR PNG
                  </a>
                ) : null}
                <AdminButton
                  variant="ghost"
                  onClick={() =>
                    apiDelete(`/admin/exhibition-items/${editProduct._id}`).then(async (res) => {
                      const data = await readApiResult(res);
                      if (data.ok) {
                        setEditProduct(null);
                        await loadAll();
                      } else {
                        setError(data.error);
                      }
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
