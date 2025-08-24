// routes/orders.js
import express from "express";
import { authenticate } from "./authRoutes.js";
import { User, Order, Measurement } from "../models/index.js"
import Notification from "../models/Notifications.js";
import PromoCode from "../models/PromoCode.js";
import { sendOtpEmail } from "../utils/mailer.js";

const router = express.Router();

/**
 * POST: Save measurements & create order
 */
router.post("/", authenticate, async (req, res) => {
  const { gender, dress_type, measurements, material, color, extras, totalAmount } = req.body;
  const userId = req.userId;

  try {
    // Save measurements
    const measurement = await Measurement.create({
      user_id: userId,
      gender,
      dress_type,
      data: measurements,
      schema: "smart_schema",
    });

    // Create order
    const order = await Order.create({
      userId,
      items: { gender, dress_type, material, color, measurements, extras },
      totalAmount: req.body.totalAmount,
      delivery_address: req.body.delivery_address,
      expected_delivery: req.body.expected_delivery,
      status: "Pending",
      schema: "smart_schema",
    });

    res.status(201).json({ message: "Measurements and order saved successfully", measurement, order });
  } catch (err) {
    console.error("Sequelize error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * GET: Fetch all orders for the logged-in customer
 */
router.get("/my", authenticate, async (req, res) => {
  const userId = req.userId;

  try {
    const orders = await Order.findAll({
      where: { userId },
      include: [
        { model: User, attributes: ["name", "email", "phone"] }
      ],
      order: [["createdAt", "DESC"]],
      schema: "smart_schema",
    });

    res.json({ orders });
  } catch (err) {
    console.error("Sequelize error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * GET: Fetch all orders for admin (with customer info)
 */
router.get("/admin", authenticate, async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: User, attributes: ["name", "email", "phone","address"] }
      ],
      order: [["createdAt", "DESC"]],
      schema: "smart_schema",
    });

    res.json({ orders });
  } catch (err) {
    console.error("Sequelize error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * GET: Fetch a single order by ID
 */
router.get("/:id", authenticate, async (req, res) => {
  const orderId = req.params.id;
  const userId = req.userId;

  try {
    const order = await Order.findOne({
      where: { id: orderId, userId },
      include: [{ model: User, attributes: ["name", "email", "phone", "address"] }],
      schema: "smart_schema",
    });

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json({ order });
  } catch (err) {
    console.error("Sequelize error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * PUT: Update order status (admin only)
 */
// router.put("/:orderId/status", authenticate, async (req, res) => {
//   const { orderId } = req.params;
//   const { status } = req.body;

//   try {
//     const order = await Order.findByPk(orderId);
//     if (!order) return res.status(404).json({ message: "Order not found" });

//     order.status = status;
//     await order.save();

// //     res.json({ message: "Status updated successfully", order });
//      console.error("Sequelize error:", err);
//  res.status(500).json({ message: "Server error", error: err.message });
//  }
//  });

// GET orders stats
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

// POST /api/inventory/check
router.post("/check", async (req, res) => {
  const { material, requiredQuantity } = req.body;
  const inv = await Inventory.findOne({ where: { material_name: material } });

  if (!inv) return res.json({ available: false, availableQuantity: 0 });

  if (inv.available_quantity >= requiredQuantity)
    return res.json({ available: true, availableQuantity: inv.available_quantity });
  else
    return res.json({ available: false, availableQuantity: inv.available_quantity });
});

// Example with Express.js
router.post("/api/orders/:orderId/feedback", async (req, res) => {
  const { orderId } = req.params;
  const { feedback, rating } = req.body;

  try {
    const order = await Order.findByPk(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.feedback_text = feedback;
    order.feedback_rating = rating;
    await order.save();

    res.json({ message: "Feedback saved successfully", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/:orderId/feedback", authenticate, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { feedback, rating } = req.body;

    const order = await Order.findByPk(orderId);

    if (!order) return res.status(404).json({ message: "Order not found" });

    // Only allow feedback for delivered orders
    if (order.status !== "Delivered")
      return res.status(400).json({ message: "Cannot give feedback for undelivered orders" });

    await order.update({
      feedback_text: feedback,
      feedback_rating: rating,
    });

    res.json({ message: "Feedback submitted successfully", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});



router.post("/:id/cancel", authenticate, async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  if (!reason || reason.trim() === "") {
    return res.status(400).json({ message: "Cancellation reason required" });
  }

  try {
    const order = await Order.findOne({ where: { id, userId: req.user.id } });
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.status !== "Pending") {
      return res.status(400).json({ message: "Only pending orders can be cancelled" });
    }

    order.status = "Cancelled";
    order.cancelReason = reason;
    await order.save();

    res.json({ message: "Order cancelled successfully", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to cancel order" });
  }
});

router.put("/:id/status", authenticate, async (req, res) => {
  const { id } = req.params;
  const { status, otp } = req.body; // otp required for Delivered

  try {
    const order = await Order.findByPk(id, { include: ["User"] });
    if (!order) return res.status(404).json({ message: "Order not found" });

    const now = new Date();

    // Generate OTP if status is "Out for Delivery"
    if (status === "Out for Delivery") {
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      order.delivery_otp = generatedOtp;
      order.otp_verified = false;
      order.outForDeliveryAt = now;

      if (order.User?.email) {
        await sendOtpEmail(order.User.email, generatedOtp);
      }
    }

    // Handle Delivered status
    if (status === "Delivered") {
      if (!order.delivery_otp) {
        return res.status(400).json({ message: "OTP has not been generated yet." });
      }
      if (!otp) {
        return res.status(400).json({ message: "OTP is required to mark as Delivered." });
      }
      if (otp !== order.delivery_otp) {
        return res.status(400).json({ message: "OTP is incorrect." });
      }
      order.otp_verified = true;
      order.deliveredAt = now;
    }

    // Track timestamps for other statuses
    switch (status) {
      case "Pending":
        order.pendingAt = order.pendingAt || now;
        break;
      case "Order Accepted":
        order.orderAcceptedAt = now;
        break;
      case "Shipped":
        order.shippedAt = now;
        break;
      case "Cancelled":
        order.cancelledAt = now;
        break;
    }

    order.status = status;
    await order.save();

    // Create notification
    await Notification.create({
      userId: order.userId,
      orderId: order.id,
      title: "Order Status Update",
      message: `Your order #${order.id} is now "${status}".`,
    });

    res.json({ message: `Order status updated to "${status}" successfully`, order });

  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


router.post("/validate", authenticate, async (req, res) => {
  const { code } = req.body;
  const userId = req.userId;

  if (!code) return res.status(400).json({ valid: false, message: "Promo code is required" });

  try {
    const promo = await PromoCode.findOne({ where: { code } });

    if (!promo) return res.status(404).json({ valid: false, message: "Invalid promo code" });

    const now = new Date();

    if (promo.validFrom > now) return res.status(400).json({ valid: false, message: "Promo code not yet active" });
    if (promo.validTo < now) return res.status(400).json({ valid: false, message: "Promo code expired" });
    if (promo.usageLimit !== null && promo.usedCount >= promo.usageLimit)
      return res.status(400).json({ valid: false, message: "Promo code usage limit reached" });

    // Increment used count
    promo.usedCount += 1;
    await promo.save();

    res.json({
      valid: true,
      discountPercentage: promo.discountPercentage,
      message: `Promo code applied! You get ${promo.discountPercentage}% off.`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ valid: false, message: "Server error", error: err.message });
  }
});

// POST /api/promocode/remove
router.post("/remove", authenticate, async (req, res) => {
  const { code } = req.body;

  if (!code) return res.status(400).json({ message: "Promo code is required" });

  try {
    const promo = await PromoCode.findOne({ where: { code } });

    if (!promo) return res.status(404).json({ message: "Invalid promo code" });

    // Decrement used count but ensure it doesn't go below 0
    promo.usedCount = Math.max(promo.usedCount - 1, 0);
    await promo.save();

    res.json({ message: "Promo code removed", discountPercentage: promo.discountPercentage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// router.get("/:id", authenticate, async (req, res) => {
//   try {
//     const user = await User.findByPk(req.params.id, {
//       attributes: ["id", "name", "email", "phone", "address"], // include any other fields you need
//     });

//     if (!user) return res.status(404).json({ message: "User not found" });

//     res.json(user);
//   } catch (err) {
//     console.error("Error fetching user:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

export default router;
