# Lelek Studio API (Express)

Deploy this folder as a **separate Railway service**.

## Railway settings

| Setting | Value |
|---------|-------|
| **Root Directory** | `backend` |
| **Build Command** | *(auto)* `npm run build` |
| **Start Command** | *(auto)* `npm start` |
| **Healthcheck** | `/health` |

Do **not** deploy the repo root — that is the Next.js frontend on Vercel.

## Environment variables

See `.env.example`. All secrets stay on Railway:

- `DATABASE_URL` — MongoDB Atlas `lelek_studio`
- `JWT_SECRET` — admin JWT signing
- `SETUP_SECRET` — one-time seed endpoint
- `RESEND_KEY` + `ADMIN_EMAIL` — contact notifications
- `FRONTEND_URL` — CORS + shared cookie domain (e.g. `https://www.lelekstudio.com`)

## Local dev

```bash
npm install
npm run dev
# http://localhost:3001/health
```

## Health check

`GET /health` → `{ ok: true, mongodb: "connected", service: "lelek-studio-api" }`

## Seed

```bash
GET /setup/seed?secret=SETUP_SECRET
GET /setup/seed?secret=SETUP_SECRET&force=true
```
