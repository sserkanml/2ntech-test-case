import { Request, Response, NextFunction } from 'express';
import { AuthService } from '@/services/auth';

declare global {
    namespace Express {
        interface Request {
            userId?: string
        }
    }
}

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader) {
        res.status(401).json({ message: 'No token provided' });
        return;
      }
  
      const token = authHeader.split(' ')[1];
      const authService = new AuthService();
      const userId = await authService.validateToken(token);
      
      req.userId = userId;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Invalid token' });
    }
  };