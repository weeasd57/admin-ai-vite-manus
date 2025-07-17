import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  FolderOpen,
  Menu,
  X
} from 'lucide-react';
import { cn } from '../lib/utils';

const sidebarItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/'
  },
  {
    id: 'categories',
    label: 'Categories',
    icon: FolderOpen,
    path: '/categories'
  },
  {
    id: 'products',
    label: 'Products',
    icon: Package,
    path: '/products'
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

export function Sidebar({ activeItem, onItemClick }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleItemClick = (id, path) => {
    if (typeof onItemClick === 'function') {
      onItemClick(id);
    }
    navigate(path);
    setIsOpen(false); // Close sidebar on item click for mobile
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Close sidebar when resizing to desktop view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg shadow-lg md:hidden"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className={cn(
        "bg-white dark:bg-black border-r border-gray-200 dark:border-gray-700 h-screen flex flex-col transition-transform duration-300 ease-in-out",
        "md:w-64 md:relative md:translate-x-0", // Desktop: fixed width
        "fixed left-0 top-0 w-80 z-50", // Mobile: fixed position
        isOpen ? "translate-x-0" : "-translate-x-full" // Control visibility
      )}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">Admin AI</span>
            </div>
            {/* Close button for mobile */}
            <button
              onClick={toggleSidebar}
              className="md:hidden p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Close Sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem ? 
                activeItem === item.id : 
                (item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path));
              
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleItemClick(item.id, item.path)}
                    className={cn(
                      "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors",
                      isActive
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
}


