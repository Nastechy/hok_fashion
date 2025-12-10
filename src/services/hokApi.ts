import { apiRequest } from './apiClient';

export type SortOption = 'featured' | 'price-low' | 'price-high' | 'name' | 'newest';

export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrls: string[];
  videoUrls?: string[];
  productCode?: string;
  collectionType?: string;
  quantity?: number;
  description?: string;
  features?: string[];
  category?: string;
  isFeatured?: boolean;
  isAvailable?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  createdAt?: string;
  updatedAt?: string;
  variants?: Array<{
    id?: string;
    name?: string;
    priceDelta?: number;
    sku?: string;
    quantity?: number;
  }>;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

export interface ProductFilters {
  category?: string;
  search?: string;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isFeatured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sortOption?: SortOption;
  sortBy?: 'price' | 'name' | 'createdAt' | 'featured' | 'quantity';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  collectionType?: string;
  productCode?: string;
}

export interface CreateProductInput {
  name: string;
  price: number;
  productCode: string;
  quantity: number;
  category: string;
  description?: string;
  features?: string[];
  imageUrls?: string[];
  videoUrls?: string[];
  collectionType?: string;
  isFeatured?: boolean;
  isAvailable?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
}

export interface OrderItemInput {
  productId: string;
  quantity: number;
}

export interface CreateOrderInput {
  items: OrderItemInput[];
  shippingAddress?: string;
  note?: string;
  receiptFile?: File | null;
  customerEmail?: string;
  customerName?: string;
  customerPhone?: string;
}

export interface Order {
  id: string;
  status?: string;
  totalAmount?: number;
  customerEmail?: string;
  customerName?: string;
  customerPhone?: string;
  shippingAddress?: string;
  createdAt?: string;
  updatedAt?: string;
  items?: Array<{
    productId: string;
    quantity: number;
    price?: number;
    product?: {
      id: string;
      name: string;
      imageUrls?: string[];
    };
  }>;
}

export interface MetricsOverview {
  totalRevenue?: number;
  totalOrders?: number;
  pendingOrders?: number;
  bestSellers?: number;
}

const buildQuery = (filters: ProductFilters) => {
  const params = new URLSearchParams();
  if (filters.limit) params.append('limit', String(filters.limit));
  if (filters.page) params.append('page', String(filters.page));
  if (filters.search) params.append('search', filters.search);
  if (filters.collectionType) params.append('collectionType', filters.collectionType);
  if (filters.productCode) params.append('productCode', filters.productCode);
  if (filters.category && filters.category !== 'All') params.append('category', filters.category);
  if (typeof filters.minPrice === 'number') params.append('minPrice', String(filters.minPrice));
  if (typeof filters.maxPrice === 'number') params.append('maxPrice', String(filters.maxPrice));
  if (filters.isNewArrival) params.append('isNewArrival', 'true');
  if (filters.isBestSeller) params.append('isBestSeller', 'true');
  if (filters.isFeatured) params.append('isFeatured', 'true');

  if (filters.sortOption) {
    switch (filters.sortOption) {
      case 'price-low':
        params.append('sortBy', 'price');
        params.append('sortOrder', 'asc');
        break;
      case 'price-high':
        params.append('sortBy', 'price');
        params.append('sortOrder', 'desc');
        break;
      case 'name':
        params.append('sortBy', 'name');
        params.append('sortOrder', 'asc');
        break;
      case 'newest':
        params.append('sortBy', 'createdAt');
        params.append('sortOrder', 'desc');
        break;
      default:
        params.append('sortBy', 'featured');
        params.append('sortOrder', 'desc');
    }
  } else {
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
  }

  return params.toString();
};

const normalizeProduct = (product: any): Product => {
  const rawFeatures = product.features;
  const features = Array.isArray(rawFeatures)
    ? rawFeatures
    : typeof rawFeatures === 'string'
      ? rawFeatures.split(',').map((f: string) => f.trim()).filter(Boolean)
      : [];

  const imageUrls = product.imageUrls || product.image_url ? [product.image_url, ...(product.imageUrls || [])].filter(Boolean) : (product.imageUrls || []);

  return {
    ...product,
    imageUrls,
    features,
    isBestSeller: product.isBestSeller ?? product.is_best_seller,
    isNewArrival: product.isNewArrival ?? product.is_new_arrival,
    isFeatured: product.isFeatured ?? product.is_featured,
    isAvailable: product.isAvailable ?? product.is_available,
    quantity: product.quantity ?? product.stock_quantity,
  };
};

