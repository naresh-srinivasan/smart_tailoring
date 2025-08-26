// routes/notificationsRoutes.js
import express from "express";
import { authenticate } from "./authRoutes.js";
import Notification from "../models/Notifications.js";

const router = express.Router();

// POST: Create a new notification (Admin only)
router.post("/", authenticate, async (req, res) => {
  const { title, message, orderId, userId } = req.body;

  try {
    if (req.userRole !== "Admin") {
      return res.status(403).json({ message: "Forbidden: Admin only" });
    }

    // Create notification in DB
    const notification = await Notification.create({
      userId,
      orderId,
      title,
      message,
      read: false,
    });

    // Emit real-time notification via Socket.IO
    const io = req.app.get("io");
    io.emit(`notification-${userId}`, {
      id: notification.id,
      title: notification.title,
      message: notification.message,
      orderId: notification.orderId,
      createdAt: notification.createdAt,
      read: false,
    });

    res.status(201).json({ message: "Notification posted", notification });
  } catch (err) {
    console.error("Error creating notification:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET: Fetch notifications for logged-in user
router.get("/", authenticate, async (req, res) => {
  try {
    const userId = req.userId;

    const notifications = await Notification.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });

    res.json({ notifications });
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// PUT: Mark a notification as read
router.put("/:id/read", authenticate, async (req, res) => {
  const notifId = req.params.id;
  const userId = req.userId;

  try {
    const notification = await Notification.findOne({
      where: { id: notifId, userId },
    });

    if (!notification) return res.status(404).json({ message: "Notification not found" });

    notification.read = true;
    await notification.save();

    res.json({ message: "Notification marked as read", notification });
  } catch (err) {
    console.error("Error updating notification:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get all notifications
router.get("/", authenticate, async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

// Mark as read
router.patch("/:id/read", authenticate, async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) return res.status(404).json({ error: "Not found" });
    notification.read = true;
    await notification.save();
    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: "Failed to update notification" });
  }
});

export default router;
