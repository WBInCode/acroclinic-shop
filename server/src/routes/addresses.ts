import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticate } from '../middleware/auth.js';
import { createError } from '../middleware/errorHandler.js';
import { z } from 'zod';

const router = Router();

// Schema walidacji adresu
const addressSchema = z.object({
  type: z.enum(['SHIPPING', 'BILLING']).default('SHIPPING'),
  label: z.string().max(50).optional(),
  firstName: z.string().min(2, 'Imię musi mieć minimum 2 znaki').max(50),
  lastName: z.string().min(2, 'Nazwisko musi mieć minimum 2 znaki').max(50),
  companyName: z.string().max(100).optional(),
  nip: z.string().regex(/^\d{10}$/, 'NIP musi mieć 10 cyfr').optional().or(z.literal('')),
  street: z.string().min(3, 'Adres musi mieć minimum 3 znaki').max(100),
  city: z.string().min(2, 'Miasto musi mieć minimum 2 znaki').max(50),
  postalCode: z.string().regex(/^\d{2}-\d{3}$/, 'Kod pocztowy musi być w formacie XX-XXX'),
  country: z.string().default('Polska'),
  phone: z.string().min(9).max(15).optional(),
  email: z.string().email('Nieprawidłowy email').optional().or(z.literal('')),
  isDefault: z.boolean().default(false),
});

// GET /api/addresses - Pobierz wszystkie adresy użytkownika
router.get('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;

    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    res.json({ addresses });
  } catch (error) {
    next(error);
  }
});

// GET /api/addresses/:type - Pobierz adresy według typu (shipping/billing)
router.get('/type/:type', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const type = req.params.type.toUpperCase();

    if (type !== 'SHIPPING' && type !== 'BILLING') {
      throw createError('Nieprawidłowy typ adresu', 400, 'INVALID_ADDRESS_TYPE');
    }

    const addresses = await prisma.address.findMany({
      where: { 
        userId,
        type: type as 'SHIPPING' | 'BILLING',
      },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    res.json({ addresses });
  } catch (error) {
    next(error);
  }
});

// GET /api/addresses/:id - Pobierz pojedynczy adres
router.get('/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const addressId = req.params.id;

    const address = await prisma.address.findFirst({
      where: { 
        id: addressId,
        userId,
      },
    });

    if (!address) {
      throw createError('Adres nie znaleziony', 404, 'ADDRESS_NOT_FOUND');
    }

    res.json({ address });
  } catch (error) {
    next(error);
  }
});

// POST /api/addresses - Utwórz nowy adres
router.post('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const data = addressSchema.parse(req.body);

    // Jeśli to pierwszy adres danego typu, ustaw jako domyślny
    const existingAddressCount = await prisma.address.count({
      where: { userId, type: data.type },
    });

    const isDefault = existingAddressCount === 0 ? true : data.isDefault;

    // Jeśli ustawiamy jako domyślny, usuń flagę z innych adresów tego typu
    if (isDefault) {
      await prisma.address.updateMany({
        where: { 
          userId,
          type: data.type,
          isDefault: true,
        },
        data: { isDefault: false },
      });
    }

    // Wyczyść pusty NIP i email
    const cleanData = {
      ...data,
      nip: data.nip || null,
      email: data.email || null,
      isDefault,
    };

    const address = await prisma.address.create({
      data: {
        ...cleanData,
        userId,
      },
    });

    res.status(201).json({ 
      message: 'Adres został dodany',
      address,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Nieprawidłowe dane',
        details: error.errors,
      });
    }
    next(error);
  }
});

// PUT /api/addresses/:id - Aktualizuj adres
router.put('/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const addressId = req.params.id;
    const data = addressSchema.partial().parse(req.body);

    // Sprawdź czy adres istnieje i należy do użytkownika
    const existingAddress = await prisma.address.findFirst({
      where: { 
        id: addressId,
        userId,
      },
    });

    if (!existingAddress) {
      throw createError('Adres nie znaleziony', 404, 'ADDRESS_NOT_FOUND');
    }

    // Jeśli ustawiamy jako domyślny, usuń flagę z innych adresów tego typu
    if (data.isDefault) {
      const type = data.type || existingAddress.type;
      await prisma.address.updateMany({
        where: { 
          userId,
          type,
          isDefault: true,
          id: { not: addressId },
        },
        data: { isDefault: false },
      });
    }

    // Wyczyść pusty NIP i email
    const cleanData = {
      ...data,
      nip: data.nip === '' ? null : data.nip,
      email: data.email === '' ? null : data.email,
    };

    const address = await prisma.address.update({
      where: { id: addressId },
      data: cleanData,
    });

    res.json({ 
      message: 'Adres został zaktualizowany',
      address,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Nieprawidłowe dane',
        details: error.errors,
      });
    }
    next(error);
  }
});

// DELETE /api/addresses/:id - Usuń adres
router.delete('/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const addressId = req.params.id;

    // Sprawdź czy adres istnieje i należy do użytkownika
    const existingAddress = await prisma.address.findFirst({
      where: { 
        id: addressId,
        userId,
      },
    });

    if (!existingAddress) {
      throw createError('Adres nie znaleziony', 404, 'ADDRESS_NOT_FOUND');
    }

    // Sprawdź czy adres nie jest używany w zamówieniach
    const ordersWithAddress = await prisma.order.count({
      where: { addressId },
    });

    if (ordersWithAddress > 0) {
      // Nie usuwamy adresu, tylko odłączamy od użytkownika (soft delete)
      await prisma.address.update({
        where: { id: addressId },
        data: { 
          userId: existingAddress.userId, // Zachowaj userId dla historii
          isDefault: false,
        },
      });
      
      return res.json({ 
        message: 'Adres został zarchiwizowany (używany w zamówieniach)',
      });
    }

    await prisma.address.delete({
      where: { id: addressId },
    });

    // Jeśli usunięty adres był domyślny, ustaw pierwszy pozostały jako domyślny
    if (existingAddress.isDefault) {
      const nextAddress = await prisma.address.findFirst({
        where: { 
          userId,
          type: existingAddress.type,
        },
        orderBy: { createdAt: 'desc' },
      });

      if (nextAddress) {
        await prisma.address.update({
          where: { id: nextAddress.id },
          data: { isDefault: true },
        });
      }
    }

    res.json({ 
      message: 'Adres został usunięty',
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/addresses/:id/set-default - Ustaw adres jako domyślny
router.post('/:id/set-default', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const addressId = req.params.id;

    // Sprawdź czy adres istnieje i należy do użytkownika
    const existingAddress = await prisma.address.findFirst({
      where: { 
        id: addressId,
        userId,
      },
    });

    if (!existingAddress) {
      throw createError('Adres nie znaleziony', 404, 'ADDRESS_NOT_FOUND');
    }

    // Usuń flagę domyślnego z innych adresów tego typu
    await prisma.address.updateMany({
      where: { 
        userId,
        type: existingAddress.type,
        isDefault: true,
      },
      data: { isDefault: false },
    });

    // Ustaw ten adres jako domyślny
    const address = await prisma.address.update({
      where: { id: addressId },
      data: { isDefault: true },
    });

    res.json({ 
      message: 'Adres ustawiony jako domyślny',
      address,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
