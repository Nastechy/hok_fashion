import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { hokApi, Order } from '@/services/hokApi';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Calendar, Truck, User, FileText, ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const OrderDetails = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const confirmPayment = useMutation({
    mutationFn: () => hokApi.confirmOrderPayment(orderId as string, { reference: orderId }),
    onSuccess: () => {
      toast({
        title: 'Payment confirmed',
        description: 'The order has been marked as paid.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Unable to confirm payment',
        description: error?.message || 'Please try again.',
        variant: 'destructive',
      });
    },
  });

  const { data: order, isLoading, isError } = useQuery<Order>({
    queryKey: ['order-detail', orderId],
    queryFn: () => hokApi.fetchOrder(orderId as string),
    enabled: Boolean(orderId),
  });

  const formatCurrency = (value: number | undefined) =>
    Number(value || 0).toLocaleString('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 });

  const proofUrl = useMemo(() => order?.receiptUrl || order?.paymentProofUrl || order?.receipt, [order]);
  const firstItem = order?.items?.[0];
  const primaryImage = firstItem?.product?.imageUrls?.[0] || '';
  const productName = firstItem?.product?.name || firstItem?.productId || 'Order';
  const itemCount = order?.items?.length || 0;

  return (
    <div className="min-h-screen bg-background">
      <Header selectedCategory="All" />

      <main className="container mx-auto px-4 md:px-16 py-10">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
            <div className="flex items-center gap-4">
              {primaryImage ? (
                <img src={primaryImage} alt={productName} className="h-14 w-14 rounded-lg object-cover border border-border" />
              ) : (
                <div className="h-14 w-14 rounded-lg bg-secondary border border-border" />
              )}
              <div>
                <p className="text-sm text-muted-foreground mb-1">Order summary</p>
                <h1 className="text-3xl font-bold font-playfair">{productName}</h1>
                <p className="text-sm text-muted-foreground">
                  {itemCount} item{itemCount === 1 ? '' : 's'}
                </p>
              </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="ghost"
                className="border bg-secondary/60 hover:bg-red w-full sm:w-auto justify-center"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                variant="outline"
                className="w-full sm:w-auto justify-center"
                onClick={() => confirmPayment.mutate()}
                disabled={confirmPayment.isPending}
              >
                {confirmPayment.isPending ? 'Confirming...' : 'Confirm Payment'}
              </Button>
            </div>
          </div>

          {isLoading && <p className="text-muted-foreground">Loading order...</p>}
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
                      const thumb = item.product?.imageUrls?.[0] || item.product?.images?.[0] || '';
                      const variant = item.variant || item.product?.variants?.[0]?.name || item.product?.variants?.[0]?.sku;
                      return (
                        <div key={`${item.productId}`} className="flex items-start gap-3 rounded-lg border border-border p-3">
                          {thumb ? (
                            <img src={thumb} alt={item.product?.name || 'Product'} className="h-16 w-16 rounded-md object-contain bg-white border" />
                          ) : (
                            <div className="h-16 w-16 rounded-md bg-secondary border flex items-center justify-center text-[10px] text-muted-foreground">
                              No Image
                            </div>
                          )}
                          <div className="flex-1 space-y-1 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold">{item.product?.name || item.productId}</span>
                              <span className="font-medium">{formatCurrency(item.price ? item.price * item.quantity : 0)}</span>
                            </div>
                            <p className="text-muted-foreground">Qty: {item.quantity}</p>
                            {variant && <p className="text-muted-foreground">Variant: {variant}</p>}
                            {item.product?.category && <p className="text-muted-foreground">Category: {item.product.category}</p>}
                            {item.product?.productCode && <p className="text-muted-foreground">Product code: {item.product.productCode}</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-red">{formatCurrency(order.totalAmount)}</span>
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
                    <CardTitle>Billing Address</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p>{order.billingAddress || order.shippingAddress || 'Not provided'}</p>
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
