import { Router } from 'express';
import { createVehicle } from '../controllers/vehicleController.js';
import { authenticate, requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', authenticate, requireAdmin, createVehicle);

export default router;
