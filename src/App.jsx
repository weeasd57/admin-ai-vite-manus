import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { Sidebar } from './components/Sidebar';
import { BottomNavBar } from './components/BottomNavBar';
import { TopBar } from './components/TopBar';
import { Dashboard } from './pages/Dashboard';
import { Products } from './pages/Products';
import { Orders } from './pages/Orders';
import { Users } from './pages/Users';
import { Categories } from './pages/Categories';
import { Settings } from './pages/Settings';
import './App.css';

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="flex h-screen bg-gray-50 dark:bg-black overflow-hidden">
        <Sidebar />
        <TopBar />
        <main className="flex-1 overflow-auto w-full">
          <div className="pt-14 pb-20 md:pt-0 md:pb-0 min-h-full"> {/* Add padding for mobile top and bottom bars */}
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/products" element={<Products />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/users" element={<Users />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </main>
        <BottomNavBar />
      </div>
    </ThemeProvider>
  );
}

export default App;


