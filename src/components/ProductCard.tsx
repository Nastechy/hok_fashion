import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { Product } from '@/services/hokApi';
import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/contexts/WishlistContext';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
}

export const ProductCard = ({ product, onViewDetails }: ProductCardProps) => {
  const { addItem } = useCart();
  const { toggleItem, isWished } = useWishlist();
  const [, setIsHovered] = useState(false);
  const isFavorite = isWished(product.id);
  const formatCategoryLabel = (category?: string) =>
    (category || 'Unknown')
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  const handleImageClick = () => onViewDetails(product);
  const handleImageKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onViewDetails(product);
    }
  };

  const cover =
    product.images?.[0] ||
    product.imageUrls?.[0] ||
    'https://via.placeholder.com/400x400?text=HOK';

  const formatCurrency = (value?: number) =>
    (typeof value === 'number' ? value : 0).toLocaleString('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    });

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: cover,
    });
  };

  return (
    <Card
      id={`product-${product.id}`}
      className="w-full group relative flex flex-col overflow-hidden border-0 bg-gradient-subtle shadow-xl transition-all duration-500 hover:shadow-luxury motion-fade"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="flex h-full flex-col p-0">
        <div
          className="relative overflow-hidden rounded-t-lg bg-white cursor-pointer"
          role="button"
          tabIndex={0}
          onClick={handleImageClick}
          onKeyDown={handleImageKeyDown}
        >
          <img
            src={cover}
            alt={product.name}
            className="h-56 sm:h-60 w-full object-contain transition-transform duration-500 group-hover:scale-105"
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-black/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="absolute right-3 top-3 flex flex-col items-end gap-2">
            {/* {product.isBestSeller && (
              <Badge className="bg-red/90 text-red-foreground font-inter font-medium backdrop-blur-sm text-[0.7rem]">
                Best Seller
              </Badge>
            )}
            {product.isNewArrival && (
              <Badge className="bg-accent/90 text-accent-foreground font-inter font-medium backdrop-blur-sm text-[0.7rem]">
                New Arrival
              </Badge>
            )} */}
            <button
              className={`inline-flex items-center justify-center rounded-full bg-white/80 p-2 shadow-card transition-colors hover:bg-white ${
                isFavorite ? 'text-red' : 'text-muted-foreground'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                toggleItem({ id: product.id, name: product.name, price: product.price, image: cover });
              }}
              aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red' : ''}`} />
            </button>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-1 md:p-4 p-2 sm:p-5">
          <div className="flex items-center justify-between gap-2">
            {product.category && (
              <Badge className="bg-red/90 text-red-foreground font-inter font-small backdrop-blur-sm text-[10px]">
                {formatCategoryLabel(product.category)}
              </Badge>
            )}
            <span className="ml-auto shrink-0 rounded-md bg-muted/60 px-2 py-1 text-[0.7rem] font-mono text-muted-foreground">
              {(product.productCode || product.id).slice(0, 8)}
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-semibold leading-tight text-foreground transition-colors font-playfair group-hover:text-primary">
            {product.name}
          </h3>

          <p className="line-clamp-2 md:text-sm text-[12px] leading-relaxed text-muted-foreground font-inter">
            {product.description}
          </p>

          <div className="flex-1" />

          <div className="flex flex-col ">
            <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-xl sm:text-2xl font-bold text-primary font-playfair">
                {typeof product.price === 'number' ? formatCurrency(product.price) : 'Price on request'}
              </span>
              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewDetails(product);
                  }}
                  className="w-full transform transition-all duration-300 hover:scale-105 sm:w-auto"
                >
                  View Details
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
