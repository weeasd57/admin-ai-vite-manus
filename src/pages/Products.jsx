import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Plus, Package, Edit, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '../components/ui/alert-dialog';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useSupabase } from '../hooks/useSupabase';
import { AddProductModal } from '../components/AddProductModal';
import { EditProductModal } from '../components/EditProductModal';
import { formatPrice } from '../utils/priceUtils';

export function Products() {
  const navigate = useNavigate();
  const { deleteProduct, getProducts } = useSupabase();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const data = await getProducts();
    if (data) {
      setProducts(data);
    }
    setLoading(false);
  };

  const handleAddSuccess = () => {
    loadProducts(); // Reload products after adding new one
  };

  const formatPriceDisplay = (price) => {
    return formatPrice(price, 'USD');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Products</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1 sm:mt-2">Manage your product inventory</p>
        </div>
        <Button 
          className="flex items-center justify-center space-x-2 w-full sm:w-auto touch-target"
          onClick={() => setShowAddModal(true)}
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </Button>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12">
            <Package className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100 mb-2 text-center">No products found</h3>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 text-center mb-4 px-4">
              Get started by adding your first product to the inventory.
            </p>
            <Button 
              className="flex items-center space-x-2 touch-target"
              onClick={() => setShowAddModal(true)}
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {products.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3 p-3 sm:p-4">
                <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg mb-3 overflow-hidden">
                  {product.image_urls && product.image_urls.length > 0 ? (
                    <img
                      src={product.image_urls[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
                    </div>
                  )}
                </div>
                <CardTitle className="text-base sm:text-lg">{product.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                  {product.description}
                </p>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex flex-col">
                    <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                      {formatPriceDisplay(product.price)}
                    </span>
                    {product.on_sale && product.sale_price && (
                      <span className="text-xs sm:text-sm text-green-600 dark:text-green-400">
                        Sale: {formatPriceDisplay(product.sale_price)}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {product.is_hot && (
                      <Badge variant="destructive" className="text-xs">Hot</Badge>
                    )}
                    {product.is_new && (
                      <Badge variant="secondary" className="text-xs">New</Badge>
                    )}
                    {product.on_sale && (
                      <Badge variant="outline" className="text-xs">Sale</Badge>
                    )}
                  </div>
                </div>

                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Category: {product.categories?.name || 'Uncategorized'}
                </div>

                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Created: {formatDate(product.created_at)}
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 touch-target"
                    onClick={() => {
                      setEditTarget(product.id);
                      setShowEditModal(true);
                    }}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700 flex-1 sm:flex-none touch-target"
                    onClick={() => setDeleteTarget(product)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent className="bg-white dark:bg-black rounded-lg p-4 sm:p-6 w-full max-w-sm mx-4 border dark:border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base sm:text-lg text-gray-900 dark:text-white">Delete Product</AlertDialogTitle>
            <AlertDialogDescription className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              Are you sure you want to delete <strong className="text-gray-900 dark:text-white">{deleteTarget?.name}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:justify-end sm:space-x-2 mt-4">
            <AlertDialogCancel asChild>
              <Button variant="outline" className="touch-target">Cancel</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant="destructive"
                className="touch-target"
                onClick={async () => {
                  try {
                    await deleteProduct(deleteTarget.id);
                    toast.success('Product deleted successfully');
                    loadProducts();
                  } catch (error) {
                    toast.error('Failed to delete product');
                  } finally {
                    setDeleteTarget(null);
                  }
                }}
              >
                Delete
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleAddSuccess}
      />

      {/* Edit Product Modal */}
      <EditProductModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditTarget(null);
        }}
        productId={editTarget}
        onSuccess={handleAddSuccess}
      />
    </div>
  );
}


