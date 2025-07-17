import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Upload, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import { useSupabase } from '../hooks/useSupabase';
import { parsePrice, isValidPrice, toDatabasePrice } from '../utils/priceUtils';

export function EditProductModal({ isOpen, onClose, productId, onSuccess }) {
  const { getProductById, updateProduct, uploadImage, getCategories } = useSupabase();
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    sale_price: '',
    category_id: '',
    image_urls: [],
    is_hot: false,
    is_new: false,
    on_sale: false
  });

  useEffect(() => {
    if (isOpen && productId) {
      loadProduct();
      loadCategories();
    }
  }, [isOpen, productId]);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      if (data) {
        setCategories(data);
      }
    } catch (error) {
      toast.error('Failed to load categories');
    }
  };

  const loadProduct = async () => {
    try {
      setLoading(true);
      const data = await getProductById(productId);
      if (data) {
        setFormData({
          name: data.name || '',
          description: data.description || '',
          price: data.price?.toString() || '',
          sale_price: data.sale_price?.toString() || '',
          category_id: data.category_id || '',
          image_urls: data.image_urls || [],
          is_hot: data.is_hot || false,
          is_new: data.is_new || false,
          on_sale: data.on_sale || false
        });
      }
    } catch (error) {
      toast.error('Failed to load product');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const imageUrl = await uploadImage(file);
      setFormData(prev => ({
        ...prev,
        image_urls: [...prev.image_urls, imageUrl]
      }));
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      image_urls: prev.image_urls.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Product name is required');
      return;
    }
    
    if (!isValidPrice(formData.price)) {
      toast.error('Please enter a valid price');
      return;
    }
    
    if (formData.sale_price && !isValidPrice(formData.sale_price)) {
      toast.error('Please enter a valid sale price');
      return;
    }

    try {
      setSaving(true);
      // تنظيف البيانات قبل الإرسال
      const cleanedData = {
        ...formData,
        category_id: formData.category_id && formData.category_id.trim() !== '' ? formData.category_id : null,
        price: parsePrice(formData.price),
        sale_price: toDatabasePrice(formData.sale_price)
      };
      
      await updateProduct(productId, cleanedData);
      toast.success('Product updated successfully');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      image_urls: []
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Product</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="p-1"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="ml-2">Loading product...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="edit-product-name">Product Name *</Label>
              <Input
                id="edit-product-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter product name"
                required
              />
            </div>

            <div>
              <Label htmlFor="edit-product-description">Description</Label>
              <Textarea
                id="edit-product-description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter product description"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="edit-product-price">Price *</Label>
              <Input
                id="edit-product-price"
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="Enter product price"
                required
              />
            </div>

            <div>
              <Label htmlFor="edit-product-category">Category</Label>
              <select
                id="edit-product-category"
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
                className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-product-on-sale"
                checked={formData.on_sale}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, on_sale: checked }))}
              />
              <Label htmlFor="edit-product-on-sale">On Sale</Label>
            </div>

            {formData.on_sale && (
              <div>
                <Label htmlFor="edit-product-sale-price">Sale Price</Label>
                <Input
                  id="edit-product-sale-price"
                  name="sale_price"
                  type="number"
                  step="0.01"
                  value={formData.sale_price}
                  onChange={handleInputChange}
                  placeholder="Enter sale price"
                />
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-product-is-hot"
                  checked={formData.is_hot}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_hot: checked }))}
                />
                <Label htmlFor="edit-product-is-hot">Hot Product</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-product-is-new"
                  checked={formData.is_new}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_new: checked }))}
                />
                <Label htmlFor="edit-product-is-new">New Product</Label>
              </div>
            </div>

            <div>
              <Label>Product Images</Label>
              <div className="mt-2">
                {formData.image_urls.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    {formData.image_urls.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt="Product"
                          className="w-full h-20 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="absolute top-1 right-1 p-1"
                          onClick={() => removeImage(index)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="edit-product-image-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => document.getElementById('edit-product-image-upload').click()}
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Image
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
