import { Router } from "express";
import { connectDB } from "../lib/db";
import { hashPassword } from "../lib/auth";
import { seedDatabase } from "../lib/seed-database";
import { isSetupAuthorized, setupUnauthorized } from "../lib/setup-auth";
import { User, Product, Setting } from "../models";

const router = Router();

router.get("/status", async (req, res) => {
  if (!isSetupAuthorized(req)) {
    res.status(401).json(setupUnauthorized());
    return;
  }

  try {
    await connectDB();
    const [products, settings, admins] = await Promise.all([
      Product.countDocuments(),
      Setting.countDocuments(),
      User.countDocuments({ adminRole: "lelek_admin" }),
    ]);

    res.json({
      ok: true,
      database: "connected",
      counts: { products, settings, admins },
      ready: products > 0 && admins > 0,
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
});

router.get("/seed", async (req, res) => {
  if (!isSetupAuthorized(req)) {
    res.status(401).json(setupUnauthorized());
    return;
  }

  try {
    const force = req.query.force === "true";
    const result = await seedDatabase({ force });
    res.json({ ok: true, ...result });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
});

router.post("/admin", async (req, res) => {
  if (!isSetupAuthorized(req)) {
    res.status(401).json(setupUnauthorized());
    return;
  }

  try {
    const email =
      typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const password = typeof req.body.password === "string" ? req.body.password : "";
    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";

    if (!email || !password || !name) {
      res.status(400).json({ ok: false, error: "email, password and name required" });
      return;
    }

    if (password.length < 12) {
      res.status(400).json({ ok: false, error: "Password must be at least 12 characters" });
      return;
    }

    await connectDB();
    const existing = await User.findOne({ email });
    if (existing) {
      res.status(409).json({ ok: false, error: "User already exists" });
      return;
    }

    const passwordHash = await hashPassword(password);
    const user = await User.create({
      email,
      passwordHash,
      name,
      adminRole: "lelek_admin",
      emailVerified: true,
      adminPermissions: {
        home: true,
        shop: true,
        journal: true,
        messages: true,
        seo: true,
        users: true,
      },
    });

    res.status(201).json({
      ok: true,
      message: "Admin created",
      user: { id: user._id.toString(), email: user.email, name: user.name },
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
});

export default router;
