import React from 'react';
import { useLocation } from 'react-router-dom';

const pageTitles = {
  '/': 'Dashboard',
  '/categories': 'Categories',
  '/products': 'Products',
  '/orders': 'Orders',
  '/users': 'Users',
  '/settings': 'Settings'
};

export function TopBar() {
  const location = useLocation();
  
  const getPageTitle = () => {
    return pageTitles[location.pathname] || 'Admin AI';
  };

  return (
    <div className="fixed top-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 md:hidden z-40 shadow-sm">
      <div className="flex items-center justify-center px-4 py-3 h-14">
        {/* Logo and Title - centered */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">AI</span>
          </div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            {getPageTitle()}
          </h1>
        </div>
      </div>
    </div>
  );
}
