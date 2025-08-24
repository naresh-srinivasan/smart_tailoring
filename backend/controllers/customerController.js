import User from "../models/User.js";

export const getCustomers = async (req, res) => {
  try {
    const customers = await User.findAll({
      where: { role: "Customer" },
      attributes: ["id", "name", "email", "phone"],
    });
    res.json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ message: "Server error" });
  }
};
