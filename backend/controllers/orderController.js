import Order from '../models/Order.js';

export const createOrder = async (req, res) => {
  try {
    const { userId, items, totalAmount } = req.body;
    if (!userId || !items || !totalAmount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newOrder = await Order.create({ userId, items, totalAmount });
    res.status(201).json({ message: 'Order created', order: newOrder });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
