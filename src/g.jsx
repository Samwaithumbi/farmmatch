import React, { useState, useEffect } from 'react';
import { Search, Bell, MapPin, TrendingUp, Users, ShoppingCart, Star, Phone, Mail, Calendar, DollarSign, Package, AlertCircle, Filter, Menu, X, User, Home, BarChart3, MessageCircle, Settings } from 'lucide-react';
import Dashboard from './dashboard';
import MarketPrices from './marketprice';
import FindBuyers from './findBuyer';
import MyListings from './myListings';

const AgritechPlatform = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userType, setUserType] = useState('farmer'); // farmer or buyer
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState('all');
  const [priceAlerts, setPriceAlerts] = useState([]);

  // Mock data
  const marketPrices = [
    { crop: 'Tomatoes', price: 45, change: 12, location: 'Central Market', quality: 'Grade A' },
    { crop: 'Onions', price: 28, change: -5, location: 'Wholesale Hub', quality: 'Grade B' },
    { crop: 'Potatoes', price: 22, change: 8, location: 'Farmers Market', quality: 'Grade A' },
    { crop: 'Carrots', price: 35, change: 15, location: 'Local Co-op', quality: 'Organic' },
  ];

  const buyers = [
    { name: 'Green Valley Restaurant', location: '2.3 km away', demand: 'Tomatoes, Lettuce', rating: 4.8, orders: 45 },
    { name: 'Fresh Mart Grocery', location: '5.1 km away', demand: 'Mixed Vegetables', rating: 4.6, orders: 120 },
    { name: 'Farm Fresh Co-op', location: '8.7 km away', demand: 'Organic Produce', rating: 4.9, orders: 78 },
  ];

  const myListings = [
    { crop: 'Tomatoes', quantity: '500 kg', price: 45, status: 'Active', inquiries: 12 },
    { crop: 'Onions', quantity: '300 kg', price: 28, status: 'Sold', inquiries: 8 },
    { crop: 'Carrots', quantity: '200 kg', price: 35, status: 'Pending', inquiries: 5 },
  ];

  const Navigation = () => (
    <nav className="bg-green-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Package className="h-8 w-8 text-green-200" />
              <span className="ml-2 text-xl font-bold">FarmMatch</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-green-700 px-3 py-1 rounded-full">
              <User className="h-4 w-4" />
              <span className="text-sm">John Farmer</span>
            </div>
            <Bell className="h-6 w-6 cursor-pointer hover:text-green-200" />
          </div>
          
          <button 
            className="md:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
    </nav>
  );

  const Sidebar = () => (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0`}>
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-gray-800">Menu</span>
            <button 
              className="md:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Home },
              { id: 'markets', label: 'Market Prices', icon: TrendingUp },
              { id: 'buyers', label: 'Find Buyers', icon: Users },
              { id: 'listings', label: 'My Listings', icon: Package },
              { id: 'messages', label: 'Messages', icon: MessageCircle },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => {
                  setActiveTab(id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-3 py-2 rounded-md text-left transition-colors ${
                  activeTab === id 
                    ? 'bg-green-100 text-green-700 border-r-2 border-green-500' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {label}
              </button>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
<div>
<Dashboard />

<MarketPrices />
<FindBuyers/>
<MyListings/>
</div>
 

  
  

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'markets': return <MarketPrices />;
      case 'buyers': return <FindBuyers />;
      case 'listings': return <MyListings />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6 md:ml-0">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
      
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AgritechPlatform;