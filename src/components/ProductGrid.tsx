import { useState, useMemo } from 'react';
import { ProductCard } from './ProductCard';
import { ProductModal } from './ProductModal';
import { products, Product } from '@/data/products';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProductGridProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export const ProductGrid = ({ selectedCategory, onCategoryChange }: ProductGridProps) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const isMobile = useIsMobile();

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'All') {
      return products;
    }
    return products.filter(product => product.category === selectedCategory);
  }, [selectedCategory]);

  const displayedProducts = useMemo(() => {
    if (!isMobile || showAll) {
      return filteredProducts;
    }
    return filteredProducts.slice(0, 5);
  }, [filteredProducts, isMobile, showAll]);

  // Reset showAll when category changes
  useMemo(() => {
    setShowAll(false);
  }, [selectedCategory]);

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <>
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4 font-playfair">
              {selectedCategory === 'All' ? 'Our Collection' : selectedCategory}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-inter">
              Discover handcrafted luxury bags that combine timeless elegance with modern functionality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {displayedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>

          {/* View More button for mobile */}
          {isMobile && !showAll && filteredProducts.length > 5 && (
            <div className="text-center mt-8">
              <Button 
                variant="outline" 
                onClick={() => setShowAll(true)}
                className="px-8 py-2"
              >
                View More ({filteredProducts.length - 5} more products)
              </Button>
            </div>
          )}

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">
                No products found in this category.
              </p>
            </div>
          )}
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