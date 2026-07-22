import { Router } from 'express';
import { createVehicle, listVehicles } from '../controllers/vehicleController.js';
import { authenticate, requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', listVehicles);
router.post('/', authenticate, requireAdmin, createVehicle);

export default router;
