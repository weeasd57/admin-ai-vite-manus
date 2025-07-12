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

  return {
    loading,
    getCategories,
    addCategory,
    getProducts,
    addProduct,
    getOrders,
    getUsers,
    getAppSettings,
    updateAppSettings,
    uploadImage
  };
}

