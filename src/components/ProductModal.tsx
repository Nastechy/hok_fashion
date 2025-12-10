import { useEffect, useMemo, useState } from 'react';
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
  const images = useMemo(() => product ? (product.images || product.imageUrls || []) : [], [product]);
  const [activeIndex, setActiveIndex] = useState(0);
  const cover = images[activeIndex] || 'https://via.placeholder.com/500x500?text=HOK';
  const formatCurrency = (value: number) =>
    value.toLocaleString('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 });

  useEffect(() => {
    setActiveIndex(0);
  }, [product?.id]);

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
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((img, idx) => (
                  <button
                    key={img + idx}
                    className={`h-20 rounded-md overflow-hidden border transition-all ${idx === activeIndex ? 'border-red shadow-elegant' : 'border-transparent hover:border-border'}`}
                    onClick={() => setActiveIndex(idx)}
                  >
                    <img src={img} alt={`${product.name}-${idx}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
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
              {formatCurrency(product.price)}
            </div>
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-lg font-playfair">Available Variants</h4>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant, idx) => (
                    <Badge key={`${variant.sku || variant.name || idx}`} variant="outline">
                      {variant.name || variant.sku} {variant.priceDelta ? `(+${formatCurrency(variant.priceDelta)})` : ''}
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-foreground font-inter">Choose a variant</label>
                  <select className="h-11 rounded-md border border-border bg-background px-3 text-sm" defaultValue={product.variants[0]?.sku || ''}>
                    {product.variants.map((variant, idx) => (
                      <option key={`${variant.sku || variant.name || idx}`} value={variant.sku || variant.name}>
                        {variant.name || variant.sku} {variant.priceDelta ? `(+${formatCurrency(variant.priceDelta)})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

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

            <div className="space-y-3 pt-4">
              <Button
                variant="luxury"
                size="lg"
                className="w-full"
                onClick={handleAddToCart}
              >
                Add to Cart - {formatCurrency(product.price)}
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
