import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { Product, Review, hokApi } from '@/services/hokApi';
import { Check, Heart, Star } from 'lucide-react';
import { useWishlist } from '@/contexts/WishlistContext';
import { ProductReviews } from './ProductReviews';
import { useQuery } from '@tanstack/react-query';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductModal = ({ product, isOpen, onClose }: ProductModalProps) => {
  const { addItem } = useCart();
  const { toggleItem, isWished } = useWishlist();
  const images = useMemo(() => product ? (product.images || product.imageUrls || []) : [], [product]);
  const [activeIndex, setActiveIndex] = useState(0);
  const cover = images[activeIndex] || 'https://via.placeholder.com/500x500?text=HOK';
  const formatCurrency = (value?: number) =>
    (typeof value === 'number' ? value : 0).toLocaleString('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 });

  const { data: reviewData } = useQuery({
    queryKey: ['product-reviews', product?.id ?? 'unknown'],
    queryFn: () => hokApi.fetchProductReviews(product?.id as string),
    enabled: Boolean(product?.id),
  });

  const reviews: Review[] = Array.isArray(reviewData) ? reviewData : reviewData?.data ?? [];
  const averageRating =
    reviews.length > 0 ? reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviews.length : 0;
  const reviewCount = reviews.length;
  const isFavorite = product ? isWished(product.id) : false;

  useEffect(() => {
    setActiveIndex(0);
  }, [product?.id]);

  if (!product) return null;

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price ?? 0,
      image: cover,
    });
    onClose();
  };

  const handleToggleWishlist = () => {
    toggleItem({
      id: product.id,
      name: product.name,
      price: product.price ?? 0,
      image: cover,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-[1.05fr_0.95fr] gap-10">
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
          <div className="space-y-6 rounded-2xl bg-background/80 p-4 md:p-6 shadow-card border border-border/70">
            <DialogHeader className="space-y-2">
              <DialogTitle className="text-3xl font-bold text-foreground font-playfair leading-tight">
                {product.name}
              </DialogTitle>
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.round(averageRating) ? 'fill-red text-red' : 'text-muted-foreground'}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {reviewCount > 0
                    ? `${averageRating.toFixed(1)} • ${reviewCount} review${reviewCount === 1 ? '' : 's'}`
                    : 'No reviews yet'}
                </span>
              </div>
            </DialogHeader>

            <div className="text-3xl font-bold text-red font-playfair">
              {typeof product.price === 'number' ? formatCurrency(product.price) : 'Price on request'}
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

            {product.features && product.features.length > 0 && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg font-playfair">Features</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-red" />
                        <span className="text-sm font-inter">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            <Separator />

            <div className="space-y-3 pt-2">
              <Button
                variant="luxury"
                size="lg"
                className="w-full"
                onClick={handleAddToCart}
              >
                Add to Cart - {formatCurrency(product.price)}
              </Button>
              <Button
                variant={isFavorite ? 'outline' : 'elegant'}
                size="lg"
                className="w-full"
                onClick={handleToggleWishlist}
              >
                <Heart className={`mr-2 h-4 w-4 ${isFavorite ? 'fill-red text-red' : ''}`} />
                {isFavorite ? 'Saved to Wishlist' : 'Add to Wishlist'}
              </Button>
            </div>

            <Separator />

            <ProductReviews productId={product.id} productName={product.name} initialData={reviewData} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
