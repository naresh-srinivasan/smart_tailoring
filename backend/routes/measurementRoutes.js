// routes/measurements.js
import express from "express";
import Measurement from "../models/Measurement.js";
import { authenticate } from "./authRoutes.js";
import User from "../models/User.js";

const router = express.Router();

/**
 * Create new measurement profile
 * POST /api/measurements
 */
router.post("/", authenticate, async (req, res) => {
  try {
    const { person_name, gender, data } = req.body;
    const userId = req.userId;

    // Validate required fields
    if (!person_name || !gender) {
      return res.status(400).json({ 
        error: "Person name and gender are required" 
      });
    }

    const measurement = await Measurement.create({
      userId,
      person_name,
      gender,
      data: data || {},
    });

    res.status(201).json(measurement);
  } catch (err) {
    console.error("Error creating measurement:", err);
    res.status(500).json({ error: "Failed to save measurement profile" });
  }
});

/**
 * Get all measurement profiles for logged-in user
 * GET /api/measurements
 */
router.get("/", authenticate, async (req, res) => {
  try {
    const userId = req.userId;
    
    const measurements = await Measurement.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });

    res.json(measurements);
  } catch (err) {
    console.error("Error fetching measurements:", err);
    res.status(500).json({ error: "Failed to fetch measurement profiles" });
  }
});

/**
 * Update a measurement profile
 * PUT /api/measurements/:id
 */
router.put("/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { person_name, gender, data } = req.body;
    const userId = req.userId;

    // Validate required fields
    if (!person_name || !gender) {
      return res.status(400).json({ 
        error: "Person name and gender are required" 
      });
    }

    const measurement = await Measurement.findOne({
      where: { id, userId },
    });

    if (!measurement) {
      return res.status(404).json({ error: "Measurement profile not found" });
    }

    // Update the measurement
    await measurement.update({
      person_name,
      gender,
      data: data || {},
    });

    res.json(measurement);
  } catch (err) {
    console.error("Error updating measurement:", err);
    res.status(500).json({ error: "Failed to update measurement profile" });
  }
});

/**
 * Delete a measurement profile
 * DELETE /api/measurements/:id
 */
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const measurement = await Measurement.findOne({
      where: { id, userId },
    });

    if (!measurement) {
      return res.status(404).json({ error: "Measurement profile not found" });
    }

    await measurement.destroy();
    res.json({ message: "Measurement profile deleted successfully" });
  } catch (err) {
    console.error("Error deleting measurement:", err);
    res.status(500).json({ error: "Failed to delete measurement profile" });
  }
});

/**
 * Get measurement profiles by gender (optional - for filtering)
 * GET /api/measurements/gender/:gender
 */
router.get("/gender/:gender", authenticate, async (req, res) => {
  try {
    const { gender } = req.params;
    const userId = req.userId;
    
    const measurements = await Measurement.findAll({
      where: { 
        userId,
        gender: gender 
      },
      order: [["createdAt", "DESC"]],
    });

    res.json(measurements);
  } catch (err) {
    console.error("Error fetching measurements by gender:", err);
    res.status(500).json({ error: "Failed to fetch measurement profiles" });
  }
});

export default router;