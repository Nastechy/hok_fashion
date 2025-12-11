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
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const productGridRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { products, isLoading, meta } = useProducts({
    category: selectedCategory,
    search: searchQuery,
    sortOption: sortBy || 'newest',
    limit: 12,
  });

  const filteredProductsCount = meta?.total ?? products.length;

  const handleExploreClick = () => {
    productGridRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[hsl(0_0%_97%)] via-[hsl(0_0%_94%)] to-[hsl(0_40%_92%)]">
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
        <div className="flex justify-center mt-6">
          <button
            onClick={() => navigate('/collections/All')}
            className="px-6 py-3 text-sm font-semibold rounded-full border border-border bg-background hover:bg-secondary transition-all shadow-card"
          >
            View All Collections
          </button>
        </div>
      </div>

      {/* <NewArrivals /> */}
      {/* <BestSellers /> */}
      <CustomerReviews />
      <Features />
      <Footer />
    </div>
  );
};

export default Index;
