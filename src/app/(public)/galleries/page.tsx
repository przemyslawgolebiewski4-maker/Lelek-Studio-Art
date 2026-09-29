import type { Metadata } from "next";
import { SITE_URL, API_BASE, API_FETCH_TIMEOUT_MS, shouldSkipApiFetch } from "@/lib/config";
import { getLocale } from "@/lib/i18n/get-locale";
import { t } from "@/lib/i18n/messages";
import { localeText, presentGallery } from "@/lib/i18n/present";
import type { Gallery } from "@/types/gallery";

const GALLERIES_DESCRIPTION =
  "Gallery partners showing original ceramics by Przemysław Gołębiewski - LELEK, Berlin.";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: t(locale, "meta.galleries"),
    description: localeText(locale, GALLERIES_DESCRIPTION),
    alternates: { canonical: `${SITE_URL}/galleries` },
  };
}

export const revalidate = 60;

async function getActiveGalleries(): Promise<Gallery[]> {
  if (shouldSkipApiFetch()) return [];
  try {
    const res = await fetch(`${API_BASE}/public/galleries`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(API_FETCH_TIMEOUT_MS),
    });
    if (!res.ok) return [];
    const data = (await res.json()) as Gallery[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export default async function GalleriesPage() {
  const [galleries, locale] = await Promise.all([getActiveGalleries(), getLocale()]);
  const view = galleries.map((gallery) => presentGallery(gallery, locale));

  return (
    <article>
      <section className="page-shell">
        <h1 className="page-h1">{t(locale, "galleries.title")}</h1>
      </section>

      <div className="page-content">
        <p className="galleries-intro">{t(locale, "galleries.intro")}</p>

        {view.length === 0 ? (
          <p className="galleries-empty">{t(locale, "galleries.empty")}</p>
        ) : (
          <ul className="galleries-list">
            {view.map((gallery) => (
              <li key={gallery._id} className="galleries-item">
                <a
                  href={gallery.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="galleries-name"
                >
                  {gallery.name}
                </a>
                {gallery.city?.trim() ? (
                  <span className="galleries-city">{gallery.city.trim()}</span>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
