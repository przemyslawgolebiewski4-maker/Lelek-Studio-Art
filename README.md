# Lelek Studio - Next.js on Vercel

## Phase 1 complete when:
- `npm run dev` works locally
- `/api/health` returns `{ ok: true, mongodb: "connected" }`
- Homepage renders with hero + featured products from MongoDB

## Local setup

1. Copy env from Vercel (recommended):
   ```bash
   npx vercel env pull .env.local
   ```
   Or copy `.env.example` to `.env.local` and fill `DATABASE_URL`.

2. Install and seed:
   ```bash
   npm install
   npm run db:seed
   npm run dev
   ```

3. Open http://localhost:3000 and http://localhost:3000/api/health

## MongoDB

Database name on Atlas: `lelek_studio` (same cluster as `aruru`).

## Admin access (Phase 2)

- Register: `/shop/rejestracja` (hidden, not in nav)
- Set `admin_role: "lelek_admin"` in MongoDB Atlas for your user
- Login: `/shop/logowanie`

## Legacy static site

Previous HTML version archived in `_legacy/`.
