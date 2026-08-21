import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected test route (VIP access only)
router.get('/me', authenticateToken, (req, res) => {
  res.json({
    message: 'Access granted to protected route!',
    currentUser: req.user, // Shows decoded token info
  });
});

// Role-protected test route (Admin/Operator only)
router.get('/admin-test', authenticateToken, authorizeRoles('ADMIN', 'OPERATOR'), (req, res) => {
  res.json({
    message: 'Welcome to the operator dashboard!',
  });
});

export default router;