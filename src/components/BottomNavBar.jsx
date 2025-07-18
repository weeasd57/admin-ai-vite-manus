import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  FolderOpen
} from 'lucide-react';
import { cn } from '../lib/utils';

const bottomNavItems = [
  {
    id: 'dashboard',
    label: 'Home',
    icon: LayoutDashboard,
    path: '/'
  },
  {
    id: 'products',
    label: 'Products',
    icon: Package,
    path: '/products'
  },
  {
    id: 'categories',
    label: 'Categories',
    icon: FolderOpen,
    path: '/categories'
  },
  {
    id: 'orders',
    label: 'Orders',
    icon: ShoppingCart,
    path: '/orders'
  },
  {
    id: 'users',
    label: 'Users',
    icon: Users,
    path: '/users'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    path: '/settings'
  }
];

export function BottomNavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleItemClick = (path) => {
    navigate(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 md:hidden z-50 shadow-lg">
      <div className="grid grid-cols-6 h-16 safe-area-inset-bottom">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.path === '/' 
            ? location.pathname === '/' 
            : location.pathname.startsWith(item.path);
          
          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.path)}
              className={cn(
                "flex flex-col items-center justify-center px-2 py-1 text-xs font-medium transition-all duration-200 relative",
                "active:scale-95 hover:bg-gray-100 dark:hover:bg-gray-800",
                isActive
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-400"
              )}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-blue-600 dark:bg-blue-400 rounded-full" />
              )}
              
              <Icon className={cn(
                "w-6 h-6 mb-1 transition-all duration-200",
                isActive ? "text-blue-600 dark:text-blue-400 scale-110" : "text-gray-600 dark:text-gray-400"
              )} />
              <span className={cn(
                "truncate transition-all duration-200",
                isActive ? "text-blue-600 dark:text-blue-400 font-semibold" : "text-gray-600 dark:text-gray-400"
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
