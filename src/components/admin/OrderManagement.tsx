import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Package, DollarSign, Calendar, User } from 'lucide-react';
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

const OrderManagement = () => {
  const { toast } = useToast();
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
    queryKey: ['admin-orders'],
    queryFn: () => hokApi.fetchOrders(),
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
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
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
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
                  <TableCell>
                    <div className="space-y-1">
                      {order.items?.map((item, index) => (
                        <div key={index} className="text-sm">
                          {item.quantity}x {item.product?.name || item.productId}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(Number(order.totalAmount || 0))}
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
                        Mark Confirmed
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => confirmPaymentMutation.mutate({ id: order.id, reference: order.id })}
                      >
                        Confirm Payment
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
