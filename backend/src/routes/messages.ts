import { Router } from "express";
import { connectDB } from "../lib/db";
import { requireAdmin } from "../lib/auth";
import { Message } from "../models";

const router = Router();

router.get("/messages", requireAdmin, async (req, res) => {
  try {
    await connectDB();
    const filter = req.query.filter === "unread" ? { read: false } : {};
    const messages = await Message.find(filter).sort({ createdAt: -1 }).lean();
    res.json({ ok: true, messages });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
});

router.patch("/messages/:id", requireAdmin, async (req, res) => {
  try {
    await connectDB();
    const read = req.body.read !== undefined ? Boolean(req.body.read) : true;
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { read },
      { new: true },
    ).lean();
    if (!message) {
      res.status(404).json({ ok: false, error: "Not found" });
      return;
    }
    res.json({ ok: true, message });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
});

router.delete("/messages/:id", requireAdmin, async (req, res) => {
  try {
    await connectDB();
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) {
      res.status(404).json({ ok: false, error: "Not found" });
      return;
    }
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
});

export default router;
