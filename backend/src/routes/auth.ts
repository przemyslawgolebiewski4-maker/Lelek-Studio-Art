import { Router } from "express";
import { connectDB } from "../lib/db";
import { COOKIE_NAME, comparePassword, requireAdmin, signToken } from "../lib/auth";
import { User, isLelekAdmin } from "../models";

const router = Router();

router.post("/login", async (req, res) => {
  try {
    const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const password = typeof req.body.password === "string" ? req.body.password : "";

    if (!email || !password) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    await connectDB();
    const user = await User.findOne({ email });
    if (!user || !isLelekAdmin(user)) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = signToken(user._id.toString());
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 604800000,
      path: "/",
    });

    res.json({ ok: true, name: user.name, email: user.email });
  } catch {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

router.post("/logout", (_req, res) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });
  res.json({ ok: true });
});

router.get("/me", requireAdmin, (req, res) => {
  const admin = (req as typeof req & { admin: { name: string; email: string } }).admin;
  res.json({ name: admin.name, email: admin.email });
});

export default router;
