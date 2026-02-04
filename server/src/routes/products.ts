import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { productQuerySchema } from '../lib/validators.js';
import { createError } from '../middleware/errorHandler.js';

const router = Router();

// GET /api/products - Lista produktów
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = productQuerySchema.parse(req.query);
    const { category, search, minPrice, maxPrice, sortBy, sortOrder, page, limit, bestsellers } = query;

    // Build where clause
    const where: any = {
      isActive: true,
    };

    if (category) {
      where.category = { slug: category };
    }

    if (bestsellers) {
      where.isBestseller = true;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    // Build order by
    const orderBy: any = {};
    if (sortBy) {
      orderBy[sortBy] = sortOrder || 'asc';
    } else {
      orderBy.createdAt = 'desc';
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute queries
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
          images: {
            orderBy: { position: 'asc' },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      products: products.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        features: p.features || [],
        materials: p.materials,
        price: Number(p.price),
        comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
        stock: p.stock,
        sizes: p.sizes || [],
        isBestseller: p.isBestseller,
        badge: p.badge,
        category: p.category,
        image: p.images.find((i) => i.isMain)?.url || p.images[0]?.url || null,
        images: p.images.map((i) => i.url),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/products/categories - Lista kategorii
router.get('/categories', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { position: 'asc' },
      include: {
        _count: {
          select: { products: { where: { isActive: true } } },
        },
      },
    });

    res.json({
      categories: categories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description,
        image: c.image,
        productCount: c._count.products,
      })),
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/products/bestsellers - Bestsellery
router.get('/bestsellers', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        isBestseller: true,
      },
      take: 8,
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        images: {
          orderBy: { position: 'asc' },
        },
      },
    });

    res.json({
      products: products.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: Number(p.price),
        comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
        isBestseller: p.isBestseller,
        badge: p.badge,
        category: p.category,
        image: p.images.find((i) => i.isMain)?.url || p.images[0]?.url || null,
        images: p.images.map((i) => i.url),
      })),
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/products/:slug - Szczegóły produktu
router.get('/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;

    const product = await prisma.product.findFirst({
      where: {
        OR: [{ slug }, { id: slug }],
        isActive: true,
      },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        images: {
          orderBy: { position: 'asc' },
        },
      },
    });

    if (!product) {
      throw createError('Produkt nie znaleziony', 404, 'PRODUCT_NOT_FOUND');
    }

    res.json({
      product: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: Number(product.price),
        comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
        sku: product.sku,
        stock: product.stock,
        isBestseller: product.isBestseller,
        badge: product.badge,
        category: product.category,
        image: product.images.find((i) => i.isMain)?.url || product.images[0]?.url || null,
        images: product.images.map((i) => ({
          url: i.url,
          alt: i.alt,
          isMain: i.isMain,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
});

export { router as productsRouter };
