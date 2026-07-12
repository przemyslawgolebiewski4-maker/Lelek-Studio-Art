import { Router } from "express";
import { connectDB } from "../lib/db";
import { adminCookieOptions } from "../lib/cookies";
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
      res.status(401).json({ error: "Invalid credentials", code: "not_admin" });
      return;
    }

    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "Invalid credentials", code: "wrong_password" });
      return;
    }

    const token = signToken(user._id.toString());
    res.cookie(COOKIE_NAME, token, adminCookieOptions(req.hostname));

    res.json({ ok: true, name: user.name, email: user.email, token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      error: "Server error during login",
      code: "server_error",
      hint: "Check JWT_SECRET and DATABASE_URL on Railway",
    });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie(COOKIE_NAME, adminCookieOptions(req.hostname));
  res.json({ ok: true });
});

router.get("/me", requireAdmin, (req, res) => {
  const admin = (req as typeof req & { admin: { name: string; email: string } }).admin;
  res.json({ name: admin.name, email: admin.email });
});

export default router;
