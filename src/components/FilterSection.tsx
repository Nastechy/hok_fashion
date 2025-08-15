import { useState } from 'react';
import { Filter, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { categories } from '@/data/products';

interface FilterSectionProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  productCount: number;
}

export const FilterSection = ({ selectedCategory, onCategoryChange, productCount }: FilterSectionProps) => {
  const [sortBy, setSortBy] = useState('featured');

  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'name', label: 'Name A-Z' },
  ];

  return (
    <section className="py-8 bg-secondary/20">
      <div className="container mx-auto px-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              {/* Filter Info */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red/10 rounded-full flex items-center justify-center">
                  <Filter className="h-5 w-5 text-red" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground font-playfair">
                    Filter Products
                  </h3>
                  <p className="text-sm text-muted-foreground font-inter">
                    {productCount} products found in {selectedCategory === 'All' ? 'all categories' : selectedCategory}
                  </p>
                </div>
              </div>

              {/* Filter Controls */}
              <div className="flex flex-wrap gap-3">
                {/* Category Filter */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="font-inter">
                      Category: {selectedCategory}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {categories.map((category) => (
                      <DropdownMenuItem
                        key={category}
                        onClick={() => onCategoryChange(category)}
                        className={`font-inter ${
                          selectedCategory === category ? 'bg-red/10 text-red' : ''
                        }`}
                      >
                        {category}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Sort Filter */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="font-inter">
                      Sort by: {sortOptions.find(option => option.value === sortBy)?.label}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {sortOptions.map((option) => (
                      <DropdownMenuItem
                        key={option.value}
                        onClick={() => setSortBy(option.value)}
                        className={`font-inter ${
                          sortBy === option.value ? 'bg-red/10 text-red' : ''
                        }`}
                      >
                        {option.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Clear Filters */}
                {selectedCategory !== 'All' && (
                  <Button
                    variant="ghost"
                    onClick={() => onCategoryChange('All')}
                    className="text-red hover:text-red hover:bg-red/10 font-inter"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};