"use client";

import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { productLoupeFrame } from "@/lib/product-loupe";

type Lens = {
  size: number;
  left: number;
  top: number;
  backgroundSize: string;
  backgroundPosition: string;
};

function cssUrl(src: string): string {
  return `url("${src.replace(/\\/g, "%5C").replace(/"/g, "%22")}")`;
}

export function ProductLoupe({
  src,
  alt,
  magnifyLabel,
  dragLabel,
}: {
  src: string;
  alt: string;
  magnifyLabel: string;
  dragLabel: string;
}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [lens, setLens] = useState<Lens | null>(null);
  const [touchZoom, setTouchZoom] = useState(false);

  function readLens(event: ReactPointerEvent<HTMLDivElement>): Lens | null {
    const img = imgRef.current;
    if (!img) return null;
    const rect = img.getBoundingClientRect();
    const x = Math.min(Math.max(event.clientX - rect.left, 0), rect.width);
    const y = Math.min(Math.max(event.clientY - rect.top, 0), rect.height);
    return productLoupeFrame(x, y, rect.width, rect.height);
  }

  function track(event: ReactPointerEvent<HTMLDivElement>) {
    const fine = event.pointerType === "mouse" || event.pointerType === "pen";
    if (!fine && !touchZoom) return;
    setLens(readLens(event));
  }

  return (
    <div className="product-detail-zoom">
      <div
        className={`product-loupe${lens ? " is-zooming" : ""}${touchZoom ? " is-touch-zoom" : ""}`}
        onPointerEnter={(event) => {
          if (event.pointerType === "touch") return;
          track(event);
        }}
        onPointerMove={track}
        onPointerLeave={(event) => {
          if (event.pointerType === "touch") return;
          setLens(null);
        }}
        onPointerDown={(event) => {
          if (event.pointerType !== "touch" || !touchZoom) return;
          event.currentTarget.setPointerCapture(event.pointerId);
          setLens(readLens(event));
        }}
        onPointerUp={(event) => {
          if (event.pointerType !== "touch") return;
          setLens(null);
        }}
        onPointerCancel={() => setLens(null)}
      >
        {/* The loupe reads this same file. next/image would serve a smaller copy than the glass. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={imgRef} src={src} alt={alt} draggable={false} fetchPriority="high" />
        {lens ? (
          <div
            className="product-loupe-lens"
            aria-hidden="true"
            style={{
              width: lens.size,
              height: lens.size,
              left: lens.left,
              top: lens.top,
              backgroundImage: cssUrl(src),
              backgroundSize: lens.backgroundSize,
              backgroundPosition: lens.backgroundPosition,
            }}
          />
        ) : null}
      </div>
      <button
        type="button"
        className="product-loupe-toggle"
        aria-pressed={touchZoom}
        onClick={() => {
          setTouchZoom((on) => !on);
          setLens(null);
        }}
      >
        {magnifyLabel}
      </button>
      {touchZoom ? <p className="product-loupe-note">{dragLabel}</p> : null}
    </div>
  );
}
