# Lelek Studio

Next.js frontend (Vercel) + Express API (Railway) + MongoDB Atlas.

## Architecture

| Layer | Stack | Deploy |
|-------|-------|--------|
| Frontend | Next.js 15 | Vercel |
| API | Express + TypeScript | Railway (`/backend`) |
| Database | MongoDB Atlas `lelek_studio` | Atlas |

## Local development

**Terminal 1 - API:**
```bash
cd backend
cp .env.example .env
npm install
npm run dev
# http://localhost:3001/health
```

**Terminal 2 - Frontend:**
```bash
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:3001
npm install
npm run dev
# http://localhost:3000
```

**Seed database:**
```
GET http://localhost:3001/setup/seed?secret=YOUR_SETUP_SECRET
```

## Deploy

### Railway (API)
1. New project → Deploy from GitHub
2. Set **Root Directory** to `backend` OR use repo root with `backend/railway.toml`
3. Env vars: `DATABASE_URL`, `JWT_SECRET`, `SETUP_SECRET`, `RESEND_KEY`, `ADMIN_EMAIL`, `FRONTEND_URL`

### Vercel (Frontend)
1. Connect repo, framework Next.js
2. Env: `NEXT_PUBLIC_API_URL=https://your-api.up.railway.app`, `NEXT_PUBLIC_SITE_URL`

## Admin

- Login: `/admin/login`
- User must have `adminRole: "lelek_admin"` in MongoDB

## API routes

- `GET /health` - health check
- `POST /auth/login`, `POST /auth/logout`, `GET /auth/me`
- `GET /products/public`, `GET /settings/public`, `GET /sections/hero`
- `GET/POST /admin/products`, `GET/PATCH/DELETE /admin/products/:id`
- `GET/PATCH/DELETE /admin/messages`, `GET/PATCH /admin/settings`
- `POST /contact`, `GET /setup/seed`

## Legacy static site

Archived in `_legacy/`.
