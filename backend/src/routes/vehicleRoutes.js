import { Router } from 'express';
import { createVehicle, deleteVehicle, listVehicles, purchaseVehicle, searchVehicles, updateVehicle } from '../controllers/vehicleController.js';
import { authenticate, requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/search', searchVehicles);
router.get('/', listVehicles);
router.post('/', authenticate, requireAdmin, createVehicle);
router.post('/:id/purchase', authenticate, purchaseVehicle);
router.put('/:id', authenticate, requireAdmin, updateVehicle);
router.delete('/:id', authenticate, requireAdmin, deleteVehicle);

export default router;