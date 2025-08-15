import { ProductCard } from './ProductCard';
import { products, Product } from '@/data/products';
import { useState } from 'react';
import { ProductModal } from './ProductModal';

export const NewArrivals = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const newArrivals = products.filter(product => product.isNewArrival);

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  if (newArrivals.length === 0) return null;

  return (
    <>
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4 font-playfair">
              New Arrivals
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-inter">
              Discover our latest collection of handcrafted handbags, fresh from our atelier.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {newArrivals.map((product) => (
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