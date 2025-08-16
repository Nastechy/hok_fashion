import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Download, Eye, Calendar, CreditCard } from 'lucide-react';

const Billing = () => {
  const orders = [
    {
      id: 'ORD-2024-001',
      date: '2024-01-15',
      status: 'Completed',
      total: 149.97,
      items: [
        { name: 'Luxury Handbag Collection', quantity: 1, price: 89.99 },
        { name: 'Premium Leather Wallet', quantity: 2, price: 29.99 }
      ]
    },
    {
      id: 'ORD-2024-002',
      date: '2024-01-10',
      status: 'Processing',
      total: 199.99,
      items: [
        { name: 'Designer Tote Bag', quantity: 1, price: 199.99 }
      ]
    },
    {
      id: 'ORD-2024-003',
      date: '2024-01-05',
      status: 'Shipped',
      total: 79.99,
      items: [
        { name: 'Crossbody Messenger Bag', quantity: 1, price: 79.99 }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-500/10 text-green-700 border-green-200';
      case 'processing':
        return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
      case 'shipped':
        return 'bg-blue-500/10 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onCategoryChange={() => {}} selectedCategory="All" />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 font-playfair">Billing & Orders</h1>
            <p className="text-muted-foreground text-lg">
              Manage your orders and download invoices
            </p>
          </div>

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
                  ${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {orders.filter(order => order.status !== 'Completed').length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Orders List */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold font-playfair">Order History</h2>
            
            {orders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg">{order.id}</h3>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(order.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-red">${order.total.toFixed(2)}</div>
                      <div className="text-sm text-muted-foreground">
                        {order.items.length} item{order.items.length > 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <span className="font-medium">{item.name}</span>
                          <span className="text-muted-foreground ml-2">x{item.quantity}</span>
                        </div>
                        <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
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
                    {order.status === 'Completed' && (
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

          {/* Payment Methods */}
          <Card className="mt-12">
            <CardHeader>
              <CardTitle className="font-playfair">Saved Payment Methods</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-6 w-6 text-muted-foreground" />
                    <div>
                      <div className="font-medium">**** **** **** 4242</div>
                      <div className="text-sm text-muted-foreground">Expires 12/25</div>
                    </div>
                  </div>
                  <Badge variant="outline">Default</Badge>
                </div>
                
                <Button variant="outline" className="w-full">
                  + Add New Payment Method
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Billing;