export const hokApi = {
  async login(email: string, password: string) {
    return apiRequest<{ access_token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async register(payload: { email: string; password: string; name?: string; phone?: string; role?: string }) {
    return apiRequest<{ access_token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async fetchProfile() {
    return apiRequest<any>('/users/me', { method: 'GET' });
  },

  async fetchProducts(filters: ProductFilters = {}) {
    const query = buildQuery(filters);
    const response = await apiRequest<PaginatedResponse<Product> | Product[]>(`/products${query ? `?${query}` : ''}`, {
      method: 'GET',
    });

    if (Array.isArray(response)) {
      return { data: response.map(normalizeProduct) };
    }

    return {
      data: (response.data || []).map(normalizeProduct),
      meta: response.meta,
    };
  },

  async fetchProduct(id: string) {
    const response = await apiRequest<Product>(`/products/${id}`, { method: 'GET' });
    return normalizeProduct(response);
  },

  async createProduct(input: CreateProductInput) {
    const form = new FormData();
    form.append('name', input.name);
    form.append('price', String(input.price));
    form.append('productCode', input.productCode);
    form.append('quantity', String(input.quantity));
    form.append('category', input.category);
    if (input.collectionType) form.append('collectionType', input.collectionType);
    if (input.description) form.append('description', input.description);
    if (input.features?.length) form.append('features', input.features.join(', '));
    if (typeof input.isFeatured === 'boolean') form.append('isFeatured', String(input.isFeatured));
    if (typeof input.isAvailable === 'boolean') form.append('isAvailable', String(input.isAvailable));
    if (typeof input.isBestSeller === 'boolean') form.append('isBestSeller', String(input.isBestSeller));
    if (typeof input.isNewArrival === 'boolean') form.append('isNewArrival', String(input.isNewArrival));
    input.imageUrls?.forEach((url) => form.append('imageUrls', url));
    input.videoUrls?.forEach((url) => form.append('videoUrls', url));

    const result = await apiRequest<Product>('/products', {
      method: 'POST',
      body: form,
      isFormData: true,
    });
    return normalizeProduct(result);
  },

  async updateProduct(id: string, input: Partial<CreateProductInput>) {
    const result = await apiRequest<Product>(`/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
    return normalizeProduct(result);
  },

  async deleteProduct(id: string) {
    return apiRequest<{ message: string }>(`/products/${id}`, { method: 'DELETE' });
  },

  async fetchOrders(status?: string) {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    return apiRequest<Order[]>(`/orders${params.toString() ? `?${params.toString()}` : ''}`, {
      method: 'GET',
    });
  },

  async fetchOrder(id: string) {
    return apiRequest<Order>(`/orders/${id}`, { method: 'GET' });
  },

  async createOrder(input: CreateOrderInput, asGuest = false) {
    const form = new FormData();
    if (input.shippingAddress) form.append('shippingAddress', input.shippingAddress);
    if (input.note) form.append('note', input.note);
    form.append('items', JSON.stringify(input.items));
    if (input.receiptFile) form.append('receipt', input.receiptFile);

    if (asGuest) {
      if (input.customerEmail) form.append('customerEmail', input.customerEmail);
      if (input.customerName) form.append('customerName', input.customerName);
      if (input.customerPhone) form.append('customerPhone', input.customerPhone);
    }

    const endpoint = asGuest ? '/orders/guest' : '/orders';
    return apiRequest<Order>(endpoint, {
      method: 'POST',
      body: form,
      isFormData: true,
    });
  },

  async updateOrderStatus(id: string, status: string, reference?: string) {
    return apiRequest<Order>(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, reference }),
    });
  },

  async confirmOrderPayment(id: string, payload: { reference?: string; receiptUrl?: string }) {
    return apiRequest<Order>(`/orders/${id}/confirm-payment`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  async fetchMetricsOverview(params: { startDate?: string; endDate?: string; status?: string } = {}) {
    const search = new URLSearchParams();
    if (params.startDate) search.append('startDate', params.startDate);
    if (params.endDate) search.append('endDate', params.endDate);
    if (params.status) search.append('status', params.status);
    return apiRequest<MetricsOverview | any>(`/metrics/overview${search.toString() ? `?${search.toString()}` : ''}`, {
      method: 'GET',
    });
  },

  async fetchUsers() {
    return apiRequest<any[]>('/users', { method: 'GET' });
  },

  async deleteUser(id: string) {
    return apiRequest<{ message: string }>(`/users/${id}`, { method: 'DELETE' });
  },
};
