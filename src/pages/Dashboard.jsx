import React, { useState, useEffect } from 'react';
import { DashboardStats } from '../components/DashboardStats';
import { RecentOrders } from '../components/RecentOrders';
import { RecentUsers } from '../components/RecentUsers';
import { useSupabase } from '../hooks/useSupabase';

export function Dashboard() {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const { getOrders, getUsers, getProducts } = useSupabase();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load orders
      const orders = await getOrders();
      if (orders) {
        setRecentOrders(orders);
        const totalSales = orders.reduce((sum, order) => sum + parseFloat(order.total || 0), 0);
        setStats(prev => ({ ...prev, totalSales: totalSales.toFixed(2), totalOrders: orders.length }));
      }

      // Load users
      const users = await getUsers();
      if (users) {
        setRecentUsers(users);
        setStats(prev => ({ ...prev, totalUsers: users.length }));
      }

      // Load products
      const products = await getProducts();
      if (products) {
        setStats(prev => ({ ...prev, totalProducts: products.length }));
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Cards */}
      <DashboardStats stats={stats} />

      {/* Recent Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentOrders orders={recentOrders} />
        <RecentUsers users={recentUsers} />
      </div>
    </div>
  );
}

