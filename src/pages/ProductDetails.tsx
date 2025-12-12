import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { hokApi, Product } from '@/services/hokApi';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Check, Heart, Star } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { ProductReviews } from '@/components/ProductReviews';
import { useNavigate } from 'react-router-dom';

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [activeIndex, setActiveIndex] = useState(0);
  const { addItem } = useCart();
  const { toggleItem, isWished } = useWishlist();
  const navigate = useNavigate();

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => hokApi.fetchProduct(id || ''),
    enabled: Boolean(id),
  });

  const images = useMemo(() => (product ? product.images || product.imageUrls || [] : []), [product]);
  const cover = images[activeIndex] || 'https://via.placeholder.com/500x500?text=HOK';
  const isFavorite = product ? isWished(product.id) : false;

  const formatCurrency = (value?: number) =>
    (typeof value === 'number' ? value : 0).toLocaleString('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 });

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      id: product.id,
      name: product.name,
      price: product.price ?? 0,
      image: cover,
    });
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    toggleItem({
      id: product.id,
      name: product.name,
      price: product.price ?? 0,
      image: cover,
    });
  };

  if (isLoading || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container px-4 md:px-10 py-10 lg:py-14">
          <div className="mb-4">
            <div className="h-9 w-20 rounded-md skeleton-shimmer" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[1.05fr_0.95fr] gap-10">
            <div className="space-y-4">
              <div className="relative rounded-lg bg-white p-2">
                <div className="w-full h-[420px] md:h-[520px] rounded-md skeleton-shimmer" />
                <div className="absolute top-4 left-4 h-8 w-24 rounded-full skeleton-shimmer" />
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="h-20 sm:h-24 rounded-md skeleton-shimmer" />
                ))}
              </div>
            </div>

            <div className="space-y-4 rounded-2xl bg-background/80 p-4 md:p-6 shadow-card border border-border/70">
              <div className="space-y-3">
                <div className="h-8 w-3/4 rounded skeleton-shimmer" />
                <div className="h-4 w-32 rounded skeleton-shimmer" />
              </div>
              <div className="h-10 w-40 rounded skeleton-shimmer" />
              <div className="space-y-3">
                <div className="h-4 w-20 rounded skeleton-shimmer" />
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <div key={idx} className="h-8 w-20 rounded-full skeleton-shimmer" />
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="h-4 w-full rounded skeleton-shimmer" />
                ))}
              </div>
              <div className="space-y-3 pt-2">
                <div className="h-11 w-full rounded-md skeleton-shimmer" />
                <div className="h-11 w-full rounded-md skeleton-shimmer" />
              </div>
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div key={idx} className="h-4 w-3/4 rounded skeleton-shimmer" />
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container px-4 md:px-10 py-10 lg:py-14">
        <div className="mb-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            ← Back
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-[1.05fr_0.95fr] gap-10">
          <div className="space-y-4">
            <div className="relative rounded-lg bg-white p-2">
              <img
                src={cover}
                alt={product.name}
                className="w-full h-[420px] md:h-[520px] object-contain rounded-md shadow-elegant"
              />
              <Badge className="absolute top-4 left-4 bg-red text-red-foreground font-inter font-medium">
                {product.category ? product.category.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()) : ''}
              </Badge>
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {images.map((img, idx) => (
                  <button
                    key={img + idx}
                    className={`h-20 sm:h-24 rounded-md overflow-hidden border bg-white transition-all ${
                      idx === activeIndex ? 'border-red shadow-elegant' : 'border-transparent hover:border-border'
                    }`}
                    onClick={() => setActiveIndex(idx)}
                  >
                    <img
                      src={img}
                      alt={`${product.name}-${idx}`}
                      className="h-full w-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6 rounded-2xl bg-background/80 p-4 md:p-6 shadow-card border border-border/70">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground font-playfair leading-tight">{product.name}</h1>
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 text-red fill-red"
                    />
                  ))}
                </div>
              </div>
            </div>

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
                Add to Cart {typeof product.price === 'number' ? `- ${formatCurrency(product.price)}` : ''}
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

            <ProductReviews productId={product.id} productName={product.name} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetails;
