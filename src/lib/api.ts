// API Client for Acro Clinic Shop
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Token management
let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
  if (token) {
    localStorage.setItem('accessToken', token);
  } else {
    localStorage.removeItem('accessToken');
  }
}

export function getAccessToken(): string | null {
  if (!accessToken) {
    accessToken = localStorage.getItem('accessToken');
  }
  return accessToken;
}

// Session ID for guest users
function getSessionId(): string | null {
  return localStorage.getItem('sessionId');
}

function setSessionId(id: string) {
  localStorage.setItem('sessionId', id);
}

// Base fetch with auth
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = getAccessToken();
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const sessionId = getSessionId();
  if (sessionId) {
    (headers as Record<string, string>)['X-Session-ID'] = sessionId;
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  // Handle token refresh on 401
  if (response.status === 401 && token) {
    const refreshed = await refreshToken();
    if (refreshed) {
      // Retry with new token
      (headers as Record<string, string>)['Authorization'] = `Bearer ${getAccessToken()}`;
      const retryResponse = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',
      });

      if (!retryResponse.ok) {
        const error = await retryResponse.json().catch(() => ({}));
        throw new ApiError(error.error || 'Request failed', retryResponse.status, error.code);
      }

      return retryResponse.json();
    } else {
      // Logout user
      setAccessToken(null);
      window.dispatchEvent(new CustomEvent('auth:logout'));
      throw new ApiError('Sesja wygasła', 401, 'SESSION_EXPIRED');
    }
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new ApiError(error.error || 'Request failed', response.status, error.code);
  }

  return response.json();
}

// Custom error class
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Token refresh
async function refreshToken(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      setAccessToken(data.accessToken);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

// ==================== AUTH API ====================

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role: 'CUSTOMER' | 'ADMIN';
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  message?: string;
}

export const authApi = {
  async register(data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }): Promise<AuthResponse> {
    const result = await apiFetch<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    setAccessToken(result.accessToken);
    return result;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const result = await apiFetch<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setAccessToken(result.accessToken);
    return result;
  },

  async logout(): Promise<void> {
    await apiFetch('/auth/logout', { method: 'POST' });
    setAccessToken(null);
  },

  async getMe(): Promise<{ user: User }> {
    return apiFetch('/auth/me');
  },

  async updateProfile(data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
  }): Promise<{ user: User }> {
    return apiFetch('/auth/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    return apiFetch('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    return apiFetch('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async resetPassword(token: string, password: string): Promise<{ message: string }> {
    return apiFetch('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
  },

  async getSession(): Promise<{ sessionId: string }> {
    const result = await apiFetch<{ sessionId: string }>('/auth/session');
    setSessionId(result.sessionId);
    return result;
  },
};

// ==================== PRODUCTS API ====================

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  comparePrice?: number | null;
  stock: number;
  isBestseller: boolean;
  badge?: string | null;
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  image: string | null;
  images: string[];
}

export interface ProductsResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  productCount: number;
}

export const productsApi = {
  async getProducts(params?: {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: 'price' | 'name' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
    bestsellers?: boolean;
  }): Promise<ProductsResponse> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.set(key, String(value));
        }
      });
    }
    const query = searchParams.toString();
    return apiFetch(`/products${query ? `?${query}` : ''}`);
  },

  async getProduct(slug: string): Promise<{ product: Product }> {
    return apiFetch(`/products/${slug}`);
  },

  async getBestsellers(): Promise<{ products: Product[] }> {
    return apiFetch('/products/bestsellers');
  },

  async getCategories(): Promise<{ categories: Category[] }> {
    return apiFetch('/products/categories');
  },
};

// ==================== CART API ====================

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string | null;
  stock: number;
}

export interface Cart {
  id: string | null;
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}

