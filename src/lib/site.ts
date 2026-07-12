export type HomeSectionKey =
  | "hero"
  | "story"
  | "elements"
  | "featured"
  | "architects"
  | "journal"
  | "find";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export async function getSiteSettings() {
  try {
    const res = await fetch(`${API_URL}/settings/public`, { next: { revalidate: 60 } });
    if (!res.ok) return {};
    return res.json();
  } catch {
    return {};
  }
}

export async function getPublicHomeData() {
  try {
    const [settingsRes, featuredRes, heroRes] = await Promise.all([
      fetch(`${API_URL}/settings/public`, { next: { revalidate: 60 } }),
      fetch(`${API_URL}/products/public?limit=6`, { next: { revalidate: 60 } }),
      fetch(`${API_URL}/sections/hero`, { next: { revalidate: 60 } }),
    ]);
    const settings = settingsRes.ok ? await settingsRes.json() : {};
    const featured = featuredRes.ok ? await featuredRes.json() : [];
    const hero = heroRes.ok ? await heroRes.json() : {};
    return { settings, hero, featured };
  } catch {
    return { settings: {}, hero: {}, featured: [] };
  }
}

export async function getFeaturedProducts(limit = 3) {
  try {
    const res = await fetch(`${API_URL}/products/public?limit=${limit}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}
