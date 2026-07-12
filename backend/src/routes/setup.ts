import { Router } from "express";
import { seedDatabase } from "../lib/seed-database";

const router = Router();

router.get("/seed", async (req, res) => {
  try {
    const secret = req.query.secret;
    if (!process.env.SETUP_SECRET || secret !== process.env.SETUP_SECRET) {
      res.status(401).json({ ok: false, error: "Unauthorized" });
      return;
    }
    const force = req.query.force === "true";
    const result = await seedDatabase({ force });
    res.json({ ok: true, ...result });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
});

export default router;
