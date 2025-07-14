import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Products } from './pages/Products';
import { Orders } from './pages/Orders';
import { Users } from './pages/Users';
import { Categories } from './pages/Categories';
import { Settings } from './pages/Settings';
import { Usage } from './pages/Usage';
import { AdminPlanLimits } from './pages/AdminPlanLimits';
import './App.css';

function App() {
  const [activeItem, setActiveItem] = useState('dashboard');

  const renderPage = () => {
    switch (activeItem) {
      case 'dashboard':
        return <Dashboard />;
      case 'categories':
        return <Categories />;
      case 'products':
        return <Products />;
      case 'orders':
        return <Orders />;
      case 'users':
        return <Users />;
      case 'usage':
        return <Usage />;
      case 'admin-plan-limits':
        return <AdminPlanLimits />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeItem={activeItem} onItemClick={setActiveItem} />
      <main className="flex-1 overflow-auto">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;

