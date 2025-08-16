import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { CreditCard, Lock, Truck } from 'lucide-react';

const Payment = () => {
  const { items, total } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('card');

  return (
    <div className="min-h-screen bg-background">
      <Header onCategoryChange={() => {}} selectedCategory="All" />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-12 font-playfair">Checkout</h1>
          
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Order Summary */}
            <div className="space-y-6">
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
                      <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total</span>
                    <span className="text-red">${total.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment Form */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-playfair">
                    <CreditCard className="h-5 w-5" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant={paymentMethod === 'card' ? 'default' : 'outline'}
                      onClick={() => setPaymentMethod('card')}
                      className="h-12"
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Card
                    </Button>
                    <Button
                      variant={paymentMethod === 'paystack' ? 'default' : 'outline'}
                      onClick={() => setPaymentMethod('paystack')}
                      className="h-12"
                    >
                      PayStack
                    </Button>
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="card-number">Card Number</Label>
                        <Input
                          id="card-number"
                          placeholder="1234 5678 9012 3456"
                          className="h-12"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input
                            id="expiry"
                            placeholder="MM/YY"
                            className="h-12"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvc">CVC</Label>
                          <Input
                            id="cvc"
                            placeholder="123"
                            className="h-12"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="name">Cardholder Name</Label>
                        <Input
                          id="name"
                          placeholder="John Doe"
                          className="h-12"
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'paystack' && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">
                        You will be redirected to PayStack to complete your payment
                      </p>
                      <div className="flex justify-center">
                        <img 
                          src="https://paystack.com/assets/img/logo/paystack-logo.png" 
                          alt="PayStack" 
                          className="h-8"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Lock className="h-4 w-4" />
                    Your payment information is secure and encrypted
                  </div>

                  <Button 
                    className="w-full h-12 text-lg font-semibold"
                    size="lg"
                  >
                    Complete Payment - ${total.toFixed(2)}
                  </Button>
                </CardContent>
              </Card>

              {/* Billing Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-playfair">Billing Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input id="first-name" className="h-12" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input id="last-name" className="h-12" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" className="h-12" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" className="h-12" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Select>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ng">Nigeria</SelectItem>
                          <SelectItem value="gh">Ghana</SelectItem>
                          <SelectItem value="ke">Kenya</SelectItem>
                          <SelectItem value="za">South Africa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
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