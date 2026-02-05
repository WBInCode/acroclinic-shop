import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticate, adminOnly } from '../middleware/auth.js';
import { adminProductSchema } from '../lib/validators.js';
import { createError } from '../middleware/errorHandler.js';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticate, adminOnly);

// ==================== DASHBOARD ====================

// GET /api/admin/dashboard - Statystyki
router.get('/dashboard', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [
      totalProducts,
      totalOrders,
      totalUsers,
      monthlyRevenue,
      lastMonthRevenue,
      recentOrders,
      lowStockProducts,
    ] = await Promise.all([
      prisma.product.count({ where: { isActive: true } }),
      prisma.order.count(),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.order.aggregate({
        where: {
          createdAt: { gte: startOfMonth },
          paymentStatus: 'COMPLETED',
        },
        _sum: { total: true },
      }),
      prisma.order.aggregate({
        where: {
          createdAt: { gte: startOfLastMonth, lt: startOfMonth },
          paymentStatus: 'COMPLETED',
        },
        _sum: { total: true },
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          orderNumber: true,
          total: true,
          status: true,
          paymentStatus: true,
          createdAt: true,
        },
      }),
      prisma.product.findMany({
        where: {
          isActive: true,
          stock: { lte: 10 },
        },
        select: {
          id: true,
          name: true,
          stock: true,
        },
        orderBy: { stock: 'asc' },
        take: 5,
      }),
    ]);

    const currentRevenue = Number(monthlyRevenue._sum.total || 0);
    const previousRevenue = Number(lastMonthRevenue._sum.total || 0);
    const revenueChange = previousRevenue > 0 
      ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 
      : 0;

    res.json({
      stats: {
        totalProducts,
        totalOrders,
        totalUsers,
        monthlyRevenue: currentRevenue,
        revenueChange: Math.round(revenueChange * 100) / 100,
      },
      recentOrders: recentOrders.map((o) => ({
        ...o,
        total: Number(o.total),
      })),
      lowStockProducts,
    });
  } catch (error) {
    next(error);
  }
});

// ==================== PRODUCTS ====================

// GET /api/admin/products - Lista produktów (admin)
router.get('/products', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search, category, page = '1', limit = '20' } = req.query;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { sku: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.categoryId = category;
    }

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: parseInt(limit as string),
        include: {
          category: { select: { name: true } },
          images: { take: 1, orderBy: { position: 'asc' } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      products: products.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        sku: p.sku,
        price: Number(p.price),
        stock: p.stock,
        isActive: p.isActive,
        isBestseller: p.isBestseller,
        badge: p.badge,
        category: p.category?.name,
        image: p.images[0]?.url,
      })),
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        totalPages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/products - Utwórz produkt
router.post('/products', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = adminProductSchema.parse(req.body);
    const { images, ...productData } = data;

    const product = await prisma.product.create({
      data: {
        ...productData,
        images: images
          ? {
              create: images.map((img, index) => ({
                url: img.url,
                alt: img.alt,
                isMain: img.isMain ?? index === 0,
                position: img.position ?? index,
              })),
            }
          : undefined,
      },
      include: {
        images: true,
        category: true,
      },
    });

    res.status(201).json({ product });
  } catch (error) {
    next(error);
  }
});

// PUT /api/admin/products/:id - Aktualizuj produkt
router.put('/products/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = adminProductSchema.partial().parse(req.body);
    const { images, ...productData } = data;

    // Update product
    const product = await prisma.product.update({
      where: { id },
      data: productData,
    });

    // Update images if provided
    if (images) {
      await prisma.productImage.deleteMany({ where: { productId: id } });
      await prisma.productImage.createMany({
        data: images.map((img, index) => ({
          productId: id,
          url: img.url,
          alt: img.alt,
          isMain: img.isMain ?? index === 0,
          position: img.position ?? index,
        })),
      });
    }

    const updatedProduct = await prisma.product.findUnique({
      where: { id },
      include: { images: true, category: true },
    });

    res.json({ product: updatedProduct });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/admin/products/:id - Usuń produkt
router.delete('/products/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Soft delete - just deactivate
    await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });

    res.json({ message: 'Produkt został dezaktywowany' });
  } catch (error) {
    next(error);
  }
});

// ==================== ORDERS ====================

