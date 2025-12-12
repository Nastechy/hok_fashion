import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductGrid } from '@/components/ProductGrid';
import { useProducts } from '@/hooks/useProducts';
import { SortOption } from '@/services/hokApi';
import { FilterSection } from '@/components/FilterSection';
import { ScrollToTopButton } from '@/components/ScrollToTopButton';

const Collections = () => {
  const { category = 'All' } = useParams();
  const normalizedCategory = decodeURIComponent(category);
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState(normalizedCategory || 'All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setSelectedCategory(normalizedCategory || 'All');
  }, [normalizedCategory]);

  useEffect(() => {
    const updateIsDesktop = () => setIsDesktop(window.matchMedia('(min-width: 768px)').matches);
    updateIsDesktop();
    window.addEventListener('resize', updateIsDesktop);
    return () => window.removeEventListener('resize', updateIsDesktop);
  }, []);

  const { products, isLoading, meta } = useProducts({
    category: selectedCategory === 'All' ? undefined : selectedCategory,
    search: searchQuery,
    sortOption: sortBy,
    limit: 12,
  });

  const formatCategoryLabel = (category: string) =>
    category.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
  const title = normalizedCategory === 'All' ? 'All Collections' : formatCategoryLabel(normalizedCategory);
  const emptyCopy = useMemo(() => {
    return `We don't have products under "${normalizedCategory}" yet. Please check back soon or explore our other collections.`;
  }, [normalizedCategory]);

  const handleCategoryChange = (nextCategory: string) => {
    setSelectedCategory(nextCategory);
    navigate(`/collections/${encodeURIComponent(nextCategory)}`);
  };

  const productCount = meta?.total ?? products.length;

  return (
    <div className="min-h-screen bg-background">
      <Header selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} />
      <main className="container px-1 md:px-8 py-12 lg:py-20">
        <div className="mb-8 ">
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground font-inter">Collections</p>
          <h1 className="text-4xl font-playfair font-bold mt-2 ">{title}</h1>
        </div>

        <div className="md:hidden mb-4 flex justify-end">
          <Button
            variant="luxury"
            size="sm"
            onClick={() => setShowMobileFilters((prev) => !prev)}
          >
            {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </div>

        {(isDesktop || showMobileFilters) && (
          <FilterSection
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            productCount={productCount}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        )}

        <ProductGrid
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          products={products}
          isLoading={isLoading}
          searchQuery={searchQuery}
          showAllOnMobile
        />

        {!isLoading && products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">{emptyCopy}</p>
          </div>
        )}
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default Collections;
