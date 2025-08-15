import { useState } from 'react';
import { ShoppingBag, Menu, X, Search, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
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
            <h1 className="text-2xl font-bold text-foreground font-playfair">HOK Fashion</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-sm font-medium transition-colors hover:text-red font-inter text-muted-foreground">
              Home
            </a>
            <a href="/about" className="text-sm font-medium transition-colors hover:text-red font-inter text-muted-foreground">
              About
            </a>
            <a href="/lookbook" className="text-sm font-medium transition-colors hover:text-red font-inter text-muted-foreground">
              Lookbook
            </a>
            
            {/* Collections Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-sm font-medium font-inter text-muted-foreground hover:text-red p-0 h-auto">
                  All Collections
                  <ChevronDown className="ml-1 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-background border border-border shadow-lg">
                {categories.map((category) => (
                  <DropdownMenuItem
                    key={category}
                    onClick={() => onCategoryChange?.(category)}
                    className={`cursor-pointer font-inter transition-colors hover:bg-secondary ${
                      selectedCategory === category ? 'text-red bg-secondary' : 'text-muted-foreground'
                    }`}
                  >
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <a href="/contact" className="text-sm font-medium transition-colors hover:text-red font-inter text-muted-foreground">
              Contact
            </a>
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
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red">
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
                  <div className="flex flex-col space-y-2 mt-8">
                    <a href="/" className="text-left p-3 text-sm font-medium transition-colors hover:bg-secondary rounded-md font-inter text-muted-foreground">
                      Home
                    </a>
                    <a href="/about" className="text-left p-3 text-sm font-medium transition-colors hover:bg-secondary rounded-md font-inter text-muted-foreground">
                      About
                    </a>
                    <a href="/lookbook" className="text-left p-3 text-sm font-medium transition-colors hover:bg-secondary rounded-md font-inter text-muted-foreground">
                      Lookbook
                    </a>
                    
                    {/* Collections Section */}
                    <div className="py-2">
                      <p className="px-3 text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider font-inter mb-2">
                        Collections
                      </p>
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => {
                            onCategoryChange?.(category);
                            setIsMenuOpen(false);
                          }}
                          className={`w-full text-left p-3 text-sm font-medium transition-colors hover:bg-secondary rounded-md font-inter ${
                            selectedCategory === category
                              ? 'text-red bg-secondary'
                              : 'text-muted-foreground'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                    
                    <a href="/contact" className="text-left p-3 text-sm font-medium transition-colors hover:bg-secondary rounded-md font-inter text-muted-foreground">
                      Contact
                    </a>
                  </div>
                </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};