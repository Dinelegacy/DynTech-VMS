import { Router } from 'express';
import {
  getCameras,
  createCamera,
  updateCamera,
  deleteCamera,
} from '../controllers/camera.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Route definitions protected by authentication
router.get('/', authenticateToken, getCameras);
router.post('/', authenticateToken, createCamera);
router.put('/:id', authenticateToken, updateCamera);
router.delete('/:id', authenticateToken, deleteCamera);

// Export router
export const cameraRoutes = router;
export default router;