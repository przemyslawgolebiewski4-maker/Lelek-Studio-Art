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

3. **Seed database** (choose one):

   **Option A - one click on Vercel** (no local setup):
   - Add `SETUP_SECRET` to Vercel Environment Variables (any random string)
   - After deploy, open once:
     `https://your-domain.vercel.app/api/setup/seed?secret=YOUR_SETUP_SECRET`

   **Option B - local:**
   ```bash
   npx vercel env pull .env.local
   npm run db:seed
   ```

## MongoDB

Database name on Atlas: `lelek_studio` (same cluster as `aruru`).

## Admin access (Phase 2)

- Register: `/shop/rejestracja` (hidden, not in nav)
- Set `admin_role: "lelek_admin"` in MongoDB Atlas for your user
- Login: `/shop/logowanie`

## Legacy static site

Previous HTML version archived in `_legacy/`.
