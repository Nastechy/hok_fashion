/* eslint-disable @typescript-eslint/no-explicit-any */
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
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
  const [appliedRange, setAppliedRange] = useState({ startDate: '', endDate: '' });
  const [offlineOrder, setOfflineOrder] = useState({
    productId: '',
    quantity: '1',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
    note: '',
  });
  const [showOfflineForm, setShowOfflineForm] = useState(false);
  const [dispatchedIds, setDispatchedIds] = useState<Record<string, boolean>>({});
  const [deliveredIds, setDeliveredIds] = useState<Record<string, boolean>>({});
  const [actionOrder, setActionOrder] = useState<Order | null>(null);
  const [handledOrder, setHandledOrder] = useState<Order | null>(null);

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
      const statusCode = error?.statusCode || error?.status;
      const description =
        statusCode === 404
          ? "Order not found. Refresh the list and try again."
          : "Unable to update the order status right now. Please try again.";
      toast({ title: "Update failed", description, variant: "destructive" });
    },
  });
  const dispatchEmailMutation = useMutation({
    mutationFn: (id: string) => hokApi.sendOrderDispatchedEmail(id),
    onSuccess: (_, id) => {
      toast({ title: "Email sent", description: "Dispatched email sent to the customer." });
      setDispatchedIds((prev) => ({ ...prev, [id]: true }));
    },
    onError: (error: any) => {
      const statusCode = error?.statusCode || error?.status;
      const description =
        statusCode === 404
          ? "Order not found. Refresh the list and try again."
          : "Unable to send the dispatched email right now. Please try again.";
      toast({ title: "Email failed", description, variant: "destructive" });
    },
  });
  const deliveredEmailMutation = useMutation({
    mutationFn: (id: string) => hokApi.sendOrderDeliveredEmail(id),
    onSuccess: (_, id) => {
      toast({ title: "Email sent", description: "Received email sent to the customer." });
      setDeliveredIds((prev) => ({ ...prev, [id]: true }));
    },
    onError: (error: any) => {
      const statusCode = error?.statusCode || error?.status;
      const description =
        statusCode === 404
          ? "Order not found. Refresh the list and try again."
          : "Unable to send the delivered email right now. Please try again.";
      toast({ title: "Email failed", description, variant: "destructive" });
    },
  });
  const allowedStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED'];
  const handleStatusUpdate = (id: string, status: string) => {
    if (!allowedStatuses.includes(status)) {
      toast({
        title: 'Status unavailable',
        description: 'This status is not supported by the API yet.',
        variant: 'destructive',
      });
      return;
    }
    statusMutation.mutate({ id, status });
  };

  const confirmPaymentMutation = useMutation({
    mutationFn: ({ id, reference }: { id: string; reference?: string }) => hokApi.confirmOrderPayment(id, { reference }),
    onSuccess: () => {
      toast({ title: "Payment confirmed", description: "Payment marked as confirmed" });
      ordersQuery.refetch();
    },
    onError: (error: any) => {
      const statusCode = error?.statusCode || error?.status;
      const description =
        statusCode === 404
          ? "Order not found. Refresh the list and try again."
          : "Unable to confirm payment right now. Please try again.";
      toast({ title: "Payment update failed", description, variant: "destructive" });
    },
  });

  const createOfflineOrder = useMutation({
    mutationFn: async () => {
      const rawInput = (offlineOrder.productId || '').trim();

      const looksLikeId = /^[a-fA-F0-9]{24}$/.test(rawInput);
      let resolvedProductId = looksLikeId ? rawInput : '';

      // If the admin typed a code or name, try to resolve it to an id
      if (!resolvedProductId && rawInput) {
        try {
          const byCode = await hokApi.fetchProducts({ productCode: rawInput, limit: 1 });
          resolvedProductId = byCode.data?.[0]?.id || '';
        } catch {
          // ignore and try search
        }

        if (!resolvedProductId) {
          try {
            const bySearch = await hokApi.fetchProducts({ search: rawInput, limit: 1 });
            resolvedProductId = bySearch.data?.[0]?.id || '';
          } catch {
            // ignore
          }
        }
      }

      if (!resolvedProductId) {
        throw new Error('Enter a valid product ID or code. Could not find a matching product.');
      }

      return hokApi.createOrder(
        {
          items: [{ productId: resolvedProductId, quantity: Number(offlineOrder.quantity) || 1 }],
          shippingAddress: offlineOrder.shippingAddress,
          note: offlineOrder.note,
          customerEmail: offlineOrder.customerEmail,
          customerName: offlineOrder.customerName,
          customerPhone: offlineOrder.customerPhone,
        },
        false
      );
    },
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
      toast({
        title: "Creation failed",
        description: error?.message || "Could not create offline order",
        variant: "destructive",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch ((status || '').toLowerCase()) {
      case 'confirmed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'dispatched':
        return 'outline';
      case 'delivered':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getActorLabel = (value: unknown) => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'object') {
      const actor = value as { name?: string; fullName?: string; email?: string; id?: string };
      return actor.name || actor.fullName || actor.email || actor.id || '';
    }
    return '';
  };

  const getOrderActor = (order: Order, keys: string[]) => {
    for (const key of keys) {
      const label = getActorLabel((order as unknown as Record<string, unknown>)[key]);
      if (label) return label;
    }
    return '—';
  };

  const orders: Order[] = ordersQuery.data || [];
  const filteredOrders = orders.filter((order) => {
    if (!appliedRange.startDate && !appliedRange.endDate) return true;
    if (!order.createdAt) return false;
    const createdAt = new Date(order.createdAt).getTime();
    const start = appliedRange.startDate
      ? new Date(`${appliedRange.startDate}T00:00:00.000Z`).getTime()
      : undefined;
    const end = appliedRange.endDate
      ? new Date(`${appliedRange.endDate}T23:59:59.999Z`).getTime()
      : undefined;
    if (start && createdAt < start) return false;
    if (end && createdAt > end) return false;
    return true;
  });
  const getOrderSubtotal = (order: Order) =>
    order.items?.reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
      0
    ) || 0;
  const getProcessingFee = (order: Order) => Math.min(Math.round(getOrderSubtotal(order) * 0.015), 2000);
  const totalProcessingFees = metricsQuery.data?.totalProcessingFee
    ?? filteredOrders.reduce((sum, order) => sum + getProcessingFee(order), 0);

  const totalRevenue = metricsQuery.data?.totalRevenue ?? orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);
  const totalOrders = metricsQuery.data?.totalOrders ?? orders.length;
  const pendingOrders = metricsQuery.data?.pendingOrders ?? orders.filter(order => (order.status || '').toLowerCase() === 'pending').length;
  const formatCurrency = (value: number) =>
    value.toLocaleString('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-bold">Order Management</h2>
        <Button
          size="sm"
          variant={showOfflineForm ? 'outline' : 'default'}
          onClick={() => setShowOfflineForm((v) => !v)}
          className="w-full md:w-auto"
        >
          {showOfflineForm ? 'Hide Offline Order Form' : 'Create Offline Order'}
        </Button>
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
                  setAppliedRange({ startDate: '', endDate: '' });
                }}
              >
                Clear
              </Button>
              <Button onClick={() => setAppliedRange(dateFilter)}>
                Apply
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing Fees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalProcessingFees)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Offline Order Form */}
      {showOfflineForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create Offline Order</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Product ID or Code</Label>
              <Input
                value={offlineOrder.productId}
                onChange={(e) => setOfflineOrder(prev => ({ ...prev, productId: e.target.value }))}
                placeholder="Enter product ID or code"
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
      )}

      {/* Orders Table */}
      <Card>
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Recent Orders</CardTitle>
            {(appliedRange.startDate || appliedRange.endDate) && (
              <p className="text-sm text-muted-foreground">
                Showing orders
                {appliedRange.startDate ? ` from ${appliedRange.startDate}` : ''} 
                {appliedRange.endDate ? ` to ${appliedRange.endDate}` : ''}
              </p>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            {`${filteredOrders.length} order${filteredOrders.length === 1 ? '' : 's'}`}
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
                <TableHead>Handled By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-sm text-muted-foreground py-6">
                    No orders for this range. Try another date or clear filters.
                  </TableCell>
                </TableRow>
              )}
              {filteredOrders.map((order) => {
                const status = (order.status || '').toUpperCase();
                const isDispatched = Boolean(dispatchedIds[order.id]) || status === 'DISPATCHED';
                const isDelivered = Boolean(deliveredIds[order.id]) || status === 'RECEIVED';
                const canDispatch = status === 'CONFIRMED' && !isDispatched;
                const canDeliver = (status === 'DISPATCHED' || isDispatched) && !isDelivered;
                const confirmedBy = getOrderActor(order, [
                  'confirmedBy',
                  'confirmedByUser',
                  'confirmedByName',
                  'confirmedByEmail',
                  'confirmedById',
                ]);
                const dispatchedBy = getOrderActor(order, [
                  'dispatchedBy',
                  'dispatchedByUser',
                  'dispatchedByName',
                  'dispatchedByEmail',
                  'dispatchedById',
                ]);
                const deliveredBy = getOrderActor(order, [
                  'deliveredBy',
                  'receivedBy',
                  'deliveredByUser',
                  'receivedByUser',
                  'deliveredByName',
                  'receivedByName',
                  'deliveredByEmail',
                  'receivedByEmail',
                  'deliveredById',
                  'receivedById',
                ]);
                return (
                <TableRow key={order.id}>
                  {/*
                    Status flow: CONFIRMED -> DISPATCHED -> RECEIVED
                    Confirmation happens in Order Details.
                  */}
                  <TableCell className="font-mono text-sm">
                    {order.friendlyId || order.id}
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
                      <Button size="sm" variant="outline" onClick={() => setActionOrder(order)}>
                        Actions
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" onClick={() => setHandledOrder(order)}>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={Boolean(actionOrder)} onOpenChange={(open) => !open && setActionOrder(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order actions</DialogTitle>
            <DialogDescription>
              Update the status or send notifications for this order.
            </DialogDescription>
          </DialogHeader>
          {actionOrder && (
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium">Order:</span> {actionOrder.friendlyId || actionOrder.id}
              </div>
              <div>
                <span className="font-medium">Status:</span> {actionOrder.status || 'PENDING'}
              </div>
            </div>
          )}
          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:gap-3 sm:justify-start">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="min-w-[140px] w-full sm:w-auto border-green-600 text-green-700 hover:bg-green-600 hover:text-white"
                  disabled={
                    confirmPaymentMutation.isPending
                    || !actionOrder
                    || (actionOrder.status || '').toUpperCase() === 'CONFIRMED'
                  }
                >
                  Confirm Payment
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm payment?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Do you want to confirm payment for this order?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => {
                      if (!actionOrder) return;
                      confirmPaymentMutation.mutate({ id: actionOrder.id, reference: actionOrder.id });
                    }}
                  >
                    Yes, confirm
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="min-w-[140px] w-full sm:w-auto border-amber-600 text-amber-700 hover:bg-amber-600 hover:text-white"
                  disabled={
                    dispatchEmailMutation.isPending
                    || !actionOrder
                    || (() => {
                      const status = (actionOrder.status || '').toUpperCase();
                      const isDispatched = Boolean(dispatchedIds[actionOrder.id]) || status === 'DISPATCHED';
                      return !(status === 'CONFIRMED' && !isDispatched);
                    })()
                  }
                >
                  Mark Dispatched
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Mark as dispatched?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Do you want to mark this order as dispatched and notify the customer?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                    onClick={() => {
                      if (!actionOrder) return;
                      dispatchEmailMutation.mutate(actionOrder.id);
                    }}
                  >
                    Yes, dispatch
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="min-w-[140px] w-full sm:w-auto border-blue-600 text-blue-700 hover:bg-blue-600 hover:text-white"
                  disabled={
                    deliveredEmailMutation.isPending
                    || !actionOrder
                    || (() => {
                      const status = (actionOrder.status || '').toUpperCase();
                      const isDispatched = Boolean(dispatchedIds[actionOrder.id]) || status === 'DISPATCHED';
                      const isDelivered = Boolean(deliveredIds[actionOrder.id]) || status === 'RECEIVED';
                      return !((status === 'DISPATCHED' || isDispatched) && !isDelivered);
                    })()
                  }
                >
                  Mark Delivered
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Mark as delivered?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Do you want to mark this order as delivered and notify the customer?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => {
                      if (!actionOrder) return;
                      deliveredEmailMutation.mutate(actionOrder.id);
                    }}
                  >
                    Yes, deliver
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(handledOrder)} onOpenChange={(open) => !open && setHandledOrder(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Handled By</DialogTitle>
            <DialogDescription>
              Admins who updated this order.
            </DialogDescription>
          </DialogHeader>
          {handledOrder && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>Admin</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Confirmed</TableCell>
                  <TableCell>
                    {getOrderActor(handledOrder, ['confirmedBy', 'confirmedByUser', 'confirmedByName', 'confirmedByEmail', 'confirmedById'])}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Dispatched</TableCell>
                  <TableCell>
                    {getOrderActor(handledOrder, ['dispatchedBy', 'dispatchedByUser', 'dispatchedByName', 'dispatchedByEmail', 'dispatchedById'])}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Delivered</TableCell>
                  <TableCell>
                    {getOrderActor(handledOrder, ['deliveredBy', 'receivedBy', 'deliveredByUser', 'receivedByUser', 'deliveredByName', 'receivedByName', 'deliveredByEmail', 'receivedByEmail', 'deliveredById', 'receivedById'])}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setHandledOrder(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderManagement;
