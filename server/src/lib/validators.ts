import { z } from 'zod';

// Auth schemas
export const registerSchema = z.object({
  email: z.string().email('Nieprawidłowy adres email'),
  password: z
    .string()
    .min(8, 'Hasło musi mieć minimum 8 znaków')
    .regex(/[A-Z]/, 'Hasło musi zawierać wielką literę')
    .regex(/[0-9]/, 'Hasło musi zawierać cyfrę'),
  firstName: z.string().min(2, 'Imię musi mieć minimum 2 znaki').optional(),
  lastName: z.string().min(2, 'Nazwisko musi mieć minimum 2 znaki').optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Nieprawidłowy adres email'),
  password: z.string().min(1, 'Hasło jest wymagane'),
});

// Product schemas
export const productQuerySchema = z.object({
  category: z.string().optional(),
  search: z.string().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  sortBy: z.enum(['price', 'name', 'createdAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  bestsellers: z.coerce.boolean().optional(),
});

// Cart schemas
export const addToCartSchema = z.object({
  productId: z.string().min(1, 'ID produktu jest wymagane'),
  quantity: z.number().int().min(1, 'Ilość musi być większa od 0').default(1),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(0, 'Ilość nie może być ujemna'),
});

// Address schema
export const addressSchema = z.object({
  firstName: z.string().min(2, 'Imię musi mieć minimum 2 znaki'),
  lastName: z.string().min(2, 'Nazwisko musi mieć minimum 2 znaki'),
  street: z.string().min(3, 'Adres jest wymagany'),
  city: z.string().min(2, 'Miasto jest wymagane'),
  postalCode: z.string().regex(/^\d{2}-\d{3}$/, 'Nieprawidłowy kod pocztowy (format: XX-XXX)'),
  country: z.string().default('Polska'),
  phone: z.string().optional(),
});

// Order schemas
export const createOrderSchema = z.object({
  shippingAddress: addressSchema,
  note: z.string().optional(),
});

// Wishlist schema
export const wishlistItemSchema = z.object({
  productId: z.string().min(1, 'ID produktu jest wymagane'),
});

// Admin product schema
export const adminProductSchema = z.object({
  name: z.string().min(2, 'Nazwa musi mieć minimum 2 znaki'),
  slug: z.string().min(2, 'Slug jest wymagany'),
  description: z.string().optional(),
  price: z.number().min(0, 'Cena musi być większa od 0'),
  comparePrice: z.number().min(0).optional().nullable(),
  sku: z.string().optional().nullable(),
  stock: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
  isBestseller: z.boolean().default(false),
  badge: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  images: z.array(z.object({
    url: z.string().url(),
    alt: z.string().optional(),
    isMain: z.boolean().optional(),
    position: z.number().int().optional(),
  })).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ProductQueryInput = z.infer<typeof productQuerySchema>;
export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type WishlistItemInput = z.infer<typeof wishlistItemSchema>;
export type AdminProductInput = z.infer<typeof adminProductSchema>;
