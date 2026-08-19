"use client";

import { useEffect, useState } from "react";
import { AdminButton } from "@/components/admin/AdminShell";
import { QrLabel } from "@/components/admin/popups/QrLabel";

export type LabelSheetItem = {
  productId: string;
  locationId: string;
  catalogCode: string;
  title: string;
};

type LabelSheetProps = {
  items: LabelSheetItem[];
  onClose: () => void;
};

async function fetchQrObjectUrl(locationId: string, productId: string): Promise<string> {
  const res = await fetch(
    `/api/proxy/admin/locations/${locationId}/products/${productId}/qr`,
    { credentials: "include", cache: "no-store" },
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `QR fetch failed (${res.status})`);
  }
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}

/**
 * A4 batch sheet of 25mm×25mm labels with hairline cut guides.
 * Screen: preview + print button. Print: @page A4, mm units, no chrome.
 */
export function LabelSheet({ items, onClose }: LabelSheetProps) {
  const [srcs, setSrcs] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const created: string[] = [];

    (async () => {
      setLoading(true);
      setError("");
      const next: Record<string, string> = {};
      try {
        for (const item of items) {
          const url = await fetchQrObjectUrl(item.locationId, item.productId);
          created.push(url);
          next[item.productId] = url;
        }
        if (!cancelled) setSrcs(next);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : String(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      created.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [items]);

  function handlePrint() {
    window.print();
  }

  return (
    <div className="popup-label-sheet-root">
      <div className="popup-label-sheet-toolbar no-print">
        <div>
          <p className="admin-list-item-title">Label sheet · {items.length} piece(s)</p>
          <p className="admin-muted" style={{ marginTop: 6, maxWidth: "52ch" }}>
            Each cell is 25 mm x 25 mm. In the print dialog set scale to{" "}
            <b>100% / Actual size</b> (not Fit to page), paper <b>A4</b>, margins default.
          </p>
        </div>
        <div className="admin-shell-actions">
          <AdminButton variant="primary" onClick={handlePrint} disabled={loading || Boolean(error)}>
            Print A4 sheet
          </AdminButton>
          <AdminButton variant="ghost" onClick={onClose}>
            Close
          </AdminButton>
        </div>
      </div>

      {loading ? <p className="admin-muted no-print">Generating QR codes…</p> : null}
      {error ? <p className="admin-error no-print">{error}</p> : null}

      <div className="popup-label-sheet">
        <div className="popup-label-sheet-meta no-print">
          Calibration: each square outline = 25 mm. Cut on the hairline.
        </div>
        <div className="popup-label-grid">
          {items.map((item) => (
            <QrLabel
              key={item.productId}
              catalogCode={item.catalogCode}
              qrSrc={srcs[item.productId] || ""}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
