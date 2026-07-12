# Lelek Studio

Next.js frontend (Vercel) + Express API (Railway) + MongoDB Atlas.

```
Przeglądarka
    ↓
Vercel (Next.js — frontend + SSR)
    ↓ fetch (NEXT_PUBLIC_API_URL)
Railway (Express API — backend)
    ↓
MongoDB Atlas (lelek_studio)
```

Vercel **nie** łączy się z MongoDB. Wszystkie dane idą przez Railway API.

## Local development

**Terminal 1 — API:**
```bash
cd backend
cp .env.example .env
npm install
npm run dev
# http://localhost:3001/health
```

**Terminal 2 — Frontend:**
```bash
cp .env.example .env.local
npm install
npm run dev
# http://localhost:3000
```

**Seed database (via API):**
```bash
# SETUP_SECRET in backend/.env
npm run db:seed
# or: GET http://localhost:3001/setup/seed?secret=YOUR_SETUP_SECRET
```

## Environment variables

### Vercel (frontend only)

| Variable | Required | Example |
|----------|----------|---------|
| `NEXT_PUBLIC_API_URL` | Yes | `https://api.lelekstudio.com` |
| `NEXT_PUBLIC_SITE_URL` | Yes | `https://www.lelekstudio.com` |

**Usuń z Vercel** (jeśli są): `DATABASE_URL`, `JWT_SECRET`, `RESEND_KEY`, `SETUP_SECRET`, `ADMIN_EMAIL`.

### Railway (backend only)

| Variable | Required | Example |
|----------|----------|---------|
| `DATABASE_URL` | Yes | `mongodb+srv://...@cluster/lelek_studio?...` |
| `JWT_SECRET` | Yes | 64+ random chars |
| `SETUP_SECRET` | Yes | random string (seed endpoint) |
| `RESEND_KEY` | Yes | `re_...` |
| `ADMIN_EMAIL` | Yes | `lelekstudio@lelekstudio.com` |
| `FRONTEND_URL` | Yes | `https://www.lelekstudio.com` |

Railway: **Root Directory = `backend`**, healthcheck `/health`.

## Admin

- Login: `/admin/login`
- User in MongoDB needs `adminRole: "lelek_admin"` + bcrypt `passwordHash`
- Production: use `api.lelekstudio.com` + `www.lelekstudio.com` with cookie domain `.lelekstudio.com`

## API (Railway)

- `GET /health`
- `POST /auth/login`, `POST /auth/logout`, `GET /auth/me`
- `GET /products/public`, `GET /settings/public`, `GET /sections/hero`
- `GET/POST /admin/products`, `GET/PATCH/DELETE /admin/products/:id`
- `GET/PATCH/DELETE /admin/messages`, `GET/PATCH /admin/settings`
- `POST /contact`, `GET /setup/seed`

## Legacy static site

Archived in `_legacy/`.
