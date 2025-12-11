import { ReactNode } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { HeartOff, ShoppingCart, X } from 'lucide-react';

interface WishlistSheetProps {
  children: ReactNode;
}

export const WishlistSheet = ({ children }: WishlistSheetProps) => {
  const { items, removeItem, clearWishlist } = useWishlist();
  const { addItem } = useCart();

  const formatCurrency = (value: number) =>
    value.toLocaleString('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 });

  const handleMoveToCart = (item: (typeof items)[number]) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image || '',
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex flex-col h-full">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold">Wishlist</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-2 text-muted-foreground">
              <HeartOff className="h-5 w-5" />
              <p>Your wishlist is empty. Save favorites to shop later.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-start gap-4 rounded-lg bg-secondary/50 p-4">
                  <img
                    src={item.image || 'https://via.placeholder.com/100x100?text=HOK'}
                    alt={item.name}
                    className="h-16 w-16 rounded-md object-cover"
                  />
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="font-medium text-sm truncate">{item.name}</p>
                    <p className="text-sm text-red font-semibold">{formatCurrency(item.price)}</p>
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="default"
                        className="h-8"
                        onClick={() => handleMoveToCart(item)}
                      >
                        <ShoppingCart className="mr-2 h-3 w-3" />
                        Add to Cart
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => removeItem(item.id)}
                        aria-label="Remove from wishlist"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t pt-4">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Items saved</span>
              <span>{items.length}</span>
            </div>
            <Separator />
            <Button variant="outline" className="w-full mt-3" onClick={clearWishlist}>
              Clear Wishlist
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
