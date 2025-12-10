import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { Product } from '@/services/hokApi';
import { Check, Star } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductModal = ({ product, isOpen, onClose }: ProductModalProps) => {
  const { addItem } = useCart();
  const cover = product?.imageUrls?.[0] || 'https://via.placeholder.com/500x500?text=HOK';

  if (!product) return null;

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: cover,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative">
              <img
                src={cover}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg shadow-elegant"
              />
              <Badge className="absolute top-4 left-4 bg-red text-red-foreground font-inter font-medium">
                {product.category}
              </Badge>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-foreground font-playfair">
              {product.name}
            </DialogTitle>
            </DialogHeader>

            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-red text-red" />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">(127 reviews)</span>
            </div>

            <div className="text-3xl font-bold text-red font-playfair">
              ${product.price}
            </div>

            <p className="text-muted-foreground leading-relaxed font-inter">
              {product.description}
            </p>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-semibold text-lg font-playfair">Features</h3>
              <ul className="space-y-2">
                {product.features && product.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-red" />
                    <span className="text-sm font-inter">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-semibold text-lg font-playfair">Shipping & Returns</h3>
              <div className="text-sm text-muted-foreground space-y-1 font-inter">
                <p>• Nationwide Delivery</p>
                <p>• 30-day return policy</p>
                <p>• Authentic guarantee</p>
                <p>• Ships within 1-2 business days</p>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <Button
                variant="luxury"
                size="lg"
                className="w-full"
                onClick={handleAddToCart}
              >
                Add to Cart - ${product.price}
              </Button>
              <Button
                variant="elegant"
                size="lg"
                className="w-full"
              >
                Add to Wishlist
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
