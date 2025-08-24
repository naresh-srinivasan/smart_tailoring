import express from "express";
import { authenticate } from "./authRoutes.js";
import PromoCode from "../models/PromoCode.js";

const router = express.Router();

/**
 * POST /api/promo/create (admin only)
 */
router.post("/create", authenticate, async (req, res) => {
  const { code, discountPercentage, validFrom, validTo, usageLimit, description } = req.body;

  try {
    const payload = {
      code,
      discountPercentage: discountPercentage ?? 0,
      validFrom: validFrom ? new Date(validFrom) : new Date(),
      validTo: validTo ? new Date(validTo) : new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      usageLimit: usageLimit ?? null,
      description: description ?? null,
    };

    const promo = await PromoCode.create(payload);
    res.status(201).json({ message: "Promo code created", promo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * GET /api/promo/list
 */
router.get("/list", authenticate, async (req, res) => {
  try {
    const promos = await PromoCode.findAll({ order: [["createdAt", "DESC"]] });
    res.json({ promos });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * PUT /api/promo/:id (edit promo)
 */
router.put("/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  const { code, discountPercentage, validTo, usageLimit, description } = req.body;

  try {
    const promo = await PromoCode.findByPk(id);
    if (!promo) return res.status(404).json({ message: "Promo code not found" });

    promo.code = code ?? promo.code;
    promo.discountPercentage = discountPercentage ?? promo.discountPercentage;
    promo.validTo = validTo ? new Date(validTo) : promo.validTo;
    promo.usageLimit = usageLimit ?? promo.usageLimit;
    promo.description = description ?? promo.description;

    await promo.save();
    res.json({ message: "Promo code updated successfully", promo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * DELETE /api/promo/:id (delete promo)
 */
router.delete("/:id", authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const promo = await PromoCode.findByPk(id);
    if (!promo) return res.status(404).json({ message: "Promo code not found" });

    await promo.destroy();
    res.json({ message: "Promo code deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
