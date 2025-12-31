import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { hokApi, Order } from '@/services/hokApi';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
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
import { Calendar, Truck, User, FileText, ArrowLeft, ClipboardList } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import heroImage from '@/assets/hero-bag.jpg';

const OrderDetails = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: order, isLoading, isError } = useQuery<Order>({
    queryKey: ['order-detail', orderId],
    queryFn: () => hokApi.fetchOrder(orderId as string),
    enabled: Boolean(orderId),
  });
  const confirmOrderMutation = useMutation({
    mutationFn: (id: string) => hokApi.updateOrderStatus(id, 'CONFIRMED'),
    onSuccess: () => {
      toast({
        title: 'Order confirmed',
        description: 'The order status has been updated.',
      });
      queryClient.invalidateQueries({ queryKey: ['order-detail', orderId] });
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Confirmation failed',
        description: error?.message || 'Unable to confirm this order.',
        variant: 'destructive',
      });
    },
  });

  const formatCurrency = (value: number | undefined) =>
    Number(value || 0).toLocaleString('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 });

  const proofUrl = useMemo(() => order?.receiptUrl || order?.paymentProofUrl || order?.receipt, [order]);
  const firstItem = order?.items?.[0];
  const getProductImage = (item?: Order['items'][number]) =>
    item?.imageUrl ||
    item?.imageUrls?.[0] ||
    (Array.isArray(item?.image) ? item.image[0] : typeof item?.image === 'string' ? item.image : undefined) ||
    item?.product?.imageUrls?.[0] ||
    item?.product?.images?.[0] ||
    (Array.isArray(item?.product?.image) ? item?.product?.image?.[0] : typeof item?.product?.image === 'string' ? item.product.image : undefined) ||
    item?.product?.image_url ||
    item?.product?.mainImage ||
    heroImage;

  const primaryImage = getProductImage(firstItem);
  const productCode = firstItem?.productCode || firstItem?.product?.productCode || firstItem?.productId || '';
  const productName = firstItem?.productName || firstItem?.product?.name || productCode || 'Order';
  const itemCount = order?.items?.length || 0;
  const subtotal = order?.items?.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
    0
  ) || 0;
  const processingFee = Math.min(Math.round(subtotal * 0.015), 2000);
  const orderTotal = subtotal + processingFee;

  return (
    <div className="min-h-screen bg-background">
      <Header selectedCategory="All" />

      <main className="container mx-auto px-4 md:px-16 py-10">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-lg bg-white border border-border flex items-center justify-center">
                <ClipboardList className="h-7 w-7 text-red" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Order summary</p>
                <h1 className="text-3xl font-bold font-playfair">{order?.friendlyId || productName}</h1>
                <p className="text-sm text-muted-foreground">
                  {itemCount} item{itemCount === 1 ? '' : 's'}
                </p>
              </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              {order && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="luxury"
                      className="w-full sm:w-auto"
                      disabled={
                        confirmOrderMutation.isPending
                        || ['CONFIRMED', 'CANCELLED'].includes((order.status || '').toUpperCase())
                      }
                    >
                      {confirmOrderMutation.isPending ? 'Confirming...' : 'Confirm Order'}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm this order?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Confirming will update the order status and notify the customer by email.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => confirmOrderMutation.mutate(order.id)}
                      >
                        Yes, confirm
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              <Button
                variant="ghost"
                className="border bg-secondary/60 hover:bg-red w-full sm:w-auto justify-center"
                onClick={() => navigate('/admin?tab=orders')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </div>
          </div>

          {isLoading && (
            <div className="grid lg:grid-cols-[1fr,0.85fr] gap-6">
              <Card className="shadow-card">
                <CardHeader>
                  <div className="h-5 w-32 rounded skeleton-shimmer" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-20 rounded skeleton-shimmer" />
                    <div className="h-4 w-28 rounded skeleton-shimmer" />
                  </div>
                  <div className="h-48 rounded skeleton-shimmer" />
                </CardContent>
              </Card>
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <Card key={idx} className="shadow-card">
                    <CardHeader>
                      <div className="h-5 w-24 rounded skeleton-shimmer" />
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="h-4 w-40 rounded skeleton-shimmer" />
                      <div className="h-4 w-full rounded skeleton-shimmer" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
          {isError && <p className="text-destructive">Unable to load this order right now.</p>}

          {order && (
            <div className="grid lg:grid-cols-[1fr,0.85fr] gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-playfair">
                    <Truck className="h-5 w-5" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge>{order.status || 'PENDING'}</Badge>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-3">
                    {order.items?.map((item) => {
                      const thumb = item.productImage || getProductImage(item);
                      const variant = item.variant || item.product?.variants?.[0]?.name || item.product?.variants?.[0]?.sku;
                      const code = item.productCode || item.product?.productCode || item.productId;
                      const name = item.productName || item.product?.name || code || 'Product';
                      const productSlug = item.product?.slug;
                      const productLink = productSlug || item.productId;
                      return (
                        <button
                          key={`${item.productId}`}
                          type="button"
                          onClick={() => navigate(`/products/${productLink}`)}
                          className="flex w-full items-start gap-3 rounded-lg border border-border p-3 text-left transition-colors hover:bg-secondary/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-red/50"
                        >
                          <img
                            src={thumb}
                            alt={name}
                            className="h-16 w-16 rounded-md object-contain bg-white border"
                          />
                          <div className="flex-1 space-y-1 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold">{name}</span>
                              <span className="font-medium">{formatCurrency(item.price ? item.price * item.quantity : 0)}</span>
                            </div>
                            <p className="text-muted-foreground">Qty: {item.quantity}</p>
                            {variant && <p className="text-muted-foreground">Variant: {variant}</p>}
                            {item.product?.category && <p className="text-muted-foreground">Category: {item.product.category}</p>}
                            {code && <p className="text-muted-foreground">Product code: {code}</p>}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <Separator />
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-medium">{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Processing fee</span>
                      <span className="font-medium">{formatCurrency(processingFee)}</span>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-red">{formatCurrency(orderTotal)}</span>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Customer
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p className="font-semibold">{order.customerName || 'Guest'}</p>
                    <p className="text-muted-foreground">{order.customerEmail || 'Not provided'}</p>
                    {order.customerPhone && <p>{order.customerPhone}</p>}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Shipping Address</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p>{order.shippingAddress || order.billingAddress || 'Not provided'}</p>
                    {order.note && <p className="text-muted-foreground">Note: {order.note}</p>}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Payment Proof
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {proofUrl ? (
                      <>
                        <a
                          href={proofUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary hover:underline text-sm"
                        >
                          View/Download proof
                        </a>
                        {proofUrl.match(/\.(png|jpe?g|gif|webp)$/i) && (
                          <div className="rounded-lg border border-border overflow-hidden">
                            <img src={proofUrl} alt="Payment proof" className="w-full object-contain max-h-80" />
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">No payment proof uploaded.</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderDetails;
