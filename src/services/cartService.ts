import { supabase } from '@/integrations/supabase/client';

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  products: {
    id: string;
    name: string;
    price: number;
    image_url: string;
  };
}

export const cartService = {
  async getCartItems(userId: string): Promise<CartItem[]> {
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        products (
          id,
          name,
          price,
          image_url
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching cart items:', error);
      return [];
    }

    return data || [];
  },

  async addToCart(userId: string, productId: string, quantity: number = 1): Promise<{ success: boolean; error?: string }> {
    // First check if item already exists
    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .maybeSingle();

    if (existingItem) {
      // Update quantity
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: existingItem.quantity + quantity })
        .eq('id', existingItem.id);

      if (error) {
        console.error('Error updating cart item:', error);
        return { success: false, error: error.message };
      }
    } else {
      // Insert new item
      const { error } = await supabase
        .from('cart_items')
        .insert({
          user_id: userId,
          product_id: productId,
          quantity
        });

      if (error) {
        console.error('Error adding to cart:', error);
        return { success: false, error: error.message };
      }
    }

    return { success: true };
  },

  async updateCartItem(itemId: string, quantity: number): Promise<{ success: boolean; error?: string }> {
    if (quantity <= 0) {
      return this.removeFromCart(itemId);
    }

    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', itemId);

    if (error) {
      console.error('Error updating cart item:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  },

  async removeFromCart(itemId: string): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId);

    if (error) {
      console.error('Error removing from cart:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  },

  async clearCart(userId: string): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);

    if (error) {
      console.error('Error clearing cart:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  }
};