import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { Product } from '@/data/products';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
}

export const ProductCard = ({ product, onViewDetails }: ProductCardProps) => {
  const { addItem } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
  };

  return (
    <Card 
      id={`product-${product.id}`}
      className="group cursor-pointer transition-all duration-500 hover:shadow-elegant border-0 shadow-card bg-gradient-subtle"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onViewDetails(product)}
    >
      <CardContent className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Badge 
            className="absolute top-3 left-3 bg-primary/90 text-primary-foreground font-inter font-medium backdrop-blur-sm text-xs"
          >
            {product.category}
          </Badge>
          {product.isBestSeller && (
            <Badge 
              className="absolute top-3 right-3 bg-red/90 text-red-foreground font-inter font-medium backdrop-blur-sm text-xs"
            >
              Best Seller
            </Badge>
          )}
          {product.isNewArrival && (
            <Badge 
              className="absolute top-12 right-3 bg-accent/90 text-accent-foreground font-inter font-medium backdrop-blur-sm text-xs"
            >
              New
            </Badge>
          )}
        </div>
        <div className="p-6">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors font-playfair leading-tight">
              {product.name}
            </h3>
            <span className="text-xs text-muted-foreground font-mono bg-muted/50 px-2 py-1 rounded-md ml-3 shrink-0">
              {product.productCode}
            </span>
          </div>
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2 font-inter leading-relaxed">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary font-playfair">
              ₦{product.price.toLocaleString()}
            </span>
            <Button 
              variant="luxury"
              size="sm"
              onClick={handleAddToCart}
              className="transform transition-all duration-300 hover:scale-105 hover:shadow-glow"
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};