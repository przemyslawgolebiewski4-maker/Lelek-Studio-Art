# Launch checklist

Frontend: **https://www.lelekstudio.com** (Vercel)  
API: **Railway** (`*.up.railway.app` or `api.lelekstudio.com`)

---

## Step 1 — Połącz frontend z API

### Vercel → Settings → Environment Variables

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | Railway public URL, np. `https://lelek-studio-api-production.up.railway.app` |
| `NEXT_PUBLIC_SITE_URL` | `https://www.lelekstudio.com` |

**Redeploy** Vercel po zapisaniu.

### Railway → Variables

| Variable | Value |
|----------|-------|
| `FRONTEND_URL` | `https://www.lelekstudio.com` |

**Redeploy** Railway po zapisaniu.

### Test

```bash
curl https://TWOJ-API.up.railway.app/health
# → { "ok": true, "mongodb": "connected" }
```

Otwórz stronę główną — po seedzie pojawią się **Featured Works** (3 produkty).

---

## Step 2 — Seed bazy danych

W przeglądarce (jednorazowo):

```
https://TWOJ-API.up.railway.app/setup/seed?secret=TWOJ_SETUP_SECRET
```

Oczekiwana odpowiedź:

```json
{ "ok": true, "skipped": false, "message": "Seed complete.", "counts": { ... } }
```

Lokalnie:

```bash
SETUP_SECRET=twoj-sekret NEXT_PUBLIC_API_URL=https://TWOJ-API.up.railway.app npm run db:seed
```

---

## Step 3 — Utwórz konto admin

```bash
SETUP_SECRET=twoj-sekret \
NEXT_PUBLIC_API_URL=https://TWOJ-API.up.railway.app \
npm run create-admin -- \
  --email=lelekstudio@lelekstudio.com \
  --password="TwojeSilneHaslo123!" \
  --name="Przemyslaw Golebiewski"
```

Lub curl:

```bash
curl -X POST "https://TWOJ-API.up.railway.app/setup/admin?secret=TWOJ_SETUP_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"email":"lelekstudio@lelekstudio.com","password":"TwojeSilneHaslo123!","name":"Przemyslaw Golebiewski"}'
```

---

## Step 4 — Admin login (wymaga domeny API)

Panel: **https://www.lelekstudio.com/admin/login**

### Ważne: cookie między Vercel a Railway

Admin login wymaga, żeby API było pod domeną `*.lelekstudio.com`:

1. Railway → Settings → **Custom Domain** → `api.lelekstudio.com`
2. DNS: CNAME `api` → Railway
3. Vercel: `NEXT_PUBLIC_API_URL=https://api.lelekstudio.com`
4. Redeploy obu serwisów

Bez custom domain (sam `*.railway.app`) — strona publiczna działa, ale **admin może nie logować** z powodu cross-origin cookies.

---

## Step 5 — Sprawdź status

```
https://TWOJ-API.up.railway.app/setup/status?secret=TWOJ_SETUP_SECRET
```

```json
{
  "ok": true,
  "database": "connected",
  "counts": { "products": 3, "settings": 9, "admins": 1 },
  "ready": true
}
```

---

## Step 6 — Test funkcji

| Test | URL / akcja |
|------|-------------|
| Strona główna | https://www.lelekstudio.com |
| Featured works | 3 produkty na homepage |
| Kontakt | https://www.lelekstudio.com/contact → wyślij wiadomość |
| Admin | https://www.lelekstudio.com/admin/login |
| Produkty admin | /admin/products — lista, dodaj, edytuj |

---

## Step 7 — Opcjonalnie (następne sprinty)

- [ ] Custom domain `api.lelekstudio.com` na Railway
- [ ] Resend — verify domain dla emaili z formularza
- [ ] Google Search Console (plik weryfikacji już w `/public/`)
- [ ] Collections / product detail pages (Sprint 6)
- [ ] Journal CMS (Sprint 5–7)
