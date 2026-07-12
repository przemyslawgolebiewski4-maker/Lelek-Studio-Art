# SEO & Google Search Console

## Weryfikacja domeny (HTML file)

Plik już w repo: `public/googlea016b4b9cf83275b.html`

Live URL:
```
https://www.lelekstudio.com/googlea016b4b9cf83275b.html
```

Zawartość:
```
google-site-verification: googlea016b4b9cf83275b.html
```

### Kroki w Google Search Console

1. Wejdź na https://search.google.com/search-console
2. **Add property** → **URL prefix** → `https://www.lelekstudio.com`
3. Metoda weryfikacji: **HTML file**
4. Google sprawdzi plik pod powyższym URL → **Verify**
5. Dodaj też property dla `https://lelekstudio.com` (redirect na www) lub ustaw redirect w Vercel

Alternatywnie: meta tag `google-site-verification` jest też w `src/app/layout.tsx`.

---

## robots.txt

Generowany automatycznie przez Next.js:
```
https://www.lelekstudio.com/robots.txt
```

Blokuje: `/admin/`, `/api/`

---

## sitemap.xml

Generowany dynamicznie:
```
https://www.lelekstudio.com/sitemap.xml
```

Zawiera:
- strony statyczne (/, /collections, /about, /contact, /for-architects, /journal)
- opublikowane produkty z API (`/objects/[slug]`)

### Po weryfikacji w GSC

1. Search Console → **Sitemaps**
2. Submit: `https://www.lelekstudio.com/sitemap.xml`
3. Poczekaj 24–48h na indeksację

---

## Open Graph & Twitter

Root layout (`src/app/layout.tsx`) zawiera:
- `openGraph` (Facebook, LinkedIn, iMessage previews)
- `twitter:card` (summary_large_image)
- `canonical` URL
- domyślny obraz OG: `/images/hero/hero-main.jpg`

---

## Checklist po deploy

| Test | URL | Oczekiwane |
|------|-----|------------|
| Weryfikacja Google | `/googlea016b4b9cf83275b.html` | 200 + tekst weryfikacji |
| robots.txt | `/robots.txt` | Allow / + Sitemap |
| sitemap | `/sitemap.xml` | XML z URL-ami |
| Admin noindex | `/admin` | `robots: noindex` w layout |

---

## Rich Results (opcjonalnie później)

- JSON-LD `Organization` / `LocalBusiness` na homepage
- `Product` schema na `/objects/[slug]`
- BreadcrumbList na collections
