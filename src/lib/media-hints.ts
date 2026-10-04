/** Recommended asset sizes shown under admin upload fields.
 *  Ratios match actual CSS slots (object-fit: cover).
 *
 *  Hero desktop  = 58vw × ~100vh     → ~1:1
 *  Hero mobile   = 100vw × 40vh      → ~5:4 landscape
 *  Story desktop = 50% × content     → ~3:4 soft portrait
 *  Story mobile  = 100vw × 60vw      → 5:3 landscape
 *  Products      = aspect-ratio 1    → 1:1
 */

export const MEDIA_HINTS = {
  heroDesktopImage:
    "Square ~1:1 - e.g. 1600×1600 or 1800×1800 px (hero is 58% × full viewport). JPG/WebP, ideally under 5 MB (max 12 MB). Poster when video is set.",
  heroMobileImage:
    "Landscape ~5:4 - e.g. 1600×1280 px (mobile hero is full width × ~40vh). Optional; falls back to desktop image.",
  heroDesktopVideo:
    "MP4 H.264, muted loop 8–20 s. Prefer ~1:1 crop (1600×1600). Target 5–20 MB (max 80 MB).",
  heroMobileVideo:
    "Optional mobile loop - landscape ~5:4 (e.g. 1280×1024). Prefer lighter file for phones.",

  storyDesktopImage:
    "Soft portrait ~3:4 - e.g. 1400×1800 px (half-width column). JPG/WebP, ideally under 5 MB (max 12 MB).",
  storyMobileImage:
    "Landscape 5:3 - e.g. 1500×900 px (mobile story is full width × 60vw). Optional; falls back to desktop image.",
  storyDesktopVideo:
    "MP4 H.264, muted loop 8–20 s. Prefer ~3:4 or 1280×720 cover-crop. Target 5–20 MB (max 80 MB).",
  storyMobileVideo:
    "Optional mobile loop - landscape 5:3 (e.g. 1280×768). Prefer lighter file for phones.",

  productGallery:
    "Square 1:1 preferred (1400×1400 px). Tall pieces: 2:3 (~1200×1800). First image = thumbnail. JPG/WebP, max 12 MB each.",

  journalCover:
    "Square 1:1 (1200×1200). JPG/WebP, ideally under 5 MB (max 12 MB).",

  /* For architects — object-fit: cover.
   * Hero column is 58% of the viewport. The frame fills a block up to 680px tall
   * (about 620px once the caption is in). 1440px screen ≈ 830×620 (4:3);
   * 1920px screen ≈ 1100×620 (16:9). A 3:2 master keeps the centre on both.
   * Mobile ≤1024px: full width × 62vw = 8:5.
   * Pair photos: half-width column, height capped at 360px.
   * 1440px ≈ 650×360; 1920px ≈ 890×360. */
  architectsHeroImage:
    "Landscape 3:2 — export 2400×1600 px. Cover crop: about 830×620 on a 1440px screen (close to 4:3) and about 1100×620 on 1920px (close to 16:9). Keep the object in the centre. Photograph it in a real interior. JPG/WebP, ideally under 5 MB (max 12 MB). Poster when a video is set.",
  architectsHeroImageMobile:
    "Landscape 8:5 — export 1600×1000 px. Up to 1024px wide the photo is full width and 62% of the screen width tall (a 390px phone shows about 390×240). Optional; otherwise the desktop file is cropped into this frame.",
  architectsHeroVideo:
    "MP4 H.264, muted loop, 8–20 s. Same 3:2 frame as the desktop photo, e.g. 1920×1280. Target 5–20 MB (max 80 MB).",
  architectsHeroVideoMobile:
    "Optional lighter phone loop. Landscape 8:5, e.g. 1280×800 — the same crop as the mobile photo.",
  architectsExistingImage:
    "Wide landscape 2:1 — export 2000×1000 px. Half-width column, height capped at 360px: about 650×360 on a 1440px screen, about 890×360 on 1920px. A finished piece, ideally already in a space. JPG/WebP, ideally under 5 MB (max 12 MB).",
  architectsProcessImage:
    "Same frame as Existing work: 2:1, export 2000×1000 px (about 650×360 on a 1440px screen, about 890×360 on 1920px). Making the work, or an object at architectural scale. JPG/WebP, ideally under 5 MB (max 12 MB).",
} as const;
