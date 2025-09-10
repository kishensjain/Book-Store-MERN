import { Request, Response, NextFunction } from 'express';

interface AuthRequest extends Request {
  user?: {                // req may have a "user" object
    role: string;         // user has at least a "role" property
    [key: string]: any;   // may also have other properties (like id, email, etc.)
  };
}

export const adminRoute = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Admins only.' });
    }
};