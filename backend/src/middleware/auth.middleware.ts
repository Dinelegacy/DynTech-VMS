import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

interface JwtPayload {
  userId: string;
  role: UserRole;
}

// 1. VERIFY JWT TOKEN
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  // Expecting header format: "Bearer <token>"
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Access denied. No authentication token provided.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = decoded; // Attach user info directly to the request object
    next(); // Pass control to the next guard or controller
  } catch (error) {
    res.status(403).json({ error: 'Invalid or expired token.' });
  }
};

// 2. CHECK USER ROLE (RBAC)
export const authorizeRoles = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'User not authenticated.' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ 
        error: `Forbidden: Role '${req.user.role}' lacks necessary permissions.` 
      });
      return;
    }

    next();
  };
};