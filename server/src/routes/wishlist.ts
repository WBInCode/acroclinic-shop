import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { wishlistItemSchema } from '../lib/validators.js';
import { authenticate } from '../middleware/auth.js';
import { createError } from '../middleware/errorHandler.js';

const router = Router();

// GET /api/wishlist - Lista życzeń
router.get('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { userId: req.user!.userId },
      include: {
        product: {
          include: {
            images: {
              orderBy: { position: 'asc' },
              take: 1,
            },
            category: {
              select: { name: true, slug: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      items: wishlistItems
        .filter((item) => item.product.isActive)
        .map((item) => ({
          id: item.id,
          productId: item.productId,
          product: {
            id: item.product.id,
            name: item.product.name,
            slug: item.product.slug,
            price: Number(item.product.price),
            comparePrice: item.product.comparePrice ? Number(item.product.comparePrice) : null,
            image: item.product.images[0]?.url || null,
            category: item.product.category,
            badge: item.product.badge,
            stock: item.product.stock,
          },
          addedAt: item.createdAt,
        })),
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/wishlist - Dodaj do listy życzeń
router.post('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = wishlistItemSchema.parse(req.body);

    // Sprawdź czy produkt istnieje
    const product = await prisma.product.findUnique({
      where: { id: data.productId },
    });

    if (!product || !product.isActive) {
      throw createError('Produkt nie znaleziony', 404, 'PRODUCT_NOT_FOUND');
    }

    // Sprawdź czy już jest na liście
    const existingItem = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: req.user!.userId,
          productId: data.productId,
        },
      },
    });

    if (existingItem) {
      res.json({
        message: 'Produkt jest już na liście życzeń',
        item: existingItem,
      });
      return;
    }

    // Dodaj do listy
    const item = await prisma.wishlistItem.create({
      data: {
        userId: req.user!.userId,
        productId: data.productId,
      },
      include: {
        product: {
          include: {
            images: { take: 1 },
          },
        },
      },
    });

    res.status(201).json({
      message: 'Dodano do listy życzeń',
      item: {
        id: item.id,
        productId: item.productId,
        product: {
          id: item.product.id,
          name: item.product.name,
          price: Number(item.product.price),
          image: item.product.images[0]?.url || null,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/wishlist/:productId - Usuń z listy życzeń
router.delete('/:productId', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;

    await prisma.wishlistItem.deleteMany({
      where: {
        userId: req.user!.userId,
        productId,
      },
    });

    res.json({ message: 'Usunięto z listy życzeń' });
  } catch (error) {
    next(error);
  }
});

// POST /api/wishlist/:productId/toggle - Toggle (dodaj/usuń)
router.post('/:productId/toggle', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;

    const existingItem = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: req.user!.userId,
          productId,
        },
      },
    });

    if (existingItem) {
      await prisma.wishlistItem.delete({
        where: { id: existingItem.id },
      });
      res.json({ inWishlist: false, message: 'Usunięto z listy życzeń' });
    } else {
      // Sprawdź czy produkt istnieje
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product || !product.isActive) {
        throw createError('Produkt nie znaleziony', 404, 'PRODUCT_NOT_FOUND');
      }

      await prisma.wishlistItem.create({
        data: {
          userId: req.user!.userId,
          productId,
        },
      });
      res.json({ inWishlist: true, message: 'Dodano do listy życzeń' });
    }
  } catch (error) {
    next(error);
  }
});

// GET /api/wishlist/check/:productId - Sprawdź czy produkt jest na liście
router.get('/check/:productId', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;

    const item = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: req.user!.userId,
          productId,
        },
      },
    });

    res.json({ inWishlist: !!item });
  } catch (error) {
    next(error);
  }
});

export { router as wishlistRouter };
