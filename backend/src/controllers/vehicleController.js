import Vehicle from '../models/Vehicle.js';

const REQUIRED_FIELDS = ['make', 'model', 'category', 'year', 'price', 'quantity'];

export async function createVehicle(req, res) {
  const missingFields = REQUIRED_FIELDS.filter(
    (field) => req.body[field] === undefined || req.body[field] === null || req.body[field] === ''
  );

  if (missingFields.length > 0) {
    return res.status(400).json({
      message: `Missing required fields: ${missingFields.join(', ')}`,
    });
  }

  try {
    const vehicle = await Vehicle.create(req.body);
    return res.status(201).json({ vehicle: vehicle.toJSON() });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

export async function listVehicles(_req, res) {
  const vehicles = await Vehicle.find().sort({ createdAt: -1 });
  return res.status(200).json({ vehicles });
}
