import { useParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductGrid } from '@/components/ProductGrid';
import { useProducts } from '@/hooks/useProducts';
import { useMemo } from 'react';

const Collections = () => {
  const { category = 'All' } = useParams();
  const normalizedCategory = decodeURIComponent(category);
  const { products, isLoading } = useProducts({
    category: normalizedCategory === 'All' ? undefined : normalizedCategory,
  });

  const title = normalizedCategory === 'All' ? 'All Collections' : normalizedCategory;
  const emptyCopy = useMemo(() => {
    return `We don't have products under "${normalizedCategory}" yet. Please check back soon or explore our other collections.`;
  }, [normalizedCategory]);

  return (
    <div className="min-h-screen bg-background">
      <Header selectedCategory={normalizedCategory} />
      <main className="container mx-auto px-4 lg:px-8 py-6 lg:py-12">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground font-inter">Collections</p>
          <h1 className="text-4xl font-playfair font-bold mt-2">{title}</h1>
        </div>

        <ProductGrid
          selectedCategory={normalizedCategory}
          onCategoryChange={() => {}}
          products={products}
          isLoading={isLoading}
          searchQuery=""
        />

        {!isLoading && products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">{emptyCopy}</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Collections;
