import express from "express";
import { authenticate } from "./authRoutes.js"; 
import Measurement from "../models/Measurement.js"; 

const router = express.Router();

// GET: Get all measurements for the logged-in user
router.get("/", authenticate, async (req, res) => {
  try {
    const measurements = await Measurement.findAll({
      where: { user_id: req.userId },
      order: [["createdAt", "DESC"]],
    });

    res.json(measurements);
  } catch (err) {
    console.error("Sequelize error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
