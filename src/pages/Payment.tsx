/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { CreditCard, Lock, Truck, Upload } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { hokApi } from '@/services/hokApi';
import { useMutation } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Payment = () => {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    note: '',
  });
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [showDeliveryNotice, setShowDeliveryNotice] = useState(false);
  const [shouldNavigateAfterNotice, setShouldNavigateAfterNotice] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const receiptInputRef = useRef<HTMLInputElement | null>(null);

  const isGuest = !user;

  const checkoutMutation = useMutation({
    mutationFn: () =>
      hokApi.createOrder(
        {
          items: items.map(item => ({
            productId: item.productId || item.id,
            variantId: item.variantId,
            quantity: item.quantity,
          })),
          shippingAddress: form.address,
          note: form.note,
          receiptFile,
          customerEmail: isGuest ? form.email : undefined,
          customerName: isGuest ? `${form.firstName} ${form.lastName}`.trim() : undefined,
          customerPhone: isGuest ? form.phone : undefined,
        },
        isGuest
      ),
    onSuccess: () => {
      toast({
        title: "Order sent",
        description: "Your order has been submitted successfully.",
      });
      setOrderSubmitted(true);
      clearCart();
      setShowDeliveryNotice(true);
      setShouldNavigateAfterNotice(true);
    },
    onError: (error: any) => {
      toast({
        title: "Checkout failed",
        description: error?.message || "We couldn't place your order. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (!items.length) {
      toast({
        title: "Your cart is empty",
        description: "Add some products before checking out.",
        variant: "destructive",
      });
      return;
    }

    if (isGuest && (!form.email || !form.firstName || !form.lastName)) {
      toast({
        title: "Contact info required",
        description: "Please provide your name and email for guest checkout.",
        variant: "destructive",
      });
      return;
    }

    if (!form.firstName || !form.lastName || !form.phone || !form.address || !(form.email || user?.email)) {
      toast({
        title: "Billing details missing",
        description: "Please fill first name, last name, phone, email, and address before submitting.",
        variant: "destructive",
      });
      return;
    }

    if (!receiptFile) {
      toast({
        title: "Receipt required",
        description: "Upload your payment receipt before submitting.",
        variant: "destructive",
      });
      return;
    }

    checkoutMutation.mutate();
  };

  const formatCurrency = (value: number) =>
    value.toLocaleString('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 });
  const processingFee = Math.min(Math.round(total * 0.015), 2000);
  const checkoutTotal = total + processingFee;

  return (
    <div className="min-h-screen bg-background">
      <Header onCategoryChange={() => {}} selectedCategory="All" />
      
      <main className="container mx-auto px-0 md:px-16 py-10 overflow-x-hidden">
        <div className="max-w-6xl w-full mx-auto">
          <div className="mb-12 flex items-center justify-between gap-4 px-2 sm:px-0">
            <h1 className="text-2xl sm:text-4xl font-bold font-playfair">Checkout</h1>
            <Button
              variant="luxury"
              className="shrink-0"
              type="button"
              onClick={() => navigate('/collections/All')}
            >
              Continue Shopping
            </Button>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-start w-full">
            {/* Order Summary */}
            <div className="space-y-6 lg:sticky lg:top-24 w-full">
              <Card className="w-full shadow-card overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-playfair">
                    <Truck className="h-5 w-5" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded border"
                        />
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          {item.variantName && (
                            <p className="text-xs text-muted-foreground">Colour: {item.variantName}</p>
                          )}
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-semibold self-start sm:self-auto">{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Processing fee</span>
                    <span>{formatCurrency(processingFee)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total</span>
                    <span className="text-red">{formatCurrency(checkoutTotal)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Billing + Payment Form */}
            <div className="space-y-6 w-full">
              {/* Billing Address */}
              <Card className="w-full overflow-hidden">
                <CardHeader>
                  <CardTitle className="font-playfair">Billing Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input id="first-name" className="h-12" value={form.firstName} onChange={handleInputChange('firstName')} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input id="last-name" className="h-12" value={form.lastName} onChange={handleInputChange('lastName')} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" className="h-12" value={form.email || user?.email || ''} onChange={handleInputChange('email')} disabled={!isGuest} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" className="h-12" value={form.phone} onChange={handleInputChange('phone')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Shipping Address</Label>
                    <Input id="address" className="h-12" value={form.address} onChange={handleInputChange('address')} placeholder="Enter your shipping address" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="note">Order Note</Label>
                    <Input id="note" className="h-12" value={form.note} onChange={handleInputChange('note')} placeholder="Optional note for your order" />
                  </div>
                </CardContent>
              </Card>

              <Card className="w-full overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-playfair">
                    <CreditCard className="h-5 w-5" />
                    Payment Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Kindly transfer the total to the account below and upload your payment receipt for confirmation.
                    </p>
                    <div className="rounded-xl border border-border p-4 bg-secondary/40 space-y-2">
                      <p className="text-sm font-semibold">Okeke Anulika Happiness</p>
                      <p className="text-sm">Account Number: <span className="font-semibold">2007114694</span></p>
                      <p className="text-sm">Bank: Kuda Bank</p>
                      <p className="text-sm">Reference: <span className="font-semibold">Order Payment</span></p>
                      <p className="text-sm">Amount: <span className="font-semibold">{formatCurrency(checkoutTotal)}</span></p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="receipt">Upload Payment Receipt (required)</Label>
                    <div className="flex items-center gap-3">
                      <Input
                        ref={receiptInputRef}
                        id="receipt"
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                        className="sr-only"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="h-10"
                        onClick={() => receiptInputRef.current?.click()}
                      >
                        Choose file
                      </Button>
                      <span className="text-xs text-muted-foreground">
                        {receiptFile ? receiptFile.name : 'No file chosen'}
                      </span>
                      <Upload className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Accepted: images or PDF. You must upload proof before submitting.
                    </p>
                    {receiptFile && (
                      <p className="text-xs text-foreground">Selected: {receiptFile.name}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Lock className="h-4 w-4" />
                    Your payment details will be verified by our team.
                  </div>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        className="w-full h-12 text-lg font-semibold"
                        size="lg"
                        type="button"
                        disabled={checkoutMutation.isPending || !receiptFile || orderSubmitted}
                      >
                        {orderSubmitted
                          ? 'Checkout completed'
                          : checkoutMutation.isPending
                            ? 'Processing...'
                            : `Complete Checkout - ${formatCurrency(checkoutTotal)}`}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="font-playfair">Complete checkout</AlertDialogTitle>
                        <AlertDialogDescription>
                          Submit your billing details and payment information now?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleSubmit()}>
                          Complete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Dialog
        open={showDeliveryNotice}
        onOpenChange={(open) => {
          setShowDeliveryNotice(open);
          if (!open && shouldNavigateAfterNotice) {
            setShouldNavigateAfterNotice(false);
            navigate('/billing');
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-playfair">Delivery Arrangement</DialogTitle>
            <DialogDescription>
              Contact the store for your delivery arrangement.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setShowDeliveryNotice(false)}>Got it</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Payment;
