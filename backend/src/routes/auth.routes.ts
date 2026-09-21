import { Router, Request, Response } from 'express';
import { register, login } from '../controllers/auth.controller';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware';

interface AuthRequest extends Request {
  user?: {
    userId: string; 
    email?: string;
    role: string;
  };
}

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected test route
router.get('/me', authenticateToken, (req: AuthRequest, res: Response) => {
  res.json({
    message: 'Access granted to protected route!',
    currentUser: req.user,
  });
});

// Role-protected test route
router.get('/admin-test', authenticateToken, authorizeRoles('ADMIN', 'OPERATOR'), (req: Request, res: Response) => {
  res.json({
    message: 'Welcome to the operator dashboard!',
  });
});

export default router;