import { useState } from 'react';
import { ShoppingCart, Menu, Search, ChevronDown, User, LogOut, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useAdmin } from '@/hooks/useAdmin';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CartSheet } from './CartSheet';
import { WishlistSheet } from './WishlistSheet';
import { useQuery } from '@tanstack/react-query';
import { hokApi, Product } from '@/services/hokApi';
import { useWishlist } from '@/contexts/WishlistContext';

interface HeaderProps {
  onCategoryChange?: (category: string) => void;
  selectedCategory?: string;
}

export const Header = ({ onCategoryChange, selectedCategory = 'All' }: HeaderProps) => {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mobileCollectionsOpen, setMobileCollectionsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdmin();

  const categories = ['All', 'AVAILABLE', 'BEST_SELLER', 'NEW_ARRIVAL', 'FEATURE', 'INCOMING'];
  const formatCategoryLabel = (category: string) =>
    category
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());

  const { data: searchData } = useQuery({
    queryKey: ['header-search', searchTerm],
    queryFn: () => hokApi.fetchProducts({ search: searchTerm, limit: 8 }),
    enabled: searchTerm.trim().length > 1,
  });

  const searchResults: Product[] = searchData?.data ?? [];

  const getImage = (product: Product) => product.imageUrls?.[0] || '';
  const formatCurrency = (value: number) =>
    value.toLocaleString('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 });

  const handleSearchSelect = (product: any) => {
    // Scroll to product or navigate to product
    const element = document.getElementById(`product-${product.id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setSearchOpen(false);
    setSearchTerm('');
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-white/90 via-white/80 to-white/70 border-b border-border/60 backdrop-blur-xl shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-red/80 to-primary shadow-glow flex items-center justify-center motion-float transition-transform group-hover:scale-105">
              <span className="text-sm font-semibold text-primary-foreground">H</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground font-playfair leading-tight group-hover:text-primary transition-colors">HOK Fashion</h1>
              <p className="text-xs text-muted-foreground font-inter tracking-wide uppercase">Luxury Handbags</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {[
              { href: '/', label: 'Home' },
              { href: '/about', label: 'About' },
              { href: '/lookbook', label: 'Lookbook' },
              { href: '/contact', label: 'Contact' },
            ].map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`relative text-sm font-semibold font-inter transition-all duration-200 group px-3 py-2 rounded-full border ${
                  pathname === link.href
                    ? 'border-red/60 bg-red text-primary-foreground shadow-elegant'
                    : 'border-transparent text-muted-foreground hover:text-red hover:bg-red/10 hover:border-red hover:text-base'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Collections Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-sm font-semibold font-inter text-foreground px-3 py-2 rounded-full transition-all hover:scale-105">
                  Collections
                  <ChevronDown className="ml-1 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-52 bg-background/95 backdrop-blur border border-border shadow-lg">
                {categories.map((category) => (
                  <DropdownMenuItem
                    key={category}
                    onClick={() => onCategoryChange?.(category)}
                    onSelect={() => {
                      onCategoryChange?.(category);
                      navigate(`/collections/${encodeURIComponent(category)}`);
                    }}
                    className={`cursor-pointer font-inter transition-colors ${
                      selectedCategory === category ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted/50'
                    }`}
                  >
                    {formatCategoryLabel(category)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {/* Search Dialog */}
            <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden md:flex rounded-full bg-secondary/70 hover:bg-red shadow-sm text-muted-foreground hover:text-white"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="font-playfair">Search Products</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Search by bag name, collection, or features..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                    autoFocus
                  />
                  
                  {searchTerm.trim() && (
                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {searchResults.length > 0 ? (
                        <>
                          <p className="text-sm text-muted-foreground font-inter">
                            {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
                          </p>
                          {searchResults.map((product) => (
                            <div
                              key={product.id}
                              onClick={() => handleSearchSelect(product)}
                              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-secondary cursor-pointer transition-colors"
                            >
                              <img 
                                src={getImage(product)} 
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded-md"
                              />
                              <div className="flex-1">
                                <h4 className="font-medium font-inter text-sm">{product.name}</h4>
                                <p className="text-xs text-muted-foreground font-inter">
                                  {product.category} • {formatCurrency(product.price)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground font-inter py-4 text-center">
                          No products found matching "{searchTerm}"
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>

            {/* User Account */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hidden md:flex rounded-full bg-secondary/70 hover:bg-red shadow-sm text-muted-foreground hover:text-white"
                  >
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5 text-sm font-medium">
                    {user.email}
                  </div>
                  <DropdownMenuSeparator />
                  {isAdmin && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="cursor-pointer">
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem onClick={() => window.location.href = '/billing'}>
                    Order History
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => window.location.href = '/auth'}
                className="hidden md:flex rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-4"
              >
                Sign In
              </Button>
            )}
            
            <WishlistSheet>
              <Button
                variant="ghost"
                size="icon"
                className={`relative rounded-full shadow-sm transition-all ${
                  wishlistCount > 0 ? 'bg-primary text-primary-foreground hover:bg-primary/90 scale-105' : 'bg-secondary/70 hover:bg-red'
                }`}
              >
                <Heart className="h-4 w-4" />
                {wishlistCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red text-primary-foreground ">
                    {wishlistCount}
                  </Badge>
                )}
              </Button>
            </WishlistSheet>

            <CartSheet>
              <Button
                variant="ghost"
                size="icon"
                className={`relative rounded-full shadow-sm transition-all ${
                  itemCount > 0 ? 'bg-red text-red-foreground hover:bg-red/90 scale-105' : 'bg-secondary/70 hover:bg-secondary'
                }`}
              >
                <ShoppingCart className="h-4 w-4" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary text-primary-foreground">
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </CartSheet>

            {/* Mobile menu button */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="rounded-full bg-secondary/70 hover:bg-secondary shadow-sm">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-gradient-to-b from-white via-white/95 to-white/90">
              <div className="flex flex-col space-y-2 mt-8">
                    <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-left p-3 text-sm font-medium transition-colors hover:bg-red hover:text-white rounded-md font-inter text-muted-foreground">
                      Home
                    </Link>
                    <Link to="/about" onClick={() => setIsMenuOpen(false)} className="text-left p-3 text-sm font-medium transition-colors hover:bg-red hover:text-white rounded-md font-inter text-muted-foreground">
                      About
                    </Link>
                    <Link to="/lookbook" onClick={() => setIsMenuOpen(false)} className="text-left p-3 text-sm font-medium transition-colors hover:bg-red hover:text-white rounded-md font-inter text-muted-foreground">
                      Lookbook
                    </Link>
                    
                    {/* Collections Section */}
                    <div className="py-2">
                      <button
                        onClick={() => setMobileCollectionsOpen((prev) => !prev)}
                        className="w-full flex items-center justify-between text-left p-3 text-sm font-semibold transition-colors rounded-md font-inter text-muted-foreground hover:bg-red hover:text-white"
                      >
                        <span>Collections</span>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${mobileCollectionsOpen ? 'rotate-180' : ''}`}
                        />
                      </button>
                      {mobileCollectionsOpen && (
                        <div className="mt-1 space-y-1">
                          {categories.map((category) => (
                            <button
                              key={category}
                              onClick={() => {
                                onCategoryChange?.(category);
                                navigate(`/collections/${encodeURIComponent(category)}`);
                                setIsMenuOpen(false);
                                setMobileCollectionsOpen(false);
                              }}
                              className={`w-full text-left p-3 text-sm font-medium transition-colors rounded-md font-inter ${
                                selectedCategory === category
                                  ? 'bg-red text-white shadow-sm'
                                  : 'text-muted-foreground hover:bg-red hover:text-white'
                              }`}
                            >
                              {formatCategoryLabel(category)}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="text-left p-3 text-sm font-medium transition-colors hover:bg-red hover:text-white rounded-md font-inter text-muted-foreground">
                      Contact
                    </Link>

                    {/* Auth Section */}
                    <div className="pt-4 border-t border-border">
                      {user ? (
                        <div className="space-y-2">
                          <div className="px-3 text-xs text-muted-foreground font-inter">
                            {user.email}
                          </div>
                          {isAdmin && (
                            <button
                              onClick={() => {
                                window.location.href = '/admin';
                                setIsMenuOpen(false);
                              }}
                              className="w-full text-left p-3 text-sm font-medium transition-colors hover:bg-red hover:text-white rounded-md font-inter text-muted-foreground"
                            >
                              Admin Dashboard
                            </button>
                          )}
                          <button
                            onClick={() => {
                              window.location.href = '/billing';
                              setIsMenuOpen(false);
                            }}
                            className="w-full text-left p-3 text-sm font-medium transition-colors hover:bg-red hover:text-white rounded-md font-inter text-muted-foreground"
                          >
                            Order History
                          </button>
                          <button
                            onClick={() => {
                              signOut();
                              setIsMenuOpen(false);
                            }}
                            className="w-full text-left p-3 text-sm font-medium transition-colors hover:bg-red hover:text-white rounded-md font-inter text-muted-foreground"
                          >
                            Sign Out
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            window.location.href = '/auth';
                            setIsMenuOpen(false);
                          }}
                          className="w-full text-left p-3 text-sm font-medium transition-colors hover:bg-red hover:text-white rounded-md font-inter text-muted-foreground"
                        >
                          Sign In
                        </button>
                      )}
                    </div>
                  </div>
                </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};
