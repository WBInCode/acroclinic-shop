import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

export interface ApiError extends Error {
  statusCode?: number;
  code?: string;
}

export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('❌ Error:', err);

  // Zod validation errors
  if (err instanceof ZodError) {
    const firstError = err.errors[0];
    res.status(400).json({
      error: firstError ? firstError.message : 'Błąd walidacji danych',
      details: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
    return;
  }

  // Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002':
        res.status(409).json({
          error: 'Wartość już istnieje w bazie danych',
          code: 'DUPLICATE_ENTRY',
        });
        return;
      case 'P2025':
        res.status(404).json({
          error: 'Nie znaleziono rekordu',
          code: 'NOT_FOUND',
        });
        return;
      case 'P2003':
        res.status(400).json({
          error: 'Błąd relacji - powiązany rekord nie istnieje',
          code: 'FOREIGN_KEY_CONSTRAINT',
        });
        return;
      default:
        res.status(500).json({
          error: 'Błąd bazy danych',
          code: err.code,
        });
        return;
    }
  }

  // Custom API errors
  if (err.statusCode) {
    res.status(err.statusCode).json({
      error: err.message,
      code: err.code,
    });
    return;
  }

  // Default server error
  res.status(500).json({
    error: process.env.NODE_ENV === 'development'
      ? err.message
      : 'Wewnętrzny błąd serwera',
  });
};

// Helper to create API errors
export const createError = (message: string, statusCode: number, code?: string): ApiError => {
  const error: ApiError = new Error(message);
  error.statusCode = statusCode;
  error.code = code;
  return error;
};
