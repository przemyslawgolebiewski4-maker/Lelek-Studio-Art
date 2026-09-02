#!/usr/bin/env npx tsx
/**
 * Dev-only audit: flags Admin CMS field keys with zero public-facing reads.
 * Run: npm run audit:admin-fields
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const SRC = join(ROOT, "src");

const SETTINGS_KEYS = [
  "site_name",
  "tagline",
  "description",
  "location",
  "organization_logo",
  "same_as_urls",
  "email",
  "instagram",
  "instagram_handle",
  "artist_url",
  "shop_url",
  "etsy_url",
  "acquire_label",
  "contact_heading_1",
  "contact_heading_2",
  "contact_heading_3",
  "contact_sub",
  "contact_success",
  "contact_form_note",
  "impressum_body",
  "datenschutz_body",
];

const HOME_SECTION_KEYS: Record<string, string[]> = {
  hero: [
    "eyebrow",
    "subheadline",
    "brandline",
    "kozodoj",
    "image",
    "imageMobile",
    "video",
    "videoMobile",
    "imageAlt",
    "imageCaption",
    "cta1Text",
    "cta1Url",
    "cta2Text",
    "cta2Url",
  ],
  story: [
    "eyebrow",
    "heading",
    "headingEm",
    "body1",
    "body2",
    "body3",
    "signature",
    "image",
    "imageMobile",
    "video",
    "videoMobile",
    "imageAlt",
    "imageCaption",
    "ctaShopLabel",
    "ctaTradeLabel",
    "originalsEyebrow",
    "originalsHeading",
    "originalsIntro",
    "gallery",
  ],
  signpost: ["intro", "tradeSignal", "tradeHref", "cards"],
  elements: ["items", "scopeNote"],
  featured: ["eyebrow", "heading", "headingEm", "video", "videoMobile", "videoAlt"],
  architects: [
    "eyebrow",
    "headline",
    "headlineEm",
    "sub",
    "points",
    "point1Title",
    "point1Body",
    "point2Title",
    "point2Body",
    "point3Title",
    "point3Body",
    "closingNote",
    "formEyebrow",
    "formIntro",
    "formSuccessTitle",
    "formSuccessBody",
    "heroImage",
    "heroImageMobile",
    "heroVideo",
    "heroVideoMobile",
    "heroImageAlt",
    "heroCaption",
  ],
  journal: ["eyebrow", "heading", "headingEm", "sub"],
  find: [
    "studioName",
    "studioAddress",
    "studioInstagram",
    "studioInstagramUrl",
    "openDaysNote",
    "onlineHeading",
    "onlineDescription",
    "onlineCtaLabel",
    "etsyUrl",
    "lelekMeaning",
  ],
};

/** Keys accessed indirectly (nested, dynamic, or via shared helpers). */
const KNOWN_INDIRECT: Record<string, string> = {
  gallery: "story.gallery[].alt/image in AboutContent",
  items: "elements.items[] in Hero/ElementsSection",
  cards: "signpost.cards[] in Signpost component",
  points: "architects.points[] on /for-architects",
  headline: "hero: deprecated legacy key (may still exist in DB only)",
  headlineEm: "hero: deprecated legacy key (may still exist in DB only)",
  quote: "hero: deprecated legacy key (may still exist in DB only)",
  acquire_label: "legacy settings key - marked unused in Admin UI",
  etsyUrl: "find section legacy Etsy reference",
  etsy_url: "settings legacy Etsy reference",
  artist_url: "optional settings URL",
};

function collectSourceFiles(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const rel = relative(SRC, full);
    if (rel.startsWith("app/admin") || rel.includes("/admin/")) continue;
    const st = statSync(full);
    if (st.isDirectory()) collectSourceFiles(full, out);
    else if (/\.(tsx?|jsx?)$/.test(entry)) out.push(full);
  }
  return out;
}

function fileUsesKey(files: string[], key: string): string[] {
  const patterns = [
    new RegExp(`\\b${key}\\b`),
    new RegExp(`["']${key}["']`),
    new RegExp(`\\.${key}\\b`),
  ];
  return files.filter((file) => {
    const text = readFileSync(file, "utf8");
    return patterns.some((re) => re.test(text));
  });
}

type Finding = {
  scope: string;
  key: string;
  status: "ok" | "orphan" | "manual-check";
  note?: string;
  readers?: string[];
};

const publicFiles = collectSourceFiles(SRC);
const findings: Finding[] = [];

for (const key of SETTINGS_KEYS) {
  const readers = fileUsesKey(publicFiles, key);
  if (readers.length === 0) {
    findings.push({
      scope: "settings",
      key,
      status: KNOWN_INDIRECT[key] ? "manual-check" : "orphan",
      note: KNOWN_INDIRECT[key],
    });
  } else {
    findings.push({
      scope: "settings",
      key,
      status: "ok",
      readers: readers.map((f) => relative(ROOT, f)),
    });
  }
}

for (const [section, keys] of Object.entries(HOME_SECTION_KEYS)) {
  for (const key of keys) {
    const readers = fileUsesKey(publicFiles, key);
    const noteKey = key;
    if (readers.length === 0) {
      findings.push({
        scope: `home:${section}`,
        key,
        status: KNOWN_INDIRECT[noteKey] ? "manual-check" : "orphan",
        note: KNOWN_INDIRECT[noteKey],
      });
    } else {
      findings.push({
        scope: `home:${section}`,
        key,
        status: "ok",
        readers: readers.map((f) => relative(ROOT, f)),
      });
    }
  }
}

const orphans = findings.filter((f) => f.status === "orphan");
const manual = findings.filter((f) => f.status === "manual-check");
const ok = findings.filter((f) => f.status === "ok");

console.log("Admin field orphan audit\n");
console.log(`Public source files scanned: ${publicFiles.length}`);
console.log(`OK: ${ok.length} | Manual check: ${manual.length} | Likely orphaned: ${orphans.length}\n`);

if (orphans.length) {
  console.log("LIKELY ORPHANED (zero matches outside /admin):");
  for (const f of orphans) {
    console.log(`  - [${f.scope}] ${f.key}`);
  }
  console.log("");
}

if (manual.length) {
  console.log("NEEDS MANUAL CHECK (nested/dynamic/legacy):");
  for (const f of manual) {
    console.log(`  - [${f.scope}] ${f.key}${f.note ? ` — ${f.note}` : ""}`);
  }
  console.log("");
}

if (!orphans.length) {
  console.log("No obvious orphaned fields detected.");
}

process.exit(orphans.length > 0 ? 1 : 0);
