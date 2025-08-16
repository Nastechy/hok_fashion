import { useState, useRef, useMemo } from 'react';
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
import { products } from '@/data/products';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const productGridRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const filteredProductsCount = useMemo(() => {
    let filtered = products;
    
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(product => 
        product.productCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered.length;
  }, [selectedCategory, searchQuery]);

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
      />
      
      <NewArrivals />
      <BestSellers />
      <div ref={productGridRef}>
        <ProductGrid 
          selectedCategory={selectedCategory} 
          onCategoryChange={setSelectedCategory}
          searchQuery={searchQuery}
        />
      </div>
      <CustomerReviews />
      <Features />
      <Footer />
    </div>
  );
};

export default Index;
