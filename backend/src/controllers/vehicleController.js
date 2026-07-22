import Vehicle from '../models/Vehicle.js';
import { buildVehicleSearchFilter } from '../utils/vehicleSearch.js';

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

export async function searchVehicles(req, res) {
  const filter = buildVehicleSearchFilter(req.query);
  const vehicles = await Vehicle.find(filter).sort({ createdAt: -1 });
  return res.status(200).json({ vehicles });
}

export async function updateVehicle(req, res) {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    return res.status(200).json({ vehicle: vehicle.toJSON() });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid vehicle ID' });
    }

    return res.status(400).json({ message: error.message });
  }
}

export async function deleteVehicle(req, res) {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    return res.status(200).json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid vehicle ID' });
    }

    return res.status(400).json({ message: error.message });
  }
}

export async function purchaseVehicle(req, res) {
  try {
    const vehicle = await Vehicle.findOneAndUpdate(
      { _id: req.params.id, quantity: { $gt: 0 } },
      { $inc: { quantity: -1 } },
      { new: true }
    );

    if (vehicle) {
      return res.status(200).json({
        message: 'Purchase successful',
        vehicle: vehicle.toJSON(),
      });
    }

    const existing = await Vehicle.findById(req.params.id);

    if (!existing) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    return res.status(400).json({ message: 'Vehicle is out of stock' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid vehicle ID' });
    }

    return res.status(400).json({ message: error.message });
  }
}
