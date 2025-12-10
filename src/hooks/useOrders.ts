import { useQuery } from '@tanstack/react-query';
import { hokApi, Order } from '@/services/hokApi';

export const useOrders = (status?: string, enabled: boolean = true) => {
  return useQuery<Order[]>({
    queryKey: ['orders', status],
    queryFn: () => hokApi.fetchOrders(status),
    staleTime: 30_000,
    enabled,
  });
};
