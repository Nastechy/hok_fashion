import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUpload } from '@/components/ui/image-upload';
import { hokApi, Product, CreateProductInput } from '@/services/hokApi';
import { useMutation, useQuery } from '@tanstack/react-query';

const ProductManagement = () => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    productCode: '',
    collectionType: '',
    category: 'AVAILABLE',
    isBestSeller: false,
    isNewArrival: false,
    isFeatured: false,
    isAvailable: true,
    stock_quantity: '',
    features: ''
  });

  const categories = ['AVAILABLE', 'BEST_SELLER', 'NEW_ARRIVAL', 'FEATURE', 'INCOMING'];

  const productsQuery = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => hokApi.fetchProducts({ limit: 200 }),
  });

  const createProduct = useMutation({
    mutationFn: (payload: CreateProductInput) => hokApi.createProduct(payload),
    onSuccess: () => {
      toast({ title: "Success", description: "Product created successfully" });
      productsQuery.refetch();
      closeDialog();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error?.message || "Failed to create product", variant: "destructive" });
    },
  });

  const updateProduct = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateProductInput> }) => hokApi.updateProduct(id, payload),
    onSuccess: () => {
      toast({ title: "Success", description: "Product updated successfully" });
      productsQuery.refetch();
      closeDialog();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error?.message || "Failed to update product", variant: "destructive" });
    },
  });

  const deleteProduct = useMutation({
    mutationFn: (id: string) => hokApi.deleteProduct(id),
    onSuccess: () => {
      toast({ title: "Success", description: "Product deleted successfully" });
      productsQuery.refetch();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error?.message || "Failed to delete product", variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      imageUrl: '',
      productCode: '',
      collectionType: '',
      category: 'AVAILABLE',
      isBestSeller: false,
      isNewArrival: false,
      isFeatured: false,
      isAvailable: true,
      stock_quantity: '',
      features: ''
    });
    setEditingProduct(null);
  };

  const openDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price.toString(),
        imageUrl: product.imageUrls?.[0] || '',
        productCode: product.productCode || '',
        collectionType: product.collectionType || '',
        category: product.category || 'AVAILABLE',
        isBestSeller: product.isBestSeller || false,
        isNewArrival: product.isNewArrival || false,
        isFeatured: product.isFeatured || false,
        isAvailable: product.isAvailable ?? true,
        stock_quantity: product.quantity?.toString() || '0',
        features: product.features?.join(', ') || ''
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData: CreateProductInput = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      imageUrls: formData.imageUrl ? [formData.imageUrl] : [],
      productCode: formData.productCode,
      collectionType: formData.collectionType,
      category: formData.category,
      isBestSeller: formData.isBestSeller,
      isNewArrival: formData.isNewArrival,
      isFeatured: formData.isFeatured,
      isAvailable: formData.isAvailable,
      quantity: parseInt(formData.stock_quantity) || 0,
      features: formData.features.split(',').map(f => f.trim()).filter(f => f)
    };

    if (editingProduct) {
      updateProduct.mutate({ id: editingProduct.id, payload: productData });
    } else {
      createProduct.mutate(productData);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    deleteProduct.mutate(id);
  };

  const products = productsQuery.data?.data ?? [];

  if (productsQuery.isLoading) {
    return <div>Loading products...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Product Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="productCode">Product Code</Label>
                  <Input
                    id="productCode"
                    value={formData.productCode}
                    onChange={(e) => setFormData(prev => ({ ...prev, productCode: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="collectionType">Collection</Label>
                  <Input
                    id="collectionType"
                    value={formData.collectionType}
                    onChange={(e) => setFormData(prev => ({ ...prev, collectionType: e.target.value }))}
                    placeholder="Optional collection name"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="stock">Quantity</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, stock_quantity: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <ImageUpload
                  value={formData.imageUrl}
                  onChange={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
                  label="Primary Image"
                  placeholder="Enter hosted image URL"
                />
              </div>

              <div>
                <Label htmlFor="features">Features (comma separated)</Label>
                <Textarea
                  id="features"
                  value={formData.features}
                  onChange={(e) => setFormData(prev => ({ ...prev, features: e.target.value }))}
                  placeholder="Premium leather, Spacious interior, Elegant finish"
                />
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="best_seller"
                    checked={formData.isBestSeller}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isBestSeller: checked }))}
                  />
                  <Label htmlFor="best_seller">Best Seller</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="new_arrival"
                    checked={formData.isNewArrival}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isNewArrival: checked }))}
                  />
                  <Label htmlFor="new_arrival">New Arrival</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.isFeatured}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isFeatured: checked }))}
                  />
                  <Label htmlFor="featured">Featured</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="available"
                    checked={formData.isAvailable}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isAvailable: checked }))}
                  />
                  <Label htmlFor="available">Available</Label>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit">
                  <Save className="w-4 h-4 mr-2" />
                  {editingProduct ? 'Update' : 'Create'}
                </Button>
                <Button type="button" variant="outline" onClick={closeDialog}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {product.name}
                    {product.isBestSeller && <Badge variant="secondary">Best Seller</Badge>}
                    {product.isNewArrival && <Badge>New</Badge>}
                    {product.isFeatured && <Badge variant="outline">Featured</Badge>}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {product.category} • ${product.price} • Stock: {product.quantity ?? 0}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openDialog(product)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
              {product.features && product.features.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {product.features.map((feature, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductManagement;
