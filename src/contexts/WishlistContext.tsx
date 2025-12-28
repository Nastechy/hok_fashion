import React, { createContext, useCallback, useContext, useRef, useState, ReactNode } from 'react';
import { useWishlist as useWishlistHook, WishlistItem } from '@/hooks/useWishlist';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface WishlistContextType {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  toggleItem: (item: WishlistItem) => void;
  clearWishlist: () => void;
  count: number;
  isWished: (id: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const pendingHandlers = useRef<null | { onLogin: () => void; onContinueAsGuest: () => void }>(null);

  const handleRequireLogin = useCallback((handlers: { onLogin: () => void; onContinueAsGuest: () => void }) => {
    pendingHandlers.current = handlers;
    setShowLoginPrompt(true);
  }, []);

  const wishlistValue = useWishlistHook({ onRequireLogin: handleRequireLogin });

  return (
    <WishlistContext.Provider value={wishlistValue}>
      {children}
      <AlertDialog
        open={showLoginPrompt}
        onOpenChange={(open) => {
          setShowLoginPrompt(open);
          if (!open) pendingHandlers.current = null;
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Log in to save your wishlist</AlertDialogTitle>
            <AlertDialogDescription>
              You need to be signed in to save your wishlist across devices.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                pendingHandlers.current = null;
                setShowLoginPrompt(false);
              }}
            >
              Continue as guest
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                pendingHandlers.current?.onLogin();
                pendingHandlers.current = null;
                setShowLoginPrompt(false);
              }}
            >
              Log in
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
