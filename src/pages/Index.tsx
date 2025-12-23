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
import { ScrollToTopButton } from '@/components/ScrollToTopButton';
import { useIsMobile } from '@/hooks/use-mobile';
import { useProducts } from '@/hooks/useProducts';
import { SortOption } from '@/services/hokApi';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllMobile, setShowAllMobile] = useState(false);
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
  const handleViewAll = () => {
    navigate('/collections/All', { replace: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen " >
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
          onShowAllChange={setShowAllMobile}
          footer={
            !isLoading && products.length > 0 && (!isMobile || showAllMobile) ? (
              <button
                onClick={handleViewAll}
                className="px-6 py-3 text-sm font-semibold rounded-full border border-border bg-background hover:bg-secondary transition-all shadow-lg"
              >
                View All Collections
              </button>
            ) : null
          }
        />
      </div>

      <CustomerReviews />
      <Features />
      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default Index;
