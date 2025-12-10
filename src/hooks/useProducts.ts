import { useQuery } from '@tanstack/react-query';
import { hokApi, Product, ProductFilters } from '@/services/hokApi';

interface UseProductsResult {
  products: Product[];
  isLoading: boolean;
  meta?: { total?: number; page?: number; limit?: number };
  refetch: () => void;
}

export const useProducts = (filters: ProductFilters = {}): UseProductsResult => {
  const query = useQuery({
    queryKey: ['products', filters],
    queryFn: () => hokApi.fetchProducts(filters),
    keepPreviousData: true,
  });

  return {
    products: query.data?.data ?? [],
    isLoading: query.isLoading,
    meta: query.data?.meta,
    refetch: query.refetch,
  };
};
