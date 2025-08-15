import { useState, useRef } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { ProductGrid } from '@/components/ProductGrid';
import { Features } from '@/components/Features';
import { Footer } from '@/components/Footer';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const productGridRef = useRef<HTMLDivElement>(null);

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
      <div ref={productGridRef}>
        <ProductGrid selectedCategory={selectedCategory} />
      </div>
      <Features />
      <Footer />
    </div>
  );
};

export default Index;
