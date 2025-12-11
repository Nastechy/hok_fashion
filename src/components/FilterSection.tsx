import { Filter, ChevronDown, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { SortOption } from '@/services/hokApi';

interface FilterSectionProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  productCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'name', label: 'Name A-Z' },
  { value: 'newest', label: 'Newest' },
];

const categories = ['All', 'AVAILABLE', 'BEST_SELLER', 'NEW_ARRIVAL', 'FEATURE', 'INCOMING'];
const formatCategoryLabel = (category: string) =>
  category
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());

export const FilterSection = ({ selectedCategory, onCategoryChange, productCount, searchQuery, onSearchChange, sortBy, onSortChange }: FilterSectionProps) => {

  return (
    <section className="py-12 bg-gradient-subtle border-b border-border/50">
      <div className="container px-6  md:px-16">
        <div className="bg-card rounded-2xl border border-border/50 shadow-elegant backdrop-blur-sm">
          <div className="p-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              {/* Filter Info */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                  <Filter className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-1 font-playfair">
                    Collection Filter
                  </h2>
                  <p className="text-muted-foreground font-inter">
                    {productCount} {productCount === 1 ? 'product' : 'products'} found
                    {selectedCategory !== 'All' && (
                      <span className="ml-1">in <span className="text-primary font-medium">{selectedCategory}</span></span>
                    )}
                  </p>
                </div>
              </div>

              {/* Filter Controls */}
              <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                {/* Search by Product Code */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by product code..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-10 font-inter bg-background/50 border-border/50 focus:border-primary/20 transition-all duration-300"
                  />
                </div>

                {/* Category Filter */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="font-inter bg-background/50 hover:bg-background border-border/50 hover:border-primary/20 transition-all duration-300"
                    >
                      Category: {selectedCategory}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-background/95 backdrop-blur-sm border-border/50">
                    {categories.map((category) => (
                      <DropdownMenuItem
                        key={category}
                        onClick={() => onCategoryChange(category)}
                        className={`font-inter transition-colors ${
                          selectedCategory === category 
                            ? 'bg-primary/10 text-primary font-medium' 
                            : 'hover:bg-muted/50'
                        }`}
                      >
                        {formatCategoryLabel(category)}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Sort Filter */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="font-inter bg-background/50 hover:bg-background border-border/50 hover:border-primary/20 transition-all duration-300"
                    >
                      Sort: {sortOptions.find(option => option.value === sortBy)?.label}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-background/95 backdrop-blur-sm border-border/50">
                    {sortOptions.map((option) => (
                      <DropdownMenuItem
                        key={option.value}
                        onClick={() => onSortChange(option.value)}
                        className={`font-inter transition-colors ${
                          sortBy === option.value 
                            ? 'bg-primary/10 text-primary font-medium' 
                            : 'hover:bg-muted/50'
                        }`}
                      >
                        {option.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Clear Filters */}
                {(selectedCategory !== 'All' || searchQuery) && (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      onCategoryChange('All');
                      onSearchChange('');
                    }}
                    className="text-primary hover:text-primary hover:bg-primary/10 font-inter transition-all duration-300"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
