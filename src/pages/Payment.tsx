import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

  const isGuest = !user;

  const checkoutMutation = useMutation({
    mutationFn: () =>
      hokApi.createOrder(
        {
          items: items.map(item => ({ productId: item.id, quantity: item.quantity })),
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
        title: "Order placed",
        description: "Your order has been submitted successfully.",
      });
      clearCart();
      navigate('/billing');
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

  return (
    <div className="min-h-screen bg-background">
      <Header onCategoryChange={() => {}} selectedCategory="All" />
      
      <main className="container mx-auto px-4 md:px-16 py-10 ">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-12 font-playfair">Checkout</h1>
          
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Order Summary */}
            <div className="space-y-6 lg:sticky lg:top-24">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-playfair">
                    <Truck className="h-5 w-5" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-semibold">{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total</span>
                    <span className="text-red">{formatCurrency(total)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Billing + Payment Form */}
            <div className="space-y-6">
              {/* Billing Address */}
              <Card>
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
                    <Input id="address" className="h-12" value={form.address} onChange={handleInputChange('address')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="note">Order Note</Label>
                    <Input id="note" className="h-12" value={form.note} onChange={handleInputChange('note')} placeholder="Optional note for your order" />
                  </div>
                </CardContent>
              </Card>

              <Card>
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
                      <p className="text-sm font-semibold">HOK Fashion Ltd.</p>
                      <p className="text-sm">Account Number: <span className="font-semibold">0123456789</span></p>
                      <p className="text-sm">Bank: GTBank</p>
                      <p className="text-sm">Reference: <span className="font-semibold">Order Payment</span></p>
                      <p className="text-sm">Amount: <span className="font-semibold">{formatCurrency(total)}</span></p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="receipt">Upload Payment Receipt (required)</Label>
                    <div className="flex items-center gap-3">
                      <Input
                        id="receipt"
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                      />
                      <Upload className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground">
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

                  <Button 
                    className="w-full h-12 text-lg font-semibold"
                    size="lg"
                    type="button"
                    disabled={checkoutMutation.isPending || !receiptFile}
                    onClick={handleSubmit}
                  >
                    {checkoutMutation.isPending ? 'Processing...' : `Submit Payment Proof - ${formatCurrency(total)}`}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Payment;
