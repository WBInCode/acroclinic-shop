import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, extractTokenFromHeader, TokenPayload } from '../lib/jwt.js';
import { prisma } from '../lib/prisma.js';

// Extend Express Request
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
      sessionId?: string;
    }
  }
}

// Authentication middleware - wymagane zalogowanie
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      res.status(401).json({ error: 'Brak tokenu autoryzacji' });
      return;
    }

    const payload = verifyAccessToken(token);

    if (!payload) {
      res.status(401).json({ error: 'Nieprawidłowy lub wygasły token' });
      return;
    }

    // Verify user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, isActive: true },
    });

    if (!user || !user.isActive) {
      res.status(401).json({ error: 'Konto nie istnieje lub jest nieaktywne' });
      return;
    }

    req.user = payload;
    next();
  } catch (error) {
    next(error);
  }
};

// Optional authentication - pozwala na dostęp bez logowania
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (token) {
      const payload = verifyAccessToken(token);
      if (payload) {
        const user = await prisma.user.findUnique({
          where: { id: payload.userId },
          select: { id: true, isActive: true },
        });

        if (user && user.isActive) {
          req.user = payload;
        }
      }
    }

    // Get session ID for guest users
    req.sessionId = req.headers['x-session-id'] as string || req.cookies?.sessionId;

    next();
  } catch (error) {
    next(error);
  }
};

// Admin only middleware
export const adminOnly = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Wymagane zalogowanie' });
      return;
    }

    if (req.user.role !== 'ADMIN') {
      res.status(403).json({ error: 'Brak uprawnień administratora' });
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
};
