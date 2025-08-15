import { useState, useRef } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { FilterSection } from '@/components/FilterSection';
import { NewArrivals } from '@/components/NewArrivals';
import { BestSellers } from '@/components/BestSellers';
import { ProductGrid } from '@/components/ProductGrid';
import { CustomerReviews } from '@/components/CustomerReviews';
import { Features } from '@/components/Features';
import { Footer } from '@/components/Footer';
import { useIsMobile } from '@/hooks/use-mobile';
import { products } from '@/data/products';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const productGridRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const filteredProducts = products.filter(product => 
    selectedCategory === 'All' ? true : product.category === selectedCategory
  );

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
      
      {/* Mobile Filter Section - appears after hero */}
      {isMobile && (
        <FilterSection 
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          productCount={filteredProducts.length}
        />
      )}
      
      <NewArrivals />
      <BestSellers />
      <div ref={productGridRef}>
        <ProductGrid 
          selectedCategory={selectedCategory} 
          onCategoryChange={setSelectedCategory}
        />
      </div>
      <CustomerReviews />
      <Features />
      <Footer />
    </div>
  );
};

export default Index;
