import { hokApi, Product, ProductFilters } from './hokApi';

export { Product };

export const productService = {
  async getAllProducts(filters: ProductFilters = {}): Promise<Product[]> {
    const response = await hokApi.fetchProducts(filters);
    return response.data;
  },

  async getProductById(id: string): Promise<Product | null> {
    const data = await hokApi.fetchProduct(id);
    return data;
  },

  async getBestSellers(): Promise<Product[]> {
    const response = await hokApi.fetchProducts({ isBestSeller: true, limit: 12 });
    return response.data;
  },

  async getNewArrivals(): Promise<Product[]> {
    const response = await hokApi.fetchProducts({ isNewArrival: true, limit: 12 });
    return response.data;
  },

  async getProductsByCategory(category: string): Promise<Product[]> {
    const response = await hokApi.fetchProducts({ category, limit: 50 });
    return response.data;
  },

  async searchProducts(query: string): Promise<Product[]> {
    const response = await hokApi.fetchProducts({ search: query, limit: 20 });
    return response.data;
  }
};
