import { useState } from 'react';
import { ShoppingBag, Menu, X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { CartSheet } from './CartSheet';

interface HeaderProps {
  onCategoryChange?: (category: string) => void;
  selectedCategory?: string;
}

export const Header = ({ onCategoryChange, selectedCategory = 'All' }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { itemCount } = useCart();

  const categories = ['All', 'Totes', 'Crossbody', 'Shoulder', 'Clutches'];

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-background/95">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-foreground">Luxe Bags</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onCategoryChange?.(category)}
                className={`text-sm font-medium transition-colors hover:text-luxury ${
                  selectedCategory === category
                    ? 'text-luxury border-b-2 border-luxury pb-1'
                    : 'text-muted-foreground'
                }`}
              >
                {category}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="h-4 w-4" />
            </Button>
            
            <CartSheet>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="h-4 w-4" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-luxury">
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </CartSheet>

            {/* Mobile menu button */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <div className="flex flex-col space-y-4 mt-8">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        onCategoryChange?.(category);
                        setIsMenuOpen(false);
                      }}
                      className={`text-left p-3 text-sm font-medium transition-colors hover:bg-secondary rounded-md ${
                        selectedCategory === category
                          ? 'text-luxury bg-secondary'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};