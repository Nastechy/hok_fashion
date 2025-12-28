import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { hokApi, WishlistItem } from '@/services/hokApi';
import { useAuth } from '@/contexts/AuthContext';

export type { WishlistItem } from '@/services/hokApi';

const STORAGE_KEY = 'hok_wishlist_items';

type WishlistOptions = {
  onRequireLogin?: (handlers: { onLogin: () => void; onContinueAsGuest: () => void }) => void;
};

export const useWishlist = (options: WishlistOptions = {}) => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const loadWishlist = async () => {
      if (user) {
        try {
          const data = await hokApi.fetchWishlist();
          if (isMounted) {
            setItems(data);
          }
        } catch (error) {
          console.error('Failed to load wishlist', error);
        }
        return;
      }

      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setItems(JSON.parse(stored));
        } else {
          setItems([]);
        }
      } catch (error) {
        console.error('Failed to load wishlist', error);
      }
    };

    loadWishlist();
    return () => {
      isMounted = false;
    };
  }, [user]);

  const persistLocal = useCallback((next: WishlistItem[]) => {
    setItems(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const redirectToAuth = () => {
    const returnTo = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    sessionStorage.setItem('hok_return_to', returnTo);
    const encoded = encodeURIComponent(returnTo);
    window.location.assign(`/auth?returnTo=${encoded}`);
  };

  const handleRequireLogin = (handlers: { onLogin: () => void; onContinueAsGuest: () => void }) => {
    if (options.onRequireLogin) {
      options.onRequireLogin(handlers);
      return;
    }
    handlers.onLogin();
  };

  const addItemAsGuest = (item: WishlistItem) => {
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
  };

  const toggleItemAsGuest = (item: WishlistItem) => {
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
  };

  const addItem = useCallback((item: WishlistItem) => {
    if (user) {
      setItems((prev) => {
        if (prev.some((existing) => existing.id === item.id)) {
          return prev;
        }
        return [...prev, item];
      });
      toast({
        title: 'Added to wishlist',
        description: `${item.name} was saved for later.`,
      });
      hokApi
        .addToWishlist(item.id)
        .then(() => hokApi.fetchWishlist())
        .then((data) => setItems(data))
        .catch((error) => {
          console.error('Failed to add to wishlist', error);
          setItems((prev) => prev.filter((entry) => entry.id !== item.id));
          toast({
            title: 'Wishlist update failed',
            description: 'Could not save this item. Please try again.',
            variant: 'destructive',
          });
        });
      return;
    }

    handleRequireLogin({
      onLogin: redirectToAuth,
      onContinueAsGuest: () => {},
    });
  }, [user]);

  const removeItem = useCallback((id: string) => {
    if (user) {
      const previous = items;
      setItems((prev) => prev.filter((item) => item.id !== id));
      hokApi
        .removeFromWishlist(id)
        .then(() => hokApi.fetchWishlist())
        .then((data) => setItems(data))
        .catch((error) => {
          console.error('Failed to remove from wishlist', error);
          setItems(previous);
          toast({
            title: 'Wishlist update failed',
            description: 'Could not remove this item. Please try again.',
            variant: 'destructive',
          });
        });
      return;
    }

    setItems((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, [items, user]);

  const toggleItem = useCallback((item: WishlistItem) => {
    if (user) {
      const exists = items.some((entry) => entry.id === item.id);
      const optimistic = exists
        ? items.filter((entry) => entry.id !== item.id)
        : [...items, item];
      setItems(optimistic);
      toast({
        title: exists ? 'Removed from wishlist' : 'Added to wishlist',
        description: exists ? `${item.name} was removed.` : `${item.name} was saved for later.`,
      });
      const request = exists
        ? hokApi.removeFromWishlist(item.id)
        : hokApi.addToWishlist(item.id);
      request
        .then(() => hokApi.fetchWishlist())
        .then((data) => setItems(data))
        .catch((error) => {
          console.error('Failed to update wishlist', error);
          setItems(items);
          toast({
            title: 'Wishlist update failed',
            description: 'Could not update this item. Please try again.',
            variant: 'destructive',
          });
        });
      return;
    }

    handleRequireLogin({
      onLogin: redirectToAuth,
      onContinueAsGuest: () => {},
    });
  }, [items, user]);

  const clearWishlist = useCallback(() => {
    if (user) {
      const previous = items;
      setItems([]);
      Promise.all(previous.map((item) => hokApi.removeFromWishlist(item.id)))
        .then(() => hokApi.fetchWishlist())
        .then((data) => setItems(data))
        .catch((error) => {
          console.error('Failed to clear wishlist', error);
          setItems(previous);
          toast({
            title: 'Wishlist update failed',
            description: 'Could not clear your wishlist. Please try again.',
            variant: 'destructive',
          });
        });
      return;
    }

    persistLocal([]);
  }, [items, persistLocal, user]);

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
