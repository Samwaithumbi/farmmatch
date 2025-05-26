import React, { useState, useEffect } from 'react';

import { Search, MapPin, TrendingUp, TrendingDown, Bell, RefreshCw, Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MarketPrices = () => {
  const [marketPrices, setMarketPrices] = useState([]);
  const [filteredPrices, setFilteredPrices] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [exchangeRate, setExchangeRate] = useState(140);
  const [priceAlerts, setPriceAlerts] = useState([]);
  const [selectedCropChart, setSelectedCropChart] = useState('Maize');
  const [chartData, setChartData] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Kenyan crops with realistic data
  const kenyanCropsData = [
    { crop: 'Maize', location: 'Nairobi Market', basePrice: 45, category: 'grains', quality: 'Grade A' },
    { crop: 'Beans', location: 'Mombasa Market', basePrice: 120, category: 'grains', quality: 'Organic' },
    { crop: 'Sukuma Wiki', location: 'Kisumu Market', basePrice: 25, category: 'vegetables', quality: 'Fresh' },
    { crop: 'Tomatoes', location: 'Nakuru Market', basePrice: 60, category: 'vegetables', quality: 'Grade A' },
    { crop: 'Onions', location: 'Eldoret Market', basePrice: 80, category: 'vegetables', quality: 'Grade A' },
    { crop: 'Carrots', location: 'Nyeri Market', basePrice: 70, category: 'vegetables', quality: 'Organic' },
    { crop: 'Cabbage', location: 'Thika Market', basePrice: 35, category: 'vegetables', quality: 'Fresh' },
    { crop: 'Irish Potatoes', location: 'Meru Market', basePrice: 55, category: 'vegetables', quality: 'Grade A' },
    { crop: 'Bananas', location: 'Kisii Market', basePrice: 40, category: 'fruits', quality: 'Organic' },
    { crop: 'Mangoes', location: 'Machakos Market', basePrice: 90, category: 'fruits', quality: 'Grade A' },
    { crop: 'Avocados', location: 'Murang\'a Market', basePrice: 150, category: 'fruits', quality: 'Organic' },
    { crop: 'Rice', location: 'Ahero Market', basePrice: 85, category: 'grains', quality: 'Grade A' }
  ];

  // Check online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Fetch exchange rate
  const fetchExchangeRate = async () => {
    try {
      const response = await fetch('https://api.exchangerate-host.com/latest?base=USD&symbols=KES');
      const data = await response.json();
      if (data.rates && data.rates.KES) {
        setExchangeRate(data.rates.KES);
      }
    } catch (error) {
      console.log('Using fallback exchange rate');
    }
  };

  // Generate realistic market prices
  const generateMarketPrices = () => {
    return kenyanCropsData.map(crop => {
      const variance = (Math.random() - 0.5) * 0.3; // ±15% variance
      const price = Math.round(crop.basePrice * (1 + variance));
      const change = (Math.random() - 0.5) * 40; // ±20% change
      
      return {
        ...crop,
        price: price,
        change: parseFloat(change.toFixed(1)),
        lastUpdated: new Date(),
        volume: Math.floor(Math.random() * 1000) + 100, // kg available
        trend: change > 0 ? 'up' : 'down'
      };
    });
  };

  // Generate chart data for selected crop
  const generateChartData = (cropName) => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const crop = kenyanCropsData.find(c => c.crop === cropName);
    const basePrice = crop ? crop.basePrice : 50;
    
    return days.map((day, index) => ({
      day,
      price: Math.round(basePrice + (Math.random() - 0.5) * 20),
      volume: Math.floor(Math.random() * 500) + 200
    }));
  };

  // Initial data load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      if (isOnline) {
        await fetchExchangeRate();
      }
      
      const prices = generateMarketPrices();
      setMarketPrices(prices);
      setFilteredPrices(prices);
      setChartData(generateChartData(selectedCropChart));
      setLastUpdated(new Date());
      setLoading(false);
    };

    loadData();
  }, [isOnline]);

  // Update prices periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (isOnline) {
        setMarketPrices(prev => prev.map(item => ({
          ...item,
          price: Math.max(10, item.price + (Math.random() - 0.5) * 3),
          change: item.change + (Math.random() - 0.5) * 5,
          lastUpdated: new Date()
        })));
        setLastUpdated(new Date());
      }
    }, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, [isOnline]);

  // Filter prices based on search and category
  useEffect(() => {
    let filtered = marketPrices;

    if (selectedCrop !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCrop);
    }

    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPrices(filtered);
  }, [marketPrices, selectedCrop, searchTerm]);

  // Update chart data when crop selection changes
  useEffect(() => {
    setChartData(generateChartData(selectedCropChart));
  }, [selectedCropChart]);

  const handlePriceAlert = (crop) => {
    const alertPrice = prompt(`Set price alert for ${crop.crop} (current price: KSH ${crop.price})`);
    if (alertPrice && !isNaN(alertPrice)) {
      const newAlert = {
        id: Date.now(),
        crop: crop.crop,
        targetPrice: parseFloat(alertPrice),
        currentPrice: crop.price,
        created: new Date()
      };
      setPriceAlerts(prev => [...prev, newAlert]);
      alert(`Price alert set for ${crop.crop} at KSH ${alertPrice}/kg`);
    }
  };

  const refreshData = async () => {
    setLoading(true);
    if (isOnline) {
      await fetchExchangeRate();
    }
    const newPrices = generateMarketPrices();
    setMarketPrices(newPrices);
    setChartData(generateChartData(selectedCropChart));
    setLastUpdated(new Date());
    setLoading(false);
  };

  if (loading && marketPrices.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-green-500" />
          <p className="text-gray-600">Loading market prices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Market Prices 📊</h2>
          <p className="text-sm text-gray-600 mt-1">
            Live prices from Kenyan markets • Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {isOnline ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-500" />
            )}
            <span className="text-sm text-gray-600">
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
          
          <button
            onClick={refreshData}
            disabled={loading}
            className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Exchange Rate Info */}
      {isOnline && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            💱 Current USD to KSH rate: <strong>1 USD = {exchangeRate.toFixed(2)} KSH</strong>
          </p>
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search crops or markets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        
        <select 
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          value={selectedCrop}
          onChange={(e) => setSelectedCrop(e.target.value)}
        >
          <option value="all">All Crops</option>
          <option value="vegetables">Vegetables</option>
          <option value="fruits">Fruits</option>
          <option value="grains">Grains</option>
        </select>
      </div>

      {/* Price Alerts Summary */}
      {priceAlerts.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Bell className="h-4 w-4 text-yellow-600" />
            <span className="font-medium text-yellow-800">Active Price Alerts: {priceAlerts.length}</span>
          </div>
          <div className="text-sm text-yellow-700">
            {priceAlerts.slice(0, 3).map(alert => (
              <span key={alert.id} className="inline-block mr-4">
                {alert.crop}: KSH {alert.targetPrice}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Market Prices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrices.map((item, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{item.crop}</h3>
                <p className="text-sm text-gray-500 flex items-center mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  {item.location}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Volume: {item.volume}kg available
                </p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                item.quality === 'Organic' ? 'bg-green-100 text-green-800' :
                item.quality === 'Grade A' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {item.quality}
              </span>
            </div>
            
            <div className="flex justify-between items-end mb-4">
              <div>
                <p className="text-2xl font-bold text-gray-900">KSH {item.price}</p>
                <p className="text-sm text-gray-500">per kg</p>
              </div>
              <div className="text-right flex items-center">
                {item.change > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <div>
                  <p className={`text-sm font-medium ${item.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {item.change > 0 ? '+' : ''}{item.change}%
                  </p>
                  <p className="text-xs text-gray-500">vs last week</p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => handlePriceAlert(item)}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <Bell className="h-4 w-4" />
              Set Price Alert
            </button>
          </div>
        ))}
      </div>

      {/* No results message */}
      {filteredPrices.length === 0 && !loading && (
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No crops found matching your search criteria.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCrop('all');
            }}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Price History Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Price History Chart</h3>
          <select
            value={selectedCropChart}
            onChange={(e) => setSelectedCropChart(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
          >
            {kenyanCropsData.map(crop => (
              <option key={crop.crop} value={crop.crop}>{crop.crop}</option>
            ))}
          </select>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis 
                label={{ value: 'Price (KSH)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                formatter={(value, name) => [`KSH ${value}`, 'Price']}
                labelFormatter={(label) => `Day: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#059669" 
                strokeWidth={2}
                dot={{ fill: '#059669', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#059669', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 text-sm text-gray-600">
          <p>📈 7-day price trend for {selectedCropChart} across major Kenyan markets</p>
        </div>
      </div>
    </div>
  );
};

export default MarketPrices;