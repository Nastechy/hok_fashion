import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Package, DollarSign, Calendar, User, FileText } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { hokApi, Order } from '@/services/hokApi';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';

const OrderManagement = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [dateFilter, setDateFilter] = useState({ startDate: '', endDate: '' });
  const [offlineOrder, setOfflineOrder] = useState({
    productId: '',
    quantity: '1',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
    note: '',
  });

  const ordersQuery = useQuery({
    queryKey: ['admin-orders', dateFilter.startDate, dateFilter.endDate],
    queryFn: () => {
      const start = dateFilter.startDate ? `${dateFilter.startDate}T00:00:00.000Z` : undefined;
      const end = dateFilter.endDate ? `${dateFilter.endDate}T23:59:59.999Z` : undefined;
      return hokApi.fetchOrders(undefined, start, end);
    },
  });

  const metricsQuery = useQuery({
    queryKey: ['admin-metrics'],
    queryFn: () => hokApi.fetchMetricsOverview(),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => hokApi.updateOrderStatus(id, status),
    onSuccess: () => {
      toast({ title: "Order updated", description: "Status updated successfully" });
      ordersQuery.refetch();
    },
    onError: (error: any) => {
      toast({ title: "Update failed", description: error?.message || "Could not update status", variant: "destructive" });
    },
  });

  const confirmPaymentMutation = useMutation({
    mutationFn: ({ id, reference }: { id: string; reference?: string }) => hokApi.confirmOrderPayment(id, { reference }),
    onSuccess: () => {
      toast({ title: "Payment confirmed", description: "Payment marked as confirmed" });
      ordersQuery.refetch();
    },
    onError: (error: any) => {
      toast({ title: "Payment update failed", description: error?.message || "Could not confirm payment", variant: "destructive" });
    },
  });

  const createOfflineOrder = useMutation({
    mutationFn: () => hokApi.createOrder(
      {
        items: [{ productId: offlineOrder.productId, quantity: Number(offlineOrder.quantity) || 1 }],
        shippingAddress: offlineOrder.shippingAddress,
        note: offlineOrder.note,
        customerEmail: offlineOrder.customerEmail,
        customerName: offlineOrder.customerName,
        customerPhone: offlineOrder.customerPhone,
      },
      false
    ),
    onSuccess: () => {
      toast({ title: "Order created", description: "Offline order recorded successfully" });
      setOfflineOrder({
        productId: '',
        quantity: '1',
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        shippingAddress: '',
        note: '',
      });
      ordersQuery.refetch();
    },
    onError: (error: any) => {
      toast({ title: "Creation failed", description: error?.message || "Could not create offline order", variant: "destructive" });
    },
  });

  const getStatusColor = (status: string) => {
    switch ((status || '').toLowerCase()) {
      case 'confirmed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const orders: Order[] = ordersQuery.data || [];
  const totalRevenue = metricsQuery.data?.totalRevenue ?? orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);
  const totalOrders = metricsQuery.data?.totalOrders ?? orders.length;
  const pendingOrders = metricsQuery.data?.pendingOrders ?? orders.filter(order => (order.status || '').toLowerCase() === 'pending').length;
  const formatCurrency = (value: number) =>
    value.toLocaleString('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Order Management</h2>
      </div>

      {ordersQuery.isLoading ? (
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <Card key={idx} className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-32 rounded skeleton-shimmer" />
                <div className="h-4 w-6 rounded skeleton-shimmer" />
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="h-4 w-24 rounded skeleton-shimmer" />
                <div className="h-24 rounded skeleton-shimmer" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Filters</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 md:flex-row md:items-end">
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <Label htmlFor="start-date">Start date</Label>
            <Input
              id="start-date"
              type="date"
              value={dateFilter.startDate}
              onChange={(e) => setDateFilter((prev) => ({ ...prev, startDate: e.target.value }))}
            />
          </div>
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <Label htmlFor="end-date">End date</Label>
            <Input
              id="end-date"
              type="date"
              value={dateFilter.endDate}
              onChange={(e) => setDateFilter((prev) => ({ ...prev, endDate: e.target.value }))}
            />
          </div>
          <div className="flex flex-col gap-2 md:ml-auto">
            <Label className="invisible">Actions</Label>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setDateFilter({ startDate: '', endDate: '' });
                }}
              >
                Clear
              </Button>
              <Button onClick={() => ordersQuery.refetch()} disabled={ordersQuery.isFetching}>
                {ordersQuery.isFetching ? 'Filtering...' : 'Apply'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            {/* <DollarSign className="h-4 w-4 text-muted-foreground" /> */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(Number(totalRevenue))}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingOrders}</div>
          </CardContent>
        </Card>
      </div>

      {/* Offline Order Form */}
      <Card>
        <CardHeader>
          <CardTitle>Create Offline Order</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Product ID</Label>
            <Input
              value={offlineOrder.productId}
              onChange={(e) => setOfflineOrder(prev => ({ ...prev, productId: e.target.value }))}
              placeholder="Product ID"
            />
          </div>
          <div>
            <Label>Quantity</Label>
            <Input
              type="number"
              value={offlineOrder.quantity}
              onChange={(e) => setOfflineOrder(prev => ({ ...prev, quantity: e.target.value }))}
              min={1}
            />
          </div>
          <div>
            <Label>Shipping Address</Label>
            <Input
              value={offlineOrder.shippingAddress}
              onChange={(e) => setOfflineOrder(prev => ({ ...prev, shippingAddress: e.target.value }))}
              placeholder="Address"
            />
          </div>
          <div>
            <Label>Customer Name</Label>
            <Input
              value={offlineOrder.customerName}
              onChange={(e) => setOfflineOrder(prev => ({ ...prev, customerName: e.target.value }))}
              placeholder="Full name"
            />
          </div>
          <div>
            <Label>Customer Email</Label>
            <Input
              value={offlineOrder.customerEmail}
              onChange={(e) => setOfflineOrder(prev => ({ ...prev, customerEmail: e.target.value }))}
              placeholder="email@example.com"
            />
          </div>
          <div>
            <Label>Customer Phone</Label>
            <Input
              value={offlineOrder.customerPhone}
              onChange={(e) => setOfflineOrder(prev => ({ ...prev, customerPhone: e.target.value }))}
              placeholder="+1234567890"
            />
          </div>
          <div className="md:col-span-3">
            <Label>Note</Label>
            <Input
              value={offlineOrder.note}
              onChange={(e) => setOfflineOrder(prev => ({ ...prev, note: e.target.value }))}
              placeholder="Optional note"
            />
          </div>
          <div className="md:col-span-3">
            <Button onClick={() => createOfflineOrder.mutate()} disabled={createOfflineOrder.isPending}>
              {createOfflineOrder.isPending ? 'Creating...' : 'Create Offline Order'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Recent Orders</CardTitle>
            {(dateFilter.startDate || dateFilter.endDate) && (
              <p className="text-sm text-muted-foreground">
                Showing orders
                {dateFilter.startDate ? ` from ${dateFilter.startDate}` : ''} 
                {dateFilter.endDate ? ` to ${dateFilter.endDate}` : ''}
              </p>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            {ordersQuery.isFetching ? 'Refreshing...' : `${orders.length} order${orders.length === 1 ? '' : 's'}`}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment Proof</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-sm text-muted-foreground py-6">
                    No orders for this range. Try another date or clear filters.
                  </TableCell>
                </TableRow>
              )}
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-sm">
                    {order.id.slice(0, 8)}...
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">
                          {order.customerName || 'Guest'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {order.customerEmail || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(Number(order.totalAmount || 0))}
                  </TableCell>
                  <TableCell>
                    {order.receiptUrl || order.paymentProofUrl ? (
                      <Badge variant="secondary">Uploaded</Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">Not uploaded</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(order.status || '')}>
                      {order.status || 'PENDING'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => statusMutation.mutate({ id: order.id, status: 'CONFIRMED' })}
                      >
                       Confirm Order
                      </Button>
                      {/* <Button
                        size="sm"
                        variant="outline"
                        onClick={() => confirmPaymentMutation.mutate({ id: order.id, reference: order.id })}
                      >
                        Confirm Payment
                      </Button> */}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="justify-start px-2 border bg-secondary/70 hover:bg-red"
                        onClick={() => navigate(`/orders/${order.id}`)}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        View details
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderManagement;
