/** Recommended asset sizes shown under admin upload fields.
 *  Ratios match actual CSS slots (object-fit: cover).
 *  Hero desktop = 58vw × ~100vh → ~1:1
 *  Hero mobile (≤1024) = 100vw × 40vh → ~5:4 landscape
 */

export const MEDIA_HINTS = {
  heroDesktopImage:
    "Square ~1:1 — e.g. 1600×1600 or 1800×1800 px (hero is 58% × full viewport). JPG/WebP, ideally under 5 MB (max 12 MB). Poster when video is set.",
  heroMobileImage:
    "Landscape ~5:4 — e.g. 1600×1280 px (mobile hero is full width × ~40vh). Optional; falls back to desktop image.",
  heroDesktopVideo:
    "MP4 H.264, muted loop 8–20 s. Prefer ~1:1 or 1600×1600 crop, or 1280×720 then cover-crop. Target 5–20 MB (max 80 MB).",
  heroMobileVideo:
    "Optional mobile loop — landscape ~5:4 (e.g. 1280×1024). Prefer lighter file for phones.",

  storyDesktopImage:
    "Portrait ~3:4 — e.g. 1400×1800 px. JPG/WebP, ideally under 5 MB (max 12 MB).",
  storyMobileImage:
    "Portrait ~3:4 — e.g. 1080×1440 px. Optional; falls back to desktop image.",
  storyDesktopVideo:
    "MP4 H.264, muted loop 8–20 s, 720p. Target 5–20 MB (max 80 MB). Overrides image when set.",
  storyMobileVideo:
    "Optional mobile loop — same export rules as desktop video.",

  productGallery:
    "Square 1:1 preferred (1400×1400 px). Tall pieces: 2:3 (~1200×1800). First image = thumbnail. JPG/WebP, max 12 MB each.",

  journalCover:
    "Square 1:1 (1200×1200) or portrait 4:5 (1200×1500). JPG/WebP, ideally under 5 MB (max 12 MB).",
} as const;
