import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useSupabase() {
  const [loading, setLoading] = useState(false);

  // Categories
  const getCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (categoryData) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .insert([categoryData])
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (id, categoryData) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .update(categoryData)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    try {
      setLoading(true);
      
      // First check if this is the "public" category and get category data
      const { data: category, error: fetchError } = await supabase
        .from('categories')
        .select('name, image_url')
        .eq('id', id)
        .single();
      
      if (fetchError) throw fetchError;
      
      if (category.name.toLowerCase() === 'public') {
        throw new Error('Cannot delete the public category');
      }
      
      // Get all products in this category to delete their images
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id, image_urls')
        .eq('category_id', id);
      
      if (productsError) throw productsError;
      
      // Delete all product images associated with this category
      if (products && products.length > 0) {
        for (const product of products) {
          if (product.image_urls && Array.isArray(product.image_urls)) {
            for (const imageUrl of product.image_urls) {
              await deleteImage(imageUrl);
            }
          }
        }
      }
      
      // Delete the category from database (this will cascade delete products due to foreign key)
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      
      // Delete category image from storage
      if (category.image_url) {
        await deleteImage(category.image_url);
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getCategoryById = async (id) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching category:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Products
  const getProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            id,
            name
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (productData) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    try {
      setLoading(true);
      
      // First get the product data to retrieve image URLs
      const { data: product, error: fetchError } = await supabase
        .from('products')
        .select('image_urls')
        .eq('id', id)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Delete associated images from storage
      if (product.image_urls && Array.isArray(product.image_urls)) {
        for (const imageUrl of product.image_urls) {
          await deleteImage(imageUrl);
        }
      }

      // Delete the product from database
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getProductById = async (id) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            id,
            name
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Orders
  const getOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            quantity,
            price,
            name,
            image_url
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateOrder = async (id, orderData) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .update(orderData)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteOrder = async (id) => {
    try {
      setLoading(true);
      
      // Delete order items first (due to foreign key constraint)
      const { error: itemsError } = await supabase
        .from('order_items')
        .delete()
        .eq('order_id', id);
      
      if (itemsError) throw itemsError;
      
      // Delete the order
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Users
  const getUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching users:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // App Settings
  const getAppSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('app_settings')
        .select('*')
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Error fetching app settings:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateAppSettings = async (settingsData) => {
    try {
      setLoading(true);
      
      // First, try to get existing settings
      const { data: existing } = await supabase
        .from('app_settings')
        .select('id')
        .single();

      let result;
      if (existing) {
        // Update existing settings
        const { data, error } = await supabase
          .from('app_settings')
          .update(settingsData)
          .eq('id', existing.id)
          .select();
        
        if (error) throw error;
        result = data[0];
      } else {
        // Insert new settings
        const { data, error } = await supabase
          .from('app_settings')
          .insert([settingsData])
          .select();
        
        if (error) throw error;
        result = data[0];
      }
      
      return result;
    } catch (error) {
      console.error('Error updating app settings:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // File Upload
  const uploadImage = async (file, bucket = 'images') => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${bucket}/${fileName}`;

      const { data, error } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          contentType: file.type,
          upsert: true,            // allow overwriting if same filename
          cacheControl: '3600'     // optional: cache for 1h
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  // Delete Image from Storage
  const deleteImage = async (imageUrl) => {
    try {
      if (!imageUrl) return;
      
      // Extract bucket and file path from public URL
      const match = imageUrl.match(/storage\/v1\/object\/public\/([^/]+)\/(.+)$/);
      if (!match) return; // invalid URL
      const bucket = match[1];           // e.g. 'images'
      const filePath = match[2];         // e.g. 'categories/xyz.png'

      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath]);

      if (error) {
        console.error('Error deleting image:', error);
        // ignore deletion failure so primary operation continues
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  return {
    loading,
    getCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
    getProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    getOrders,
    updateOrder,
    deleteOrder,
    getUsers,
    getAppSettings,
    updateAppSettings,
    uploadImage,
    deleteImage
  };
}

