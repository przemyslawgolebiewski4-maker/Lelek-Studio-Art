import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db";

import authRouter from "./routes/auth";
import { productsPublicRouter, productsAdminRouter } from "./routes/products";
import messagesRouter from "./routes/messages";
import contactRouter from "./routes/contact";
import { settingsPublicRouter, settingsAdminRouter } from "./routes/settings";
import setupRouter from "./routes/setup";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: [
      "https://www.lelekstudio.com",
      "https://lelek-studio-art.vercel.app",
      process.env.FRONTEND_URL ?? "http://localhost:3000",
    ],
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
app.use("/auth", authRouter);
app.use("/admin", productsAdminRouter);
app.use("/admin", messagesRouter);
app.use("/admin", settingsAdminRouter);
app.use("/contact", contactRouter);
app.use("/setup", setupRouter);

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Lelek API running on port ${PORT}`);
  });
}

start().catch(console.error);
