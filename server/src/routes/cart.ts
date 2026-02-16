import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { addToCartSchema, updateCartItemSchema } from '../lib/validators.js';
import { optionalAuth } from '../middleware/auth.js';
import { createError } from '../middleware/errorHandler.js';

const router = Router();

// Helper: Pobierz lub utwórz koszyk
async function getOrCreateCart(userId?: string, sessionId?: string) {
  if (!userId && !sessionId) {
    throw createError('Wymagany userId lub sessionId', 400, 'CART_ID_REQUIRED');
  }

  // Szukaj istniejącego koszyka
  let cart = await prisma.cart.findFirst({
    where: userId ? { userId } : { sessionId },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: { orderBy: { position: 'asc' }, take: 1 },
            },
          },
        },
      },
    },
  });

  // Jeśli użytkownik ma koszyk sesyjny, połącz go z kontem
  if (userId && sessionId && !cart) {
    const sessionCart = await prisma.cart.findUnique({
      where: { sessionId },
    });

    if (sessionCart) {
      cart = await prisma.cart.update({
        where: { id: sessionCart.id },
        data: { userId, sessionId: null },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: { orderBy: { position: 'asc' }, take: 1 },
                },
              },
            },
          },
        },
      });
    }
  }

  // Utwórz nowy koszyk jeśli nie istnieje
  if (!cart) {
    cart = await prisma.cart.create({
      data: userId ? { userId } : { sessionId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { orderBy: { position: 'asc' }, take: 1 },
              },
            },
          },
        },
      },
    });
  }

  return cart;
}

// Format cart response
function formatCartResponse(cart: any) {
  if (!cart) {
    return {
      id: null,
      items: [],
      subtotal: 0,
      itemCount: 0,
    };
  }
  const items = cart.items
    .filter((item: any) => item.product.isActive)
    .map((item: any) => ({
      id: item.id,
      productId: item.productId,
      name: item.product.name,
      price: Number(item.product.price),
      quantity: item.quantity,
      image: item.product.images[0]?.url || null,
      stock: item.product.stock,
    }));

  const subtotal = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum: number, item: any) => sum + item.quantity, 0);

  return {
    id: cart.id,
    items,
    subtotal,
    itemCount,
  };
}

// GET /api/cart - Pobierz koszyk
router.get('/', optionalAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    const sessionId = req.sessionId;

    if (!userId && !sessionId) {
      res.json({ id: null, items: [], subtotal: 0, itemCount: 0 });
      return;
    }

    const cart = await getOrCreateCart(userId, sessionId);
    res.json(formatCartResponse(cart));
  } catch (error) {
    next(error);
  }
});

// POST /api/cart/items - Dodaj do koszyka
router.post('/items', optionalAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = addToCartSchema.parse(req.body);
    const userId = req.user?.userId;
    const sessionId = req.sessionId;

    // Sprawdź produkt
    const product = await prisma.product.findUnique({
      where: { id: data.productId },
    });

    if (!product || !product.isActive) {
      throw createError('Produkt nie znaleziony', 404, 'PRODUCT_NOT_FOUND');
    }

    if (product.stock < data.quantity) {
      throw createError('Niewystarczająca ilość w magazynie', 400, 'INSUFFICIENT_STOCK');
    }

    const cart = await getOrCreateCart(userId, sessionId);

    // Sprawdź czy produkt już jest w koszyku
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: data.productId,
        },
      },
    });

    if (existingItem) {
      // Aktualizuj ilość
      const newQuantity = existingItem.quantity + data.quantity;

      if (product.stock < newQuantity) {
        throw createError('Niewystarczająca ilość w magazynie', 400, 'INSUFFICIENT_STOCK');
      }

      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      // Dodaj nowy item
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: data.productId,
          quantity: data.quantity,
        },
      });
    }

    // Pobierz zaktualizowany koszyk
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { orderBy: { position: 'asc' }, take: 1 },
              },
            },
          },
        },
      },
    });

    res.json(formatCartResponse(updatedCart));
  } catch (error) {
    next(error);
  }
});

// PUT /api/cart/items/:productId - Aktualizuj ilość
router.put('/items/:productId', optionalAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;
    const data = updateCartItemSchema.parse(req.body);
    const userId = req.user?.userId;
    const sessionId = req.sessionId;

    const cart = await getOrCreateCart(userId, sessionId);

    const cartItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
      include: { product: true },
    });

    if (!cartItem) {
      throw createError('Produkt nie znaleziony w koszyku', 404, 'CART_ITEM_NOT_FOUND');
    }

    if (data.quantity === 0) {
      // Usuń z koszyka
      await prisma.cartItem.delete({
        where: { id: cartItem.id },
      });
    } else {
      // Sprawdź dostępność
      if (cartItem.product.stock < data.quantity) {
        throw createError('Niewystarczająca ilość w magazynie', 400, 'INSUFFICIENT_STOCK');
      }

      await prisma.cartItem.update({
        where: { id: cartItem.id },
        data: { quantity: data.quantity },
      });
    }

    // Pobierz zaktualizowany koszyk
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { orderBy: { position: 'asc' }, take: 1 },
              },
            },
          },
        },
      },
    });

    res.json(formatCartResponse(updatedCart));
  } catch (error) {
    next(error);
  }
});

// DELETE /api/cart/items/:productId - Usuń z koszyka
router.delete('/items/:productId', optionalAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;
    const userId = req.user?.userId;
    const sessionId = req.sessionId;

    const cart = await getOrCreateCart(userId, sessionId);

    await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    // Pobierz zaktualizowany koszyk
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { orderBy: { position: 'asc' }, take: 1 },
              },
            },
          },
        },
      },
    });

    res.json(formatCartResponse(updatedCart));
  } catch (error) {
    next(error);
  }
});

// DELETE /api/cart - Wyczyść koszyk
router.delete('/', optionalAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    const sessionId = req.sessionId;

    const cart = await prisma.cart.findFirst({
      where: userId ? { userId } : { sessionId },
    });

    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }

    res.json({ id: cart?.id || null, items: [], subtotal: 0, itemCount: 0 });
  } catch (error) {
    next(error);
  }
});

// PUT /api/cart/sync - Synchronizuj cały koszyk (zastąp wszystkie produkty)
router.put('/sync', optionalAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { items } = req.body; // Array of { productId, quantity, size? }
    const userId = req.user?.userId;
    const sessionId = req.sessionId;

    if (!Array.isArray(items)) {
      throw createError('Nieprawidłowe dane koszyka', 400, 'INVALID_CART_DATA');
    }

    // Pobierz lub utwórz koszyk
    const cart = await getOrCreateCart(userId, sessionId);

    // Wyczyść obecny koszyk
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    // Dodaj wszystkie produkty
    for (const item of items) {
      if (!item.productId || !item.quantity || item.quantity <= 0) {
        continue;
      }

      // Sprawdź czy produkt istnieje
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (product && product.isActive) {
        await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId: item.productId,
            quantity: Math.min(item.quantity, product.stock), // Max dostępna ilość
          },
        });
      }
    }

    // Pobierz zaktualizowany koszyk
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { orderBy: { position: 'asc' }, take: 1 },
              },
            },
          },
        },
      },
    });

    res.json(formatCartResponse(updatedCart));
  } catch (error) {
    next(error);
  }
});

export { router as cartRouter };
