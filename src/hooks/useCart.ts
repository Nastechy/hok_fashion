import { useState, useCallback, useMemo, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { cartService, CartItem as DBCartItem } from '@/services/cartService';
import { toast } from '@/hooks/use-toast';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export const useCart = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Load cart items from database when user logs in
  useEffect(() => {
    if (user) {
      loadCartItems();
    } else {
      setItems([]);
    }
  }, [user]);

  const loadCartItems = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const dbItems = await cartService.getCartItems(user.id);
      const cartItems: CartItem[] = dbItems.map((dbItem: DBCartItem) => ({
        id: dbItem.product_id,
        name: dbItem.products.name,
        price: dbItem.products.price,
        image: dbItem.products.image_url,
        quantity: dbItem.quantity,
      }));
      setItems(cartItems);
    } catch (error) {
      console.error('Error loading cart items:', error);
      toast({
        title: "Error loading cart",
        description: "Failed to load your cart items.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addItem = useCallback(async (product: Omit<CartItem, 'quantity'>) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to add items to cart.",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await cartService.addToCart(user.id, product.id);
      if (result.success) {
        // Update local state
        setItems(prev => {
          const existingItem = prev.find(item => item.id === product.id);
          if (existingItem) {
            return prev.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
          }
          return [...prev, { ...product, quantity: 1 }];
        });
        
        toast({
          title: "Added to cart",
          description: `${product.name} has been added to your cart.`,
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to add item to cart.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart.",
        variant: "destructive",
      });
    }
  }, [user]);

  const updateQuantity = useCallback(async (productId: string, quantity: number) => {
    if (!user) return;

    try {
      // Find the cart item in database
      const dbItems = await cartService.getCartItems(user.id);
      const dbItem = dbItems.find(item => item.product_id === productId);
      
      if (dbItem) {
        const result = await cartService.updateCartItem(dbItem.id, quantity);
        if (result.success) {
          if (quantity <= 0) {
            setItems(prev => prev.filter(item => item.id !== productId));
          } else {
            setItems(prev =>
              prev.map(item =>
                item.id === productId ? { ...item, quantity } : item
              )
            );
          }
        }
      }
    } catch (error) {
      console.error('Error updating cart item:', error);
    }
  }, [user]);

  const removeItem = useCallback(async (productId: string) => {
    if (!user) return;

    try {
      const dbItems = await cartService.getCartItems(user.id);
      const dbItem = dbItems.find(item => item.product_id === productId);
      
      if (dbItem) {
        const result = await cartService.removeFromCart(dbItem.id);
        if (result.success) {
          setItems(prev => prev.filter(item => item.id !== productId));
        }
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  }, [user]);

  const clearCart = useCallback(async () => {
    if (!user) return;

    try {
      const result = await cartService.clearCart(user.id);
      if (result.success) {
        setItems([]);
        toast({
          title: "Cart cleared",
          description: "All items have been removed from your cart.",
        });
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  }, [user]);

  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  const itemCount = useMemo(() => {
    return items.reduce((count, item) => count + item.quantity, 0);
  }, [items]);

  return {
    items,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    total,
    itemCount,
    loading,
  };
};