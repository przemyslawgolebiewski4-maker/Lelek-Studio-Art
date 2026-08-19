"use client";

type QrLabelProps = {
  /** Prefer instance code (CE-001-01) on the tiny sticker — fits 25mm better than full displayLabel */
  labelText: string;
  /** Object URL or data URL for the QR PNG */
  qrSrc: string;
};

/**
 * Physical sticker: exactly 25mm × 25mm.
 * Print stylesheet uses mm units + @page size A4 — see .popup-label-sheet.
 */
export function QrLabel({ labelText, qrSrc }: QrLabelProps) {
  return (
    <div className="qr-label">
      <div className="qr-label-inner">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={qrSrc} alt="" className="qr-label-img" />
        <div className="qr-label-code">{labelText}</div>
      </div>
    </div>
  );
}
