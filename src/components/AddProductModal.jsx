import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { X, Save, Upload } from 'lucide-react';
import { useSupabase } from '../hooks/useSupabase';
import { toast } from 'sonner';
import { parsePrice, isValidPrice, toDatabasePrice } from '../utils/priceUtils';

export function AddProductModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    sale_price: '',
    category_id: '',
    is_hot: false,
    is_new: false,
    on_sale: false
  });
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  
  const { addProduct, getCategories, uploadImage } = useSupabase();

  useEffect(() => {
    if (isOpen) {
      loadCategories();
    }
  }, [isOpen]);

  const loadCategories = async () => {
    const data = await getCategories();
    if (data) {
      setCategories(data);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckboxChange = (field, checked) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
    
    // Create preview URLs
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !isValidPrice(formData.price)) {
      toast.error('يرجى إدخال اسم المنتج والسعر الصحيح');
      return;
    }
    
    // التحقق من صحة سعر التخفيض إذا كان موجوداً
    if (formData.sale_price && !isValidPrice(formData.sale_price)) {
      toast.error('يرجى إدخال سعر تخفيض صحيح');
      return;
    }

    setLoading(true);
    try {
      let imageUrls = [];
      
      // Upload images if selected
      if (imageFiles.length > 0) {
        for (const file of imageFiles) {
          const imageUrl = await uploadImage(file, 'products');
          imageUrls.push(imageUrl);
        }
      }

      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parsePrice(formData.price),
        sale_price: toDatabasePrice(formData.sale_price),
        category_id: formData.category_id && formData.category_id.trim() !== '' ? formData.category_id : null,
        is_hot: formData.is_hot,
        is_new: formData.is_new,
        on_sale: formData.on_sale,
        image_urls: imageUrls
      };

      await addProduct(productData);
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        price: '',
        sale_price: '',
        category_id: '',
        is_hot: false,
        is_new: false,
        on_sale: false
      });
      setImageFiles([]);
      setImagePreviews([]);
      
      onSuccess && onSuccess();
      onClose();
      
      toast.success('تم إضافة المنتج بنجاح!');
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('حدث خطأ أثناء إضافة المنتج');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      sale_price: '',
      category_id: '',
      is_hot: false,
      is_new: false,
      on_sale: false
    });
    setImageFiles([]);
    setImagePreviews([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-gray-900 dark:text-white">إضافة منتج جديد</CardTitle>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">اسم المنتج *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="أدخل اسم المنتج"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">الفئة</Label>
                <Select
                  id="category"
                  value={formData.category_id}
                  onChange={(e) => handleInputChange('category_id', e.target.value)}
                >
                  <option value="">اختر الفئة</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">الوصف</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="أدخل وصف المنتج"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">السعر *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sale_price">سعر التخفيض</Label>
                <Input
                  id="sale_price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.sale_price}
                  onChange={(e) => handleInputChange('sale_price', e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="images">صور المنتج</Label>
              <Input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {imagePreviews.map((preview, index) => (
                    <img
                      key={index}
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-20 h-20 object-cover rounded-lg border"
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Label>خصائص المنتج</Label>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.is_hot}
                    onChange={(e) => handleCheckboxChange('is_hot', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">منتج مميز (Hot)</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.is_new}
                    onChange={(e) => handleCheckboxChange('is_new', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">منتج جديد (New)</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.on_sale}
                    onChange={(e) => handleCheckboxChange('on_sale', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">في التخفيضات (Sale)</span>
                </label>
              </div>
            </div>

            <div className="flex space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
                disabled={loading}
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                className="flex-1 flex items-center space-x-2"
                disabled={loading}
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'جاري الحفظ...' : 'حفظ'}</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

