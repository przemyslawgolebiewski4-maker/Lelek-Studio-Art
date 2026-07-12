# Lelek Studio — Image assets

All paths below are served from `/public/images/` and referenced in `backend/data/content.json`, product records, and home sections.

## Quick replace workflow

1. Drop new files at the **same paths** (keep filenames — URLs in CMS depend on them).
2. Run `npm run images:optimize` to resize/compress for web.
3. Redeploy Vercel (images ship with the frontend build).

To pull current production assets into the repo:

```bash
npm run images:sync
```

Missing files on production use fallbacks from `scripts/image-fallbacks/`.

## Required paths (content.json)

| Folder | Files | Min size |
|--------|-------|----------|
| `hero/` | `hero-main.jpg`, `hero-main-mobile.jpg` | 1920×1080 / 800×1200 |
| `process/` | `studio.jpg`, `studio-mobile.jpg` | 1200×800 / 800×533 |
| `featured/` | `feat-1.jpg` … `feat-5.jpg` | 800×800 |
| `ceramics/` | `cup-1.jpg`, `cup-2.jpg`, `bowl-1.jpg`, `teapot-1.jpg` | 800×800 |
| `vessels/` | `vessel-1.jpg` … `vessel-3.jpg` | 800×1000 |
| `wall/` | `wall-1.jpg` … `wall-3.jpg`, `bookend-1.jpg`, `bookend-2.jpg` | 800×1000 |

## Social / SEO

| File | Size | Used by |
|------|------|---------|
| `og-image.png` | 1200×630 | Open Graph + Twitter (`src/lib/seo.ts`) |

Regenerate from hero:

```bash
ffmpeg -y -i public/images/hero/hero-main.jpg \
  -vf "scale=1200:630:force_original_aspect_ratio=increase,crop=1200:630" \
  public/images/og-image.png
```

## Extra library (not wired to content.json yet)

These studio photos are in the repo for future products or CMS uploads:

- `functional-1.jpg` … `functional-4.jpg`
- `inherited-quiet-1.jpg` … `inherited-quiet-6.jpg`
- `nature-faces-1.jpg` … `nature-faces-3.jpg`
- `still-form.jpg`, `still-form-1.jpg`, `still-form-2.jpg`
- `about.jpg`, `hero.jpg` (legacy full-res; prefer `hero/` folder)

When adding a product in Admin → Products, paste the path e.g. `/images/inherited-quiet-4.jpg`.

## Tips

- Prefer JPG for photos; PNG only for `og-image.png`.
- Keep hero/process under ~200 KB after optimize.
- Product/detail images: max 1200 px wide is enough for retina.
