import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from '@/hooks/use-toast';

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image?: string;
}

const STORAGE_KEY = 'hok_wishlist_items';

export const useWishlist = () => {
  const [items, setItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load wishlist', error);
    }
  }, []);

  const persist = useCallback((next: WishlistItem[]) => {
    setItems(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const addItem = useCallback((item: WishlistItem) => {
    setItems((prev) => {
      if (prev.some((existing) => existing.id === item.id)) {
        return prev;
      }
      const updated = [...prev, item];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      toast({
        title: 'Added to wishlist',
        description: `${item.name} was saved for later.`,
      });
      return updated;
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const toggleItem = useCallback((item: WishlistItem) => {
    setItems((prev) => {
      const exists = prev.some((entry) => entry.id === item.id);
      const updated = exists ? prev.filter((entry) => entry.id !== item.id) : [...prev, item];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      toast({
        title: exists ? 'Removed from wishlist' : 'Added to wishlist',
        description: exists ? `${item.name} was removed.` : `${item.name} was saved for later.`,
      });
      return updated;
    });
  }, []);

  const clearWishlist = useCallback(() => {
    persist([]);
  }, [persist]);

  const count = useMemo(() => items.length, [items]);
  const isWished = useCallback((id: string) => items.some((item) => item.id === id), [items]);

  return {
    items,
    addItem,
    removeItem,
    toggleItem,
    clearWishlist,
    count,
    isWished,
  };
};
