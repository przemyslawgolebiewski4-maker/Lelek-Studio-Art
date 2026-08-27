import type { Metadata } from "next";
import { SITE_URL, API_BASE, API_FETCH_TIMEOUT_MS, shouldSkipApiFetch } from "@/lib/config";
import type { Gallery } from "@/types/gallery";

export const metadata: Metadata = {
  title: "Galleries",
  description: "Gallery partners showing LELEK originals.",
  alternates: { canonical: `${SITE_URL}/galleries` },
};

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
  const galleries = await getActiveGalleries();

  return (
    <article>
      <section className="page-shell">
        <h1 className="page-h1">Galleries</h1>
      </section>

      <div className="page-content">
        <p className="galleries-intro">
          LELEK originals are shown through gallery partners - current venues below.
        </p>

        {galleries.length === 0 ? (
          <p className="galleries-empty">No galleries listed yet.</p>
        ) : (
          <ul className="galleries-list">
            {galleries.map((gallery) => (
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
