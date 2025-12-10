import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Download, Eye, Calendar, CreditCard } from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';
import { useAuth } from '@/contexts/AuthContext';
import { useMemo } from 'react';

const Billing = () => {
  const { user } = useAuth();
  const { data: orders = [], isLoading } = useOrders(undefined, !!user);
  const formatCurrency = (value: number) =>
    value.toLocaleString('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 });

  const totals = useMemo(() => {
    const totalSpent = orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);
    const activeOrders = orders.filter(order => (order.status || '').toUpperCase() !== 'CONFIRMED').length;
    return { totalSpent, activeOrders };
  }, [orders]);

  const getStatusColor = (status: string) => {
    switch ((status || '').toLowerCase()) {
      case 'confirmed':
      case 'completed':
        return 'bg-green-500/10 text-green-700 border-green-200';
      case 'pending':
      case 'processing':
        return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onCategoryChange={() => {}} selectedCategory="All" />
      
      <main className="container mx-auto px-4 py-10 md:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 font-playfair">Billing & Orders</h1>
            <p className="text-muted-foreground text-lg">
              {user ? 'Manage your orders and download invoices' : 'Sign in to view your order history'}
            </p>
          </div>

          {isLoading && (
            <div className="text-center py-12 text-muted-foreground">Loading your orders...</div>
          )}

          {!user && !isLoading && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Orders unavailable</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Sign in to view your purchases and invoices.</p>
              </CardContent>
            </Card>
          )}

          {user && (
            <>
              {/* Billing Summary */}
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{orders.length}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Spent</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-red">
                      {formatCurrency(totals.totalSpent)}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Active Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {totals.activeOrders}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Orders List */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold font-playfair">Order History</h2>
                
                {orders.length === 0 && (
                  <Card>
                    <CardContent className="py-10">
                      <p className="text-muted-foreground">No orders yet. Browse products and place your first order.</p>
                    </CardContent>
                  </Card>
                )}

                {orders.map((order) => (
                  <Card key={order.id} className="overflow-hidden">
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-lg">{order.id}</h3>
                            <Badge className={getStatusColor(order.status || '')}>
                              {order.status || 'PENDING'}
                            </Badge>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-1" />
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Date unavailable'}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-red">{formatCurrency(Number(order.totalAmount || 0))}</div>
                          <div className="text-sm text-muted-foreground">
                            {order.items?.length || 0} item{(order.items?.length || 0) > 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        {order.items?.map((item, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <div>
                              <span className="font-medium">{item.product?.name || item.productId}</span>
                              <span className="text-muted-foreground ml-2">x{item.quantity}</span>
                            </div>
                            <span className="font-semibold">
                              {formatCurrency(Number(item.price || 0))}
                            </span>
                          </div>
                        ))}
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button variant="outline" className="flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          View Details
                        </Button>
                        <Button variant="outline" className="flex items-center gap-2">
                          <Download className="h-4 w-4" />
                          Download Invoice
                        </Button>
                        {order.status?.toLowerCase() === 'confirmed' && (
                          <Button variant="outline" className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            Reorder
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Billing;
