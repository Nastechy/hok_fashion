import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { Product } from '@/services/hokApi';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
}

export const ProductCard = ({ product, onViewDetails }: ProductCardProps) => {
  const { addItem } = useCart();
  const [, setIsHovered] = useState(false);

  const cover =
    product.images?.[0] ||
    product.imageUrls?.[0] ||
    'https://via.placeholder.com/400x400?text=HOK';

  const formatCurrency = (value: number) =>
    value.toLocaleString('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    });

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: cover,
    });
  };

  return (
    <Card
      id={`product-${product.id}`}
      className="w-full max-w-[420px] sm:max-w-[460px] group relative flex flex-col overflow-hidden border-0 bg-gradient-subtle shadow-xl transition-all duration-500 hover:shadow-luxury motion-fade"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="flex h-full flex-col p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={cover}
            alt={product.name}
            className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-black/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="absolute right-3 top-3 flex flex-col items-end gap-2">
            {product.isBestSeller && (
              <Badge className="bg-red/90 text-red-foreground font-inter font-medium backdrop-blur-sm text-[0.7rem]">
                Best Seller
              </Badge>
            )}
            {product.isNewArrival && (
              <Badge className="bg-accent/90 text-accent-foreground font-inter font-medium backdrop-blur-sm text-[0.7rem]">
                New Arrival
              </Badge>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            {product.category && (
              <Badge className="bg-primary/90 text-primary-foreground font-inter font-medium text-[0.7rem]">
                {product.category}
              </Badge>
            )}
            <span className="ml-auto shrink-0 rounded-md bg-muted/60 px-2 py-1 text-[0.7rem] font-mono text-muted-foreground">
              {product.id.slice(0, 8)}
            </span>
          </div>

          <h3 className="text-lg font-semibold leading-tight text-foreground transition-colors font-playfair group-hover:text-primary">
            {product.name}
          </h3>

          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground font-inter">
            {product.description}
          </p>

          <div className="flex-1" />

          <div className="flex flex-col gap-3">
            <div className="mt-2 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-2xl font-bold text-primary font-playfair">
                {formatCurrency(product.price)}
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
