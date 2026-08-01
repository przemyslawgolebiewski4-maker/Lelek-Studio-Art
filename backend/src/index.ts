import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db";
import { sanitizeProductSlugs } from "./lib/slug";

import authRouter from "./routes/auth";
import { productsPublicRouter, productsAdminRouter } from "./routes/products";
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
app.use(settingsPublicRouter);
app.use(journalPublicRouter);
app.use("/auth", authRouter);
app.use("/admin", productsAdminRouter);
app.use("/admin", messagesRouter);
app.use("/admin", settingsAdminRouter);
app.use("/admin", journalAdminRouter);
app.use("/contact", contactRouter);
app.use("/setup", setupRouter);

async function start() {
  await connectDB();
  try {
    const fixed = await sanitizeProductSlugs();
    if (fixed > 0) {
      console.log(`Sanitized ${fixed} product slug(s)`);
    }
  } catch (err) {
    console.error("Slug sanitize failed:", err);
  }
  app.listen(PORT, () => {
    console.log(`Lelek API running on port ${PORT}`);
  });
}

start().catch(console.error);
