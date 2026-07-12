# Lelek Studio API (Express)

## Railway settings

| Setting | Value |
|---------|-------|
| **Root Directory** | `backend` |
| **Build Command** | `npm run build` *(or leave empty — auto)* |
| **Start Command** | `npm start` *(or leave empty — auto)* |
| **Healthcheck** | `/health` |

When Root Directory is `backend`, the working directory is already `/app` = this folder.
**Do not** use `cd backend` in build/start commands — that causes `No such file or directory`.

If Railway dashboard has custom build/start commands with `cd backend`, remove them or reset to default.

## Environment variables

See `.env.example`.