export const cartApi = {
  async getCart(): Promise<Cart> {
    return apiFetch('/cart');
  },

  async addToCart(productId: string, quantity: number = 1): Promise<Cart> {
    return apiFetch('/cart/items', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  },

  async updateQuantity(productId: string, quantity: number): Promise<Cart> {
    return apiFetch(`/cart/items/${productId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  },

  async removeFromCart(productId: string): Promise<Cart> {
    return apiFetch(`/cart/items/${productId}`, {
      method: 'DELETE',
    });
  },

  async clearCart(): Promise<Cart> {
    return apiFetch('/cart', {
      method: 'DELETE',
    });
  },
};

// ==================== ORDERS API ====================

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  postalCode: string;
  country?: string;
  phone?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  total: number;
  itemCount: number;
  createdAt: string;
  items: {
    name: string;
    quantity: number;
    price: number;
    image: string | null;
  }[];
}

export interface OrderDetails extends Order {
  paymentMethod?: string;
  shippingAddress: ShippingAddress;
  subtotal: number;
  shippingCost: number;
  discount: number;
  note?: string;
  paidAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
}

export const ordersApi = {
  async getOrders(): Promise<{ orders: Order[] }> {
    return apiFetch('/orders');
  },

  async getOrder(id: string): Promise<{ order: OrderDetails }> {
    return apiFetch(`/orders/${id}`);
  },

  async createOrder(data: {
    shippingAddress: ShippingAddress;
    note?: string;
  }): Promise<{ message: string; order: { id: string; orderNumber: string; total: number } }> {
    return apiFetch('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async cancelOrder(id: string): Promise<{ message: string }> {
    return apiFetch(`/orders/${id}/cancel`, {
      method: 'POST',
    });
  },
};

// ==================== PAYU API ====================

export const payuApi = {
  async createPayment(orderId: string): Promise<{ success: boolean; redirectUrl: string; payuOrderId: string }> {
    return apiFetch('/payu/create', {
      method: 'POST',
      body: JSON.stringify({ orderId }),
    });
  },

  async checkStatus(orderId: string): Promise<{ orderId: string; orderNumber: string; paymentStatus: string; total: number }> {
    return apiFetch(`/payu/status/${orderId}`);
  },
};

// ==================== WISHLIST API ====================

export interface WishlistItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice?: number | null;
    image: string | null;
    category?: { name: string; slug: string } | null;
    badge?: string | null;
    stock: number;
  };
  addedAt: string;
}

export const wishlistApi = {
  async getWishlist(): Promise<{ items: WishlistItem[] }> {
    return apiFetch('/wishlist');
  },

  async addToWishlist(productId: string): Promise<{ message: string; item: any }> {
    return apiFetch('/wishlist', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });
  },

  async removeFromWishlist(productId: string): Promise<{ message: string }> {
    return apiFetch(`/wishlist/${productId}`, {
      method: 'DELETE',
    });
  },

  async toggleWishlist(productId: string): Promise<{ inWishlist: boolean; message: string }> {
    return apiFetch(`/wishlist/${productId}/toggle`, {
      method: 'POST',
    });
  },

  async checkInWishlist(productId: string): Promise<{ inWishlist: boolean }> {
    return apiFetch(`/wishlist/check/${productId}`);
  },
};

// ==================== ADDRESSES API ====================

export type AddressType = 'SHIPPING' | 'BILLING';

export interface Address {
  id: string;
  type: AddressType;
  label?: string;
  firstName: string;
  lastName: string;
  companyName?: string;
  nip?: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
  email?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressData {
  type?: AddressType;
  label?: string;
  firstName: string;
  lastName: string;
  companyName?: string;
  nip?: string;
  street: string;
  city: string;
  postalCode: string;
  country?: string;
  phone?: string;
  email?: string;
  isDefault?: boolean;
}

export type UpdateAddressData = Partial<CreateAddressData>

export const addressApi = {
  async getAddresses(): Promise<{ addresses: Address[] }> {
    return apiFetch('/addresses');
  },

  async getAddressesByType(type: AddressType): Promise<{ addresses: Address[] }> {
    return apiFetch(`/addresses/type/${type.toLowerCase()}`);
  },

  async getAddress(id: string): Promise<{ address: Address }> {
    return apiFetch(`/addresses/${id}`);
  },

  async createAddress(data: CreateAddressData): Promise<{ message: string; address: Address }> {
    return apiFetch('/addresses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateAddress(id: string, data: UpdateAddressData): Promise<{ message: string; address: Address }> {
    return apiFetch(`/addresses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteAddress(id: string): Promise<{ message: string }> {
    return apiFetch(`/addresses/${id}`, {
      method: 'DELETE',
    });
  },

  async setDefaultAddress(id: string): Promise<{ message: string; address: Address }> {
    return apiFetch(`/addresses/${id}/set-default`, {
      method: 'POST',
    });
  },
};

// ==================== NEWSLETTER API ====================

export const newsletterApi = {
  async subscribe(email: string): Promise<{ success: boolean; message: string }> {
    return apiFetch('/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async getStatus(email: string): Promise<{ subscribed: boolean; status: string | null }> {
    return apiFetch(`/newsletter/status/${encodeURIComponent(email)}`);
  },

  async unsubscribe(email: string): Promise<{ success: boolean; message: string }> {
    return apiFetch('/newsletter/unsubscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
};

// Initialize session for guests
export async function initializeSession() {
  if (!getSessionId() && !getAccessToken()) {
    try {
      await authApi.getSession();
    } catch (e) {
      console.error('Failed to initialize session:', e);
    }
  }
}
