# Lelek Studio - Next.js on Railway

Full-stack Next.js app with MongoDB Atlas. Deployed on Railway (same ecosystem as Aruru backend).

## Phase 1 complete when:
- `npm run dev` works locally
- `/api/health` returns `{ ok: true, mongodb: "connected" }`
- Homepage renders with hero + featured products from MongoDB

## Local setup

1. Copy `.env.example` to `.env.local` and fill `DATABASE_URL`.
2. Run dev server:
   ```bash
   npm install
   npm run dev
   ```
3. Seed database (local):
   ```bash
   npm run db:seed
   ```

## Deploy on Railway

1. Create new project at [railway.app](https://railway.app) → **Deploy from GitHub repo**
2. Select `Lelek-Studio-Art`, branch `main`
3. Railway auto-detects Next.js via Nixpacks (`railway.toml` included)
4. Add environment variables in Railway dashboard:

   | Variable | Required | Notes |
   |----------|----------|-------|
   | `DATABASE_URL` | yes | Atlas URI with `/lelek_studio` |
   | `SETUP_SECRET` | yes | For one-time seed endpoint |
   | `NEXT_PUBLIC_SITE_URL` | yes | `https://www.lelekstudio.com` |
   | `JWT_SECRET` | Phase 2 | Auth |
   | `RESEND_KEY` | Phase 7 | Email |
   | `ADMIN_EMAIL` | Phase 7 | Inbox replies |
   | `ALLOWED_REGISTER_EMAILS` | Phase 2 | Hidden registration |

5. Deploy. Health check hits `/api/health` automatically.
6. Seed once after first deploy:
   ```
   https://YOUR-RAILWAY-DOMAIN.up.railway.app/api/setup/seed?secret=YOUR_SETUP_SECRET
   ```
7. Custom domain: Railway → Settings → Domains → add `www.lelekstudio.com`

## MongoDB

Database name on Atlas: `lelek_studio` (same cluster as `aruru`).

## Architecture vs Aruru

| | Aruru | Lelek Studio |
|---|-------|--------------|
| Frontend | Vercel (Expo Web) | Railway (Next.js) |
| Backend | Railway (FastAPI) | Next.js API routes (same service) |
| Database | MongoDB Atlas | MongoDB Atlas |

Lelek is a single Railway service - no separate Python backend needed.

## Admin access (Phase 2)

- Register: `/shop/rejestracja` (hidden, not in nav)
- Set `admin_role: "lelek_admin"` in MongoDB Atlas for your user
- Login: `/shop/logowanie`

## Legacy static site

Previous HTML version archived in `_legacy/`.
