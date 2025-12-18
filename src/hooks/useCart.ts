import { useState, useCallback, useMemo, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

export interface CartItem {
  id: string; // cart item id (product + variant)
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  variantId?: string;
  variantName?: string;
}

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const STORAGE_KEY = 'hok_cart_items';

  useEffect(() => {
    const loadFromStorage = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed: any[] = JSON.parse(stored);
          const normalized = Array.isArray(parsed)
            ? parsed.map((item) => ({
                ...item,
                productId: item.productId || item.id,
                id: item.id || `${item.productId || item.id}${item.variantId ? `:${item.variantId}` : ''}`,
              }))
            : [];
          setItems(normalized);
        } else {
          setItems([]);
        }
      } catch (error) {
        console.error('Failed to load cart items', error);
      }
    };

    setLoading(true);
    loadFromStorage();
    setLoading(false);

    const handleStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        loadFromStorage();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const addItem = useCallback(async (product: Omit<CartItem, 'quantity' | 'id'> & { quantity?: number }) => {
    setItems(prev => {
      const cartId = `${product.productId}${product.variantId ? `:${product.variantId}` : ''}`;
      const desiredQuantity = Math.max(1, product.quantity ?? 1);
      const existingItem = prev.find(item => item.id === cartId);
      const updated = existingItem
        ? prev.map(item =>
            item.id === cartId ? { ...item, quantity: item.quantity + desiredQuantity } : item
          )
        : [...prev, { ...product, id: cartId, quantity: desiredQuantity }];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems(prev => {
      const updated = prev
        .map(item => item.id === productId ? { ...item, quantity } : item)
        .filter(item => item.quantity > 0);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems(prev => {
      const updated = prev.filter(item => item.id !== productId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    localStorage.removeItem(STORAGE_KEY);
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    });
  }, []);

  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
  }, [items]);

  const itemCount = useMemo(() => {
    return items.reduce((count, item) => count + Number(item.quantity || 0), 0);
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
