import Measurement from '../models/Measurement.js';

export const addMeasurement = async (req, res) => {
  try {
    const { userId, chest, waist, hips } = req.body;
    if (!userId) return res.status(400).json({ message: 'User ID required' });

    const newMeasurement = await Measurement.create({ userId, chest, waist, hips });
    res.status(201).json({ message: 'Measurement added', measurement: newMeasurement });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateMeasurement = async (req, res) => {
  try {
    const { id } = req.params;
    const measurement = await Measurement.findByPk(id);
    if (!measurement) return res.status(404).json({ message: 'Measurement not found' });

    await measurement.update(req.body);
    res.json({ message: 'Measurement updated', measurement });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getMeasurements = async (req, res) => {
  try {
    const measurements = await Measurement.findAll();
    res.json(measurements);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
