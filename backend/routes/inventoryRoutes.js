import express from "express";
import Inventory from "../models/Inventory.js";

const router = express.Router();

// Validate ID before any route
const validateId = (req, res, next) => {
  const { id } = req.params;
  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: "Invalid ID" });
  }
  next();
};

// CREATE material
router.post("/", async (req, res) => {
  try {
    const { material_name, material_type, color, color_code, pattern, total_quantity, price } = req.body;
    const item = await Inventory.create({ material_name, material_type, color, color_code, pattern, total_quantity, price });
    res.status(201).json({ message: "Material added successfully", item });
  } catch (err) {
    console.error("Create Error:", err);
    res.status(500).json({ error: "Failed to add material" });
  }
});

// READ all materials
router.get("/", async (req, res) => {
  try {
    const items = await Inventory.findAll({ order: [["id", "DESC"]] });
    res.json({ items });
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ error: "Failed to fetch inventory" });
  }
});

// UPDATE material (full update)
router.put("/:id", validateId, async (req, res) => {
  const { id } = req.params;
  try {
    const item = await Inventory.findByPk(id);
    if (!item) return res.status(404).json({ error: "Material not found" });

    const { material_name, material_type, color, color_code, pattern, total_quantity, price } = req.body;
    item.material_name = material_name;
    item.material_type = material_type;
    item.color = color;
    item.color_code = color_code;
    item.pattern = pattern;
    item.total_quantity = Number(total_quantity);
    item.price = Number(price);

    await item.save();
    res.json({ message: "Material updated successfully", item });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ error: "Failed to update material" });
  }
});

// PATCH only total_quantity
router.patch("/:id", validateId, async (req, res) => {
  const { id } = req.params;
  const { total_quantity } = req.body;
  try {
    const item = await Inventory.findByPk(id);
    if (!item) return res.status(404).json({ error: "Material not found" });

    item.total_quantity = Number(total_quantity);
    await item.save();

    res.json({ message: "Material quantity updated successfully", item });
  } catch (err) {
    console.error("Quantity Update Error:", err);
    res.status(500).json({ error: "Failed to update material quantity" });
  }
});

// DELETE material
router.delete("/:id", validateId, async (req, res) => {
  const { id } = req.params;
  try {
    const item = await Inventory.findByPk(id);
    if (!item) return res.status(404).json({ error: "Material not found" });

    await item.destroy();
    res.json({ message: "Material deleted successfully" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ error: "Failed to delete material" });
  }
});

// Get unique colors
router.get("/colors", async (req, res) => {
  const { material } = req.query;
  if (!material) return res.status(400).json({ error: "Material is required" });

  try {
    const items = await Inventory.findAll({
      where: { material_name: material },
      attributes: ["color", "color_code"],
    });

    const colors = [
      ...new Map(items.map((item) => [item.color, item.color_code])).entries(),
    ].map(([color, color_code]) => ({ color, color_code }));

    res.json({ colors });
  } catch (err) {
    console.error("Colors Fetch Error:", err);
    res.status(500).json({ error: "Failed to fetch colors" });
  }
});

// Get unique patterns
router.get("/patterns", async (req, res) => {
  const { material } = req.query;
  if (!material) return res.status(400).json({ error: "Material is required" });

  try {
    const items = await Inventory.findAll({
      where: { material_name: material },
      attributes: ["pattern"],
    });

    const patterns = [...new Set(items.map((item) => item.pattern).filter(Boolean))];

    res.json({ patterns });
  } catch (err) {
    console.error("Patterns Fetch Error:", err);
    res.status(500).json({ error: "Failed to fetch patterns" });
  }
});

export default router;
