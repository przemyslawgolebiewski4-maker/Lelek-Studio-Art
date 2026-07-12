# Lelek Studio API (Express)

Deploy this folder as a **separate Railway service**.

## Railway settings

| Setting | Value |
|---------|-------|
| **Root Directory** | `backend` |
| **Build Command** | *(auto)* `npm run build` |
| **Start Command** | *(auto)* `npm start` |

Do **not** deploy the repo root — that runs the Next.js frontend build.

## Environment variables

Copy from `.env.example`:

- `DATABASE_URL`
- `JWT_SECRET`
- `SETUP_SECRET`
- `RESEND_KEY`
- `ADMIN_EMAIL`
- `FRONTEND_URL=https://www.lelekstudio.com`

## Local dev

```bash
npm install
npm run dev
# http://localhost:3001/health
```

## Health check

`GET /health` → `{ ok: true, mongodb: "connected", service: "lelek-studio-api" }`
