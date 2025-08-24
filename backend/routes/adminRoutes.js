// routes/admin.js
import express from "express";
import User from "../models/User.js";
import { authenticate } from "./authRoutes.js";
import Order from "../models/Order.js";
import { fn, col, literal } from "sequelize";
import bcrypt from "bcryptjs";


const router = express.Router();

// GET total customers
router.get("/customers/count", authenticate, async (req, res) => {
  try {
    const count = await User.count();
    res.json({ count });
  } catch (err) {
    console.error("Error fetching total customers:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET total orders
router.get("/orders/count", authenticate, async (req, res) => {
  try {
    const count = await Order.count();
    res.json({ count });
  } catch (err) {
    console.error("Error fetching total orders:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.get("/orders/stats", authenticate, async (req, res) => {
  try {
    const totalOrders = await Order.count();
    const pendingOrders = await Order.count({ where: { status: "Pending" } });
    const completedOrders = await Order.count({ where: { status: "Delivered" } });

    res.json({ totalOrders, pendingOrders, completedOrders });
  } catch (err) {
    console.error("Error fetching order stats:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});



router.get("/orders/daily-stats", authenticate, async (req, res) => {
  try {
    const results = await Order.findAll({
      attributes: [
        [fn("DATE", col("createdAt")), "date"],      // Extract only date
        [fn("COUNT", col("id")), "count"],           // Count orders per date
      ],
      group: [literal("DATE(\"createdAt\")")],       // Important for Postgres grouping
      order: [[literal("DATE(\"createdAt\")"), "ASC"]],
      raw: true, // returns plain objects instead of model instances
    });

    const dailyStats = results.map((r) => ({
      date: r.date,
      count: parseInt(r.count, 10),
    }));

    res.json(dailyStats);
  } catch (err) {
    console.error("Error fetching daily stats:", err);
    res.status(500).json({
      error: "Failed to fetch daily order stats",
      details: err.message,
    });
  }
});

router.get("/orders/completed-daily-stats", authenticate, async (req, res) => {
  try {
    const results = await Order.findAll({
      attributes: [
        [fn("DATE", col("deliveredAt")), "date"], // Use deliveredAt
        [fn("COUNT", col("id")), "count"],
      ],
      where: { status: "Delivered" },
      group: [literal('DATE("deliveredAt")')],
      order: [[literal('DATE("deliveredAt")'), "ASC"]],
      raw: true,
    });

    const dailyStats = results.map((r) => ({
      date: r.date,
      count: parseInt(r.count, 10),
    }));

    res.json(dailyStats);
  } catch (err) {
    console.error("Error fetching completed daily stats:", err);
    res.status(500).json({ error: "Failed to fetch completed orders stats", details: err.message });
  }
});



router.get("/", async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users.map(user => user.toSafeObject()));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

/**
 * ✅ Get user by ID
 */
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user.toSafeObject());
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

/**
 * ✅ Create new user
 */
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, password, address, profileImage, role } = req.body;

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      address,
      profileImage,
      role
    });

    res.status(201).json(newUser.toSafeObject());
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

/**
 * ✅ Update user
 */
router.put("/:id", async (req, res) => {
  try {
    const { name, email, phone, password, address, profileImage, role, isActive } = req.body;

    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // update password only if provided
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.update({
      name,
      email,
      phone,
      address,
      profileImage,
      role,
      isActive
    });

    res.json(user.toSafeObject());
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

/**
 * ✅ Delete user
 */
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    await user.destroy();
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

export default router;
