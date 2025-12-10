export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
}

// Legacy service retained for compatibility. All cart logic now lives in useCart.
export const cartService = {
  async getCartItems(): Promise<CartItem[]> {
    return [];
  },
  async addToCart(): Promise<{ success: boolean; error?: string }> {
    return { success: true };
  },
  async updateCartItem(): Promise<{ success: boolean; error?: string }> {
    return { success: true };
  },
  async removeFromCart(): Promise<{ success: boolean; error?: string }> {
    return { success: true };
  },
  async clearCart(): Promise<{ success: boolean; error?: string }> {
    return { success: true };
  }
};
