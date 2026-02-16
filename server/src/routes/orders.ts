import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { createOrderSchema } from '../lib/validators.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { createError } from '../middleware/errorHandler.js';

const router = Router();

// Helper: generuj numer zamówienia
function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `AC${year}${month}${day}-${random}`;
}

// GET /api/orders/config/shipping - Pobierz koszt wysyłki
router.get('/config/shipping', (req: Request, res: Response) => {
  res.json({
    cost: 19.90,
    currency: 'PLN'
  });
});

// GET /api/orders - Lista zamówień użytkownika
router.get('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user!.userId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { take: 1 },
              },
            },
          },
        },
      },
    });

    res.json({
      orders: orders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        paymentStatus: order.paymentStatus,
        total: Number(order.total),
        itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
        createdAt: order.createdAt,
        items: order.items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: Number(item.price),
          image: item.product.images[0]?.url || null,
        })),
      })),
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/orders/:id - Szczegóły zamówienia
router.get('/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }],
        userId: req.user!.userId,
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { take: 1 },
              },
            },
          },
        },
        payments: true,
      },
    });

    if (!order) {
      throw createError('Zamówienie nie znalezione', 404, 'ORDER_NOT_FOUND');
    }

    res.json({
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        shippingAddress: {
          firstName: order.shippingFirstName,
          lastName: order.shippingLastName,
          street: order.shippingStreet,
          city: order.shippingCity,
          postalCode: order.shippingPostalCode,
          country: order.shippingCountry,
          phone: order.shippingPhone,
        },
        subtotal: Number(order.subtotal),
        shippingCost: Number(order.shippingCost),
        discount: Number(order.discount),
        total: Number(order.total),
        note: order.note,
        createdAt: order.createdAt,
        paidAt: order.paidAt,
        shippedAt: order.shippedAt,
        deliveredAt: order.deliveredAt,
        items: order.items.map((item) => ({
          id: item.id,
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          price: Number(item.price),
          image: item.product.images[0]?.url || null,
        })),
        payments: order.payments.map((p) => ({
          id: p.id,
          amount: Number(p.amount),
          status: p.status,
          method: p.method,
          createdAt: p.createdAt,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/orders - Utwórz zamówienie
router.post('/', optionalAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = createOrderSchema.parse(req.body);
    const userId = req.user?.userId;
    const sessionId = req.sessionId;

    // Pobierz koszyk
    const cart = await prisma.cart.findFirst({
      where: userId ? { userId } : { sessionId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw createError('Koszyk jest pusty', 400, 'EMPTY_CART');
    }

    // Oblicz kwoty
    const subtotal = cart.items.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    );

    // Stały koszt wysyłki 19.90 PLN (brak darmowej dostawy logic)
    const shippingCost = 19.90;
    const total = subtotal + shippingCost;

    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
      try {
        const orderNumber = generateOrderNumber();

        // Utwórz zamówienie w transakcji
        const order = await prisma.$transaction(async (tx) => {
          // Check uniqueness of orderNumber
          const existingOrder = await tx.order.findUnique({ where: { orderNumber } });
          if (existingOrder) {
            throw new Error('ORDER_NUMBER_COLLISION');
          }

          // Walidacja stocku WEWNĄTRZ transakcji (Race condition fix)
          for (const item of cart.items) {
            const product = await tx.product.findUnique({ where: { id: item.productId } });

            if (!product || !product.isActive) {
              throw createError(`Produkt "${item.product.name}" nie jest już dostępny`, 400, 'PRODUCT_UNAVAILABLE');
            }

            if (product.stock < item.quantity) {
              throw createError(
                `Niewystarczająca ilość produktu "${product.name}" (dostępne: ${product.stock})`,
                400,
                'INSUFFICIENT_STOCK'
              );
            }
          }

          // Pobierz kategorie produktów w koszyku
          const productsWithCategories = await tx.product.findMany({
            where: { id: { in: cart.items.map(i => i.productId) } },
            include: { category: true },
          });

          const productCategoryMap = new Map(
            productsWithCategories.map(p => [p.id, p.category?.slug || 'unknown'])
          );

          // Określ shipmentType
          const hasClothing = cart.items.some(i => productCategoryMap.get(i.productId) === 'clothing');
          const hasAccessories = cart.items.some(i => productCategoryMap.get(i.productId) !== 'clothing');
          const isMixed = hasClothing && hasAccessories;

          // Jeśli nie jest mieszane, wymuś STANDARD
          const finalShipmentType = isMixed ? (data.shipmentType || 'STANDARD') : 'STANDARD';

          // Utwórz zamówienie
          const newOrder = await tx.order.create({
            data: {
              orderNumber,
              userId,
              guestEmail: userId ? null : data.email, // Zapisz email tylko dla gości
              status: 'PENDING',
              paymentStatus: 'PENDING',
              shipmentType: finalShipmentType,
              shippingFirstName: data.shippingAddress.firstName,
              shippingLastName: data.shippingAddress.lastName,
              shippingStreet: data.shippingAddress.street,
              shippingCity: data.shippingAddress.city,
              shippingPostalCode: data.shippingAddress.postalCode,
              shippingCountry: data.shippingAddress.country,
              shippingPhone: data.shippingAddress.phone,
              // Dane do faktury
              wantInvoice: data.wantInvoice || false,
              billingCompanyName: data.billingAddress?.companyName || null,
              billingNip: data.billingAddress?.nip || null,
              billingFirstName: data.billingAddress?.firstName || null,
              billingLastName: data.billingAddress?.lastName || null,
              billingStreet: data.billingAddress?.street || null,
              billingCity: data.billingAddress?.city || null,
              billingPostalCode: data.billingAddress?.postalCode || null,
              billingEmail: data.billingAddress?.email || null,
              subtotal,
              shippingCost,
              discount: 0,
              total,
              note: data.note,
              items: {
                create: cart.items.map((item) => ({
                  productId: item.productId,
                  quantity: item.quantity,
                  price: item.product.price,
                  name: item.product.name,
                })),
              },
            },
            include: {
              items: true,
            },
          });

          // Zmniejsz stan magazynowy
          for (const item of cart.items) {
            await tx.product.update({
              where: { id: item.productId },
              data: {
                stock: { decrement: item.quantity },
              },
            });
          }

          // Wyczyść koszyk
          await tx.cartItem.deleteMany({
            where: { cartId: cart.id },
          });

          // Create receipts logic (kept assuming existing logic was correct in context of transaction)
          if (finalShipmentType === 'SPLIT') {
            await tx.receipt.createMany({
              data: [
                { orderId: newOrder.id, type: 'accessories', status: 'PENDING' },
                { orderId: newOrder.id, type: 'clothing', status: 'PENDING' },
              ],
            });
          } else {
            await tx.receipt.create({
              data: { orderId: newOrder.id, type: 'full', status: 'PENDING' },
            });
          }

          return newOrder;
        });

        res.status(201).json({
          message: 'Zamówienie zostało utworzone',
          order: {
            id: order.id,
            orderNumber: order.orderNumber,
            total: Number(order.total),
            status: order.status,
            paymentStatus: order.paymentStatus,
          },
        });
        return; // Success, exit loop
      } catch (error: any) {
        if (error.message === 'ORDER_NUMBER_COLLISION') {
          attempts++;
          continue; // Retry
        }
        throw error; // Other errors (stock, db, etc) - propagate
      }
    }

    throw createError('Nie udało się wygenerować numeru zamówienia', 500, 'ORDER_CREATION_FAILED');

  } catch (error) {
    next(error);
  }
});

// POST /api/orders/:id/cancel - Anuluj zamówienie
router.post('/:id/cancel', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }],
        userId: req.user!.userId,
      },
      include: { items: true },
    });

    if (!order) {
      throw createError('Zamówienie nie znalezione', 404, 'ORDER_NOT_FOUND');
    }

    if (!['PENDING', 'CONFIRMED'].includes(order.status)) {
      throw createError('Nie można anulować zamówienia w tym statusie', 400, 'CANNOT_CANCEL');
    }

    // Anuluj zamówienie i przywróć stan magazynowy
    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: order.id },
        data: {
          status: 'CANCELLED',
          paymentStatus: order.paymentStatus === 'COMPLETED' ? 'REFUNDED' : 'CANCELLED',
        },
      });

      // Przywróć stan magazynowy
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { increment: item.quantity },
          },
        });
      }
    });

    res.json({ message: 'Zamówienie zostało anulowane' });
  } catch (error) {
    next(error);
  }
});

export { router as ordersRouter };
