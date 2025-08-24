import express from "express";
import { authenticate } from "./authRoutes.js"; // JWT middleware
import Measurement from "../models/Measurement.js";
import Order from "../models/Order.js";
import User from "../models/User.js";

const router = express.Router();

router.get("/me", authenticate, async (req, res) => {
  try {
    const userId = req.userId; // set by JWT middleware
    const user = await User.findByPk(userId, {
      attributes: ["id", "name", "email", "phone", "address", "profileImage"],
    });

    if (!req.user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


// POST: Save measurements & create order
router.post("/", authenticate, async (req, res) => {
  const { gender, dress_type, measurements, material, color, extras, totalAmount, delivery_address} = req.body;
  const user_id = req.userId;

  try {
    // 1️⃣ Save measurements
    const measurement = await Measurement.create({
      user_id,
      gender,
      dress_type,
      data: measurements, // saves whole object as JSON
    });

    // 2️⃣ Create order
    const order = await Order.create({
      userId: user_id,
      items: {
        gender,
        dress_type,
        material,
        color,
        measurements,
        extras,
      },
      totalAmount: totalAmount,
      delivery_address: delivery_address,
      status: "Pending",
    });

    res.status(201).json({
      message: "Measurements and Order saved successfully",
      measurement,
      order,
    });
  } catch (err) {
    console.error("Sequelize error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET: Fetch all orders with customer info
router.get("/", authenticate, async (req, res) => {
  try {
    const user_id = req.userId;

    const orders = await Order.findAll({
      where: { userId: user_id },
      include: [
        {
          model: User,
          attributes: ["name", "phone", "email"], // include customer info
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({ orders });
  } catch (err) {
    console.error("Sequelize error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.get("/notifications", authenticate, async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { userId: req.userId },
      order: [["createdAt", "DESC"]],
    });
    res.json({ notifications });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