// GET /api/admin/orders - Lista zamówień
router.get('/orders', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, paymentStatus, search, page = '1', limit = '100' } = req.query;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (paymentStatus) {
      where.paymentStatus = paymentStatus;
    }

    if (search) {
      where.OR = [
        { orderNumber: { contains: search as string, mode: 'insensitive' } },
        { shippingFirstName: { contains: search as string, mode: 'insensitive' } },
        { shippingLastName: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: parseInt(limit as string),
        include: {
          user: { select: { email: true } },
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
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where }),
    ]);

    res.json({
      orders: orders.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        status: o.status,
        paymentStatus: o.paymentStatus,
        total: Number(o.total),
        subtotal: Number(o.subtotal),
        shippingCost: Number(o.shippingCost),
        itemCount: o.items.reduce((sum, item) => sum + item.quantity, 0),
        createdAt: o.createdAt,
        shippingFirstName: o.shippingFirstName,
        shippingLastName: o.shippingLastName,
        shippingEmail: o.guestEmail || o.user?.email || null,
        shippingPhone: o.shippingPhone,
        shippingStreet: o.shippingStreet,
        shippingCity: o.shippingCity,
        shippingPostalCode: o.shippingPostalCode,
        // Dane do faktury
        wantInvoice: o.wantInvoice,
        billingCompanyName: o.billingCompanyName,
        billingNip: o.billingNip,
        billingFirstName: o.billingFirstName,
        billingLastName: o.billingLastName,
        billingStreet: o.billingStreet,
        billingCity: o.billingCity,
        billingPostalCode: o.billingPostalCode,
        billingEmail: o.billingEmail,
        items: o.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: Number(item.price),
          quantity: item.quantity,
          image: item.product?.images?.[0]?.url || null,
        })),
      })),
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        totalPages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/admin/orders/:id/status - Zmień status zamówienia
router.put('/orders/:id/status', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'];
    
    if (!validStatuses.includes(status)) {
      throw createError('Nieprawidłowy status', 400, 'INVALID_STATUS');
    }

    const updateData: any = { status };

    if (status === 'SHIPPED') {
      updateData.shippedAt = new Date();
    } else if (status === 'DELIVERED') {
      updateData.deliveredAt = new Date();
    }

    const order = await prisma.order.update({
      where: { id },
      data: updateData,
    });

    res.json({ 
      message: 'Status zamówienia został zaktualizowany',
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
      },
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/admin/orders/:id/status - Zmień status zamówienia (alias)
router.patch('/orders/:id/status', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'];
    
    if (!validStatuses.includes(status)) {
      throw createError('Nieprawidłowy status', 400, 'INVALID_STATUS');
    }

    const updateData: any = { status };

    if (status === 'SHIPPED') {
      updateData.shippedAt = new Date();
    } else if (status === 'DELIVERED') {
      updateData.deliveredAt = new Date();
    }

    const order = await prisma.order.update({
      where: { id },
      data: updateData,
    });

    res.json({ 
      message: 'Status zamówienia został zaktualizowany',
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
      },
    });
  } catch (error) {
    next(error);
  }
});

// ==================== USERS ====================

// GET /api/admin/users - Lista użytkowników
router.get('/users', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search, role, page = '1', limit = '20' } = req.query;

    const where: any = {};

    if (search) {
      where.OR = [
        { email: { contains: search as string, mode: 'insensitive' } },
        { firstName: { contains: search as string, mode: 'insensitive' } },
        { lastName: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    if (role) {
      where.role = role;
    }

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: parseInt(limit as string),
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          createdAt: true,
          _count: { select: { orders: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      users: users.map((u) => ({
        ...u,
        orderCount: u._count.orders,
      })),
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        totalPages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/admin/users/:id/status - Aktywuj/Dezaktywuj użytkownika
router.put('/users/:id/status', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const user = await prisma.user.update({
      where: { id },
      data: { isActive },
      select: {
        id: true,
        email: true,
        isActive: true,
      },
    });

    res.json({
      message: isActive ? 'Użytkownik aktywowany' : 'Użytkownik dezaktywowany',
      user,
    });
  } catch (error) {
    next(error);
  }
});

// ==================== CATEGORIES ====================

// GET /api/admin/categories
router.get('/categories', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { position: 'asc' },
      include: {
        _count: { select: { products: true } },
      },
    });

    res.json({
      categories: categories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description,
        image: c.image,
        position: c.position,
        isActive: c.isActive,
        productCount: c._count.products,
      })),
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/categories
router.post('/categories', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, slug, description, image, position, isActive } = req.body;

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        image,
        position: position || 0,
        isActive: isActive ?? true,
      },
    });

    res.status(201).json({ category });
  } catch (error) {
    next(error);
  }
});

// PUT /api/admin/categories/:id
router.put('/categories/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, slug, description, image, position, isActive } = req.body;

    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        image,
        position,
        isActive,
      },
    });

    res.json({ category });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/admin/categories/:id
router.delete('/categories/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Check if category has products
    const productsCount = await prisma.product.count({
      where: { categoryId: id },
    });

    if (productsCount > 0) {
      throw createError(
        'Nie można usunąć kategorii z produktami. Najpierw przenieś produkty.',
        400,
        'CATEGORY_HAS_PRODUCTS'
      );
    }

    await prisma.category.delete({ where: { id } });

    res.json({ message: 'Kategoria została usunięta' });
  } catch (error) {
    next(error);
  }
});

// ==================== SETTINGS ====================

// GET /api/admin/settings
router.get('/settings', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const settings = await prisma.setting.findMany();

    const settingsObject = settings.reduce((acc: any, s) => {
      acc[s.key] = s.value;
      return acc;
    }, {});

    res.json({ settings: settingsObject });
  } catch (error) {
    next(error);
  }
});

// PUT /api/admin/settings/:key
router.put('/settings/:key', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    const setting = await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });

    res.json({ setting });
  } catch (error) {
    next(error);
  }
});

export { router as adminRouter };
