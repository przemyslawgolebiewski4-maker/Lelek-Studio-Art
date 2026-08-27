import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { connectDB } from "./lib/db";
import { sanitizeProductSlugs } from "./lib/slug";
import { migrateProductExhibitionsToItems } from "./lib/migrate-exhibition-items";

import authRouter from "./routes/auth";
import { productsPublicRouter, productsAdminRouter } from "./routes/products";
import { locationsAdminRouter } from "./routes/locations";
import { galleriesPublicRouter, galleriesAdminRouter } from "./routes/galleries";
import { reservePublicRouter } from "./routes/reserve";
import messagesRouter from "./routes/messages";
import contactRouter from "./routes/contact";
import { settingsPublicRouter, settingsAdminRouter } from "./routes/settings";
import { journalPublicRouter, journalAdminRouter } from "./routes/journal";
import setupRouter from "./routes/setup";

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = new Set([
  "https://www.lelekstudio.com",
  "https://lelekstudio.com",
  process.env.FRONTEND_URL ?? "http://localhost:3000",
]);

// Security headers (API + admin). HSTS only meaningful behind HTTPS (Railway/Vercel).
app.use(
  helmet({
    contentSecurityPolicy: false, // JSON API — CSP is enforced on the Next frontend
    crossOriginResourcePolicy: { policy: "cross-origin" }, // QR PNGs fetched via frontend proxy
    frameguard: { action: "deny" },
    hsts: {
      maxAge: 60 * 60 * 24 * 365,
      includeSubDomains: true,
      preload: false,
    },
  }),
);

/*
  CORS is an allowlist — never *.
  Admin routes use credentials (cookie); browsers require an exact origin match.
  Public reserve is called same-site from Next → Railway; still restricted to the
  same allowlist so random sites cannot call the API with cookies from a victim.
  *.vercel.app is included for preview deployments of the admin.
*/
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin) || origin.endsWith(".vercel.app")) {
        callback(null, true);
        return;
      }
      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

app.get("/health", async (_req, res) => {
  try {
    await connectDB();
    res.json({ ok: true, mongodb: "connected", service: "lelek-studio-api" });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
});

app.use(productsPublicRouter);
app.use(reservePublicRouter);
app.use(galleriesPublicRouter);
app.use(settingsPublicRouter);
app.use(journalPublicRouter);
app.use("/auth", authRouter);
app.use("/admin", productsAdminRouter);
app.use("/admin", locationsAdminRouter);
app.use("/admin", galleriesAdminRouter);
app.use("/admin", messagesRouter);
app.use("/admin", settingsAdminRouter);
app.use("/admin", journalAdminRouter);
app.use("/contact", contactRouter);
app.use("/setup", setupRouter);

async function start() {
  const secret = process.env.JWT_SECRET ?? "";
  if (secret.length < 64) {
    console.warn(
      `[security] JWT_SECRET length is ${secret.length} (project convention: >= 64). Set a stronger secret in Railway.`,
    );
  }

  await connectDB();
  try {
    const fixed = await sanitizeProductSlugs();
    if (fixed > 0) {
      console.log(`Sanitized ${fixed} product slug(s)`);
    }
  } catch (err) {
    console.error("Slug sanitize failed:", err);
  }
  try {
    const migrated = await migrateProductExhibitionsToItems();
    if (migrated > 0) {
      console.log(`Migrated ${migrated} product exhibition row(s) → ExhibitionItem`);
    }
  } catch (err) {
    console.error("Exhibition item migration failed:", err);
  }
  app.listen(PORT, () => {
    console.log(`Lelek API running on port ${PORT}`);
  });
}

start().catch(console.error);
