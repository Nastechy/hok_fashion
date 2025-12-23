/* eslint-disable @typescript-eslint/no-explicit-any */
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
// import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { hokApi, Product, CreateProductInput } from '@/services/hokApi';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

const ProductManagement = () => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    productCode: '',
    collectionType: '',
    category: 'AVAILABLE',
    isBestSeller: false,
    isNewArrival: false,
    isFeatured: false,
    isAvailable: true,
    stock_quantity: '',
    features: '',
    images: [] as File[],
    videos: [] as File[],
    keptImages: [] as string[],
    keptVideos: [] as string[],
    newImagePreviews: [] as string[],
    variants: [] as { name: string; sku: string; priceDelta: string; quantity: string }[],
    newVariant: { name: '', sku: '', priceDelta: '', quantity: '' },
  });

  const categories = ['AVAILABLE', 'BEST_SELLER', 'NEW_ARRIVAL', 'FEATURE', 'INCOMING', 'SALES'];

  const productsQuery = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => hokApi.fetchProducts({ limit: 200 }),
  });

  const createProduct = useMutation({
    mutationFn: (payload: Partial<CreateProductInput>) => hokApi.createProduct(payload),
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
      const message = String(error?.message || '');
      const relationBlocked = message.includes('ProductVariant') || message.includes('required relation');
      toast({
        title: "Error",
        description: relationBlocked
          ? "This product has variants tied to it. Delete or detach variants first, or enable cascading deletes in the API."
          : message || "Failed to delete product",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      productCode: '',
      collectionType: '',
      category: 'AVAILABLE',
      isBestSeller: false,
      isNewArrival: false,
      isFeatured: false,
      isAvailable: true,
      stock_quantity: '',
      features: '',
      images: [],
      videos: [],
      keptImages: [],
      keptVideos: [],
      newImagePreviews: [],
      variants: [],
      newVariant: { name: '', sku: '', priceDelta: '', quantity: '' },
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
        productCode: product.productCode || '',
        collectionType: product.collectionType || '',
        category: product.category || 'AVAILABLE',
        isBestSeller: product.isBestSeller || false,
        isNewArrival: product.isNewArrival || false,
        isFeatured: product.isFeatured || false,
        isAvailable: product.isAvailable ?? true,
        stock_quantity: product.quantity?.toString() || '0',
        features: product.features?.join(', ') || '',
        images: [],
        videos: [],
        keptImages: product.images || product.imageUrls || [],
        keptVideos: product.videos || product.videoUrls || [],
        newImagePreviews: [],
        variants: product.variants?.map(v => ({
          name: v.name || '',
          sku: v.sku || '',
          priceDelta: (v.priceDelta ?? 0).toString(),
          quantity: (v.quantity ?? 0).toString(),
        })) || [],
        newVariant: { name: '', sku: '', priceDelta: '', quantity: '' },
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    formData.newImagePreviews.forEach((url) => URL.revokeObjectURL(url));
    setIsDialogOpen(false);
    resetForm();
  };

  const addVariant = () => {
    if (!formData.newVariant.name && !formData.newVariant.sku) return;
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { ...prev.newVariant }],
      newVariant: { name: '', sku: '', priceDelta: '', quantity: '' },
    }));
  };

  const removeVariant = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData: Partial<CreateProductInput> = {};
    if (formData.name.trim()) productData.name = formData.name.trim();
    if (formData.description.trim()) productData.description = formData.description.trim();
    if (formData.price.trim()) productData.price = parseFloat(formData.price);
    if (formData.productCode.trim()) productData.productCode = formData.productCode.trim();
    if (formData.collectionType.trim()) productData.collectionType = formData.collectionType.trim();
    if (formData.category) productData.category = formData.category;
    if (typeof formData.isBestSeller === 'boolean') productData.isBestSeller = formData.isBestSeller;
    if (typeof formData.isNewArrival === 'boolean') productData.isNewArrival = formData.isNewArrival;
    if (typeof formData.isFeatured === 'boolean') productData.isFeatured = formData.isFeatured;
    if (typeof formData.isAvailable === 'boolean') productData.isAvailable = formData.isAvailable;
    if (formData.stock_quantity.trim()) productData.quantity = Math.max(0, parseInt(formData.stock_quantity) || 0);
    if (formData.features.trim()) productData.features = formData.features.trim();
    if (formData.keptImages.length) productData.images = formData.keptImages;
    if (formData.keptVideos.length) productData.videos = formData.keptVideos;
    if (formData.images.length) productData.newImages = formData.images;
    if (formData.videos.length) productData.newVideos = formData.videos;
    if (formData.variants.length) {
      productData.variants = formData.variants
        .filter(v => v.name || v.sku)
        .map(v => ({
          name: v.name || undefined,
          sku: v.sku || undefined,
          priceDelta: Number(v.priceDelta) || 0,
          quantity: Math.max(0, Number(v.quantity) || 0),
        }));
    }

    if (editingProduct) {
      updateProduct.mutate({ id: editingProduct.id, payload: productData });
    } else {
      createProduct.mutate(productData);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;
    deleteProduct.mutate(id);
  };

  const products = productsQuery.data?.data ?? [];
  const selectedImageNames = useMemo(() => formData.images.map((f) => f.name), [formData.images]);
  const formatCategoryLabel = (category: string) =>
    category.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return products.filter((product) => {
      const matchesQuery = !query
        || product.name.toLowerCase().includes(query)
        || (product.productCode || '').toLowerCase().includes(query);
      const matchesCategory = categoryFilter === 'All' || (product.category || 'AVAILABLE') === categoryFilter;
      return matchesQuery && matchesCategory;
    });
  }, [products, searchQuery, categoryFilter]);

  if (productsQuery.isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Product Management</h2>
        </div>
        <div className="grid gap-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Card key={idx} className="shadow-elegant">
              <CardHeader>
                <div className="h-4 w-32 rounded skeleton-shimmer" />
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="h-4 w-48 rounded skeleton-shimmer" />
                <div className="flex gap-2">
                  <div className="h-6 w-16 rounded skeleton-shimmer" />
                  <div className="h-6 w-12 rounded skeleton-shimmer" />
                </div>
                <div className="h-24 rounded skeleton-shimmer" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
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
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price (₦)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="images">Images (files)</Label>
                  <Input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      if (!files.length) return;
                      const previews = files.map((file) => URL.createObjectURL(file));
                      setFormData(prev => ({
                        ...prev,
                        images: [...prev.images, ...files],
                        newImagePreviews: [...prev.newImagePreviews, ...previews],
                      }));
                    }}
                  />
                  {formData.images.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">
                        {formData.images.length} file(s) selected
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedImageNames.map((name) => (
                          <span key={name} className="text-[11px] px-2 py-1 rounded-md bg-secondary text-foreground border border-border">
                            {name}
                          </span>
                        ))}
                      </div>
                      {formData.newImagePreviews.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {formData.newImagePreviews.map((src, idx) => (
                            <div key={src + idx} className="relative h-16 w-16 rounded-md overflow-hidden border">
                              <img src={src} alt={`new-${idx}`} className="h-full w-full object-cover" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="videos">Videos (files)</Label>
                  <Input
                    id="videos"
                    type="file"
                    multiple
                    accept="video/*"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setFormData(prev => ({ ...prev, videos: [...prev.videos, ...files] }));
                    }}
                  />
                  {formData.videos.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {formData.videos.length} file(s) selected
                    </p>
                  )}
                  {formData.keptVideos.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">Existing Videos</p>
                      <div className="flex flex-col gap-2">
                        {formData.keptVideos.map((vid, idx) => (
                          <div key={vid + idx} className="flex items-center justify-between rounded-md border px-2 py-1 text-xs">
                            <span className="truncate max-w-[220px]">{vid}</span>
                            <button
                              type="button"
                              className="text-destructive hover:underline"
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  keptVideos: prev.keptVideos.filter((_, i) => i !== idx),
                                }))
                              }
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                      <p className="text-[11px] text-muted-foreground">Removed videos will be dropped on save.</p>
                    </div>
                  )}
                </div>
              </div>

              {formData.keptImages.length > 0 && (
                <div className="space-y-2">
                  <Label>Existing Images</Label>
                  <div className="flex flex-wrap gap-2">
                    {formData.keptImages.map((img, idx) => (
                      <div key={img + idx} className="relative h-16 w-16 rounded-md overflow-hidden border">
                        <img src={img} alt={`existing-${idx}`} className="h-full w-full object-cover" />
                        <button
                          type="button"
                          className="absolute top-0 right-0 bg-destructive text-destructive-foreground text-[10px] px-1 rounded-bl"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              keptImages: prev.keptImages.filter((_, i) => i !== idx),
                            }))
                          }
                        >
                          X
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Removed images will be dropped on save; add new files above to replace.
                  </p>
                </div>
              )}

              <div>
                <Label htmlFor="features">Features (comma separated)</Label>
                <Textarea
                  id="features"
                  value={formData.features}
                  onChange={(e) => setFormData(prev => ({ ...prev, features: e.target.value }))}
                  placeholder="Premium leather, Spacious interior, Elegant finish"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base">Variants</Label>
                  <Button type="button" size="sm" variant="outline" onClick={addVariant}>
                    Add Variant
                  </Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Input
                    placeholder="Name"
                    value={formData.newVariant.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, newVariant: { ...prev.newVariant, name: e.target.value } }))}
                  />
                  <Input
                    placeholder="SKU"
                    value={formData.newVariant.sku}
                    onChange={(e) => setFormData(prev => ({ ...prev, newVariant: { ...prev.newVariant, sku: e.target.value } }))}
                  />
                  <Input
                    placeholder="Price Delta"
                    type="number"
                    value={formData.newVariant.priceDelta}
                    onChange={(e) => setFormData(prev => ({ ...prev, newVariant: { ...prev.newVariant, priceDelta: e.target.value } }))}
                  />
                  <Input
                    placeholder="Quantity"
                    type="number"
                    value={formData.newVariant.quantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, newVariant: { ...prev.newVariant, quantity: e.target.value } }))}
                  />
                </div>
                {formData.variants.length > 0 && (
                  <div className="space-y-2">
                    {formData.variants.map((variant, idx) => (
                      <div key={`${variant.sku}-${idx}`} className="flex items-center justify-between bg-secondary/40 rounded-md px-3 py-2">
                        <div className="space-y-1">
                          <p className="text-sm font-semibold">{variant.name} ({variant.sku})</p>
                          <p className="text-xs text-muted-foreground">Δ₦{variant.priceDelta || '0'} • Qty {variant.quantity || '0'}</p>
                        </div>
                        <Button type="button" size="sm" variant="ghost" onClick={() => removeVariant(idx)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* <div className="flex items-center space-x-6">
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
              </div> */}

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

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-background p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or code"
            className="w-64"
          />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>{formatCategoryLabel(cat)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm text-muted-foreground">
          Showing {filteredProducts.length} of {products.length}
        </div>
      </div>

      <div className="grid gap-4">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="shadow-elegant hover:shadow-luxury transition-shadow">
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
                    {formatCategoryLabel(product.category || '')} • ₦{product.price.toLocaleString('en-NG')} • Stock: {product.quantity ?? 0}
                  </p>
                  {product.images && product.images.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {product.images.slice(0, 4).map((img, idx) => (
                        <img
                          key={img + idx}
                          src={img}
                          alt={`${product.name}-${idx}`}
                          className="h-16 w-16 rounded-md object-cover border"
                        />
                      ))}
                      {product.images.length > 4 && (
                        <Badge variant="outline" className="text-[11px]">
                          +{product.images.length - 4} more
                        </Badge>
                      )}
                    </div>
                  )}
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
