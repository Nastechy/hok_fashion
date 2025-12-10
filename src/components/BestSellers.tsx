import { ProductCard } from './ProductCard';
import { Product } from '@/services/hokApi';
import { useState } from 'react';
import { ProductModal } from './ProductModal';
import { useProducts } from '@/hooks/useProducts';

export const BestSellers = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { products: bestSellers, isLoading: loading } = useProducts({ isBestSeller: true, limit: 8, sortOption: 'featured' });

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  if (loading) return <div className="text-center py-10 md:py-16"><p className="text-xl text-muted-foreground">Loading best sellers...</p></div>;
  if (bestSellers.length === 0) return null;

  return (
    <>
      <section className="py-20 bg-background">
        <div className="container px-6  md:px-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4 font-playfair">
              Best Sellers
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-inter">
              Our most loved handbags, chosen by customers for their exceptional quality and style.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {bestSellers.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        </div>
      </section>

      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};
