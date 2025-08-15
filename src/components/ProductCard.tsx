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
      className="group cursor-pointer transition-all duration-300 hover:shadow-luxury border-0 shadow-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onViewDetails(product)}
    >
      <CardContent className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <Badge 
            className="absolute top-3 left-3 bg-red text-red-foreground font-inter font-medium"
          >
            {product.category}
          </Badge>
          {product.isBestSeller && (
            <Badge 
              className="absolute top-3 right-3 bg-primary text-primary-foreground font-inter font-medium"
            >
              Best Seller
            </Badge>
          )}
          {product.isNewArrival && (
            <Badge 
              className="absolute top-12 right-3 bg-accent text-accent-foreground font-inter font-medium"
            >
              New
            </Badge>
          )}
          {isHovered && (
            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center transition-opacity duration-300">
              <Button 
                variant="luxury"
                onClick={handleAddToCart}
                className="transform transition-all duration-300 hover:scale-105"
              >
                Add to Cart
              </Button>
            </div>
          )}
        </div>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-red transition-colors font-playfair">
            {product.name}
          </h3>
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2 font-inter">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-red font-playfair">
              ${product.price}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};