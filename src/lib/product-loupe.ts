/** Diameter of the magnifying glass, in CSS pixels. */
export const PRODUCT_LOUPE_LENS = 176;

/**
 * Magnification of the glass. A 2× loupe stays sharp when the photograph's
 * long side is 2400 px and the frame is about 800–1200 px wide.
 */
export const PRODUCT_LOUPE_ZOOM = 2;

export type LoupeFrame = {
  size: number;
  left: number;
  top: number;
  backgroundSize: string;
  backgroundPosition: string;
};

export function productLoupeFrame(
  x: number,
  y: number,
  width: number,
  height: number,
  lens = PRODUCT_LOUPE_LENS,
  zoom = PRODUCT_LOUPE_ZOOM,
): LoupeFrame | null {
  if (width < 8 || height < 8 || zoom <= 0) return null;
  const size = Math.max(48, Math.min(lens, width, height));
  const bgW = width * zoom;
  const bgH = height * zoom;
  return {
    size,
    left: x - size / 2,
    top: y - size / 2,
    backgroundSize: `${bgW}px ${bgH}px`,
    backgroundPosition: `${size / 2 - x * zoom}px ${size / 2 - y * zoom}px`,
  };
}
