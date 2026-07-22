import { Router } from 'express';
import { createVehicle, deleteVehicle, listVehicles, purchaseVehicle, restockVehicle, searchVehicles, updateVehicle } from '../controllers/vehicleController.js';
import { authenticate, requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/search', searchVehicles);
router.get('/', listVehicles);
router.post('/', authenticate, requireAdmin, createVehicle);
router.post('/:id/purchase', authenticate, purchaseVehicle);
router.post('/:id/restock', authenticate, requireAdmin, restockVehicle);
router.put('/:id', authenticate, requireAdmin, updateVehicle);
router.delete('/:id', authenticate, requireAdmin, deleteVehicle);

export default router;