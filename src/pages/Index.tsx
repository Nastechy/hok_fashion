import { useState, useRef } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { NewArrivals } from '@/components/NewArrivals';
import { BestSellers } from '@/components/BestSellers';
import { ProductGrid } from '@/components/ProductGrid';
import { FilterSection } from '@/components/FilterSection';
import { CustomerReviews } from '@/components/CustomerReviews';
import { Features } from '@/components/Features';
import { Footer } from '@/components/Footer';
import { useIsMobile } from '@/hooks/use-mobile';
import { useProducts } from '@/hooks/useProducts';
import { SortOption } from '@/services/hokApi';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const productGridRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const { products, isLoading, meta } = useProducts({
    category: selectedCategory,
    search: searchQuery,
    sortOption: sortBy,
  });

  const filteredProductsCount = meta?.total ?? products.length;

  const handleExploreClick = () => {
    productGridRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onCategoryChange={setSelectedCategory} 
        selectedCategory={selectedCategory}
      />
      
      <Hero onExploreClick={handleExploreClick} />
      
      {/* Filter Section - after hero */}
      <FilterSection 
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        productCount={filteredProductsCount}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />
      
      <div ref={productGridRef}>
        <ProductGrid 
          selectedCategory={selectedCategory} 
          onCategoryChange={setSelectedCategory}
          searchQuery={searchQuery}
          products={products}
          isLoading={isLoading}
        />
      </div>

      <NewArrivals />
      <BestSellers />
      <CustomerReviews />
      <Features />
      <Footer />
    </div>
  );
};

export default Index;
