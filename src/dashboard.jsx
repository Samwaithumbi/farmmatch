import React, { useState, useEffect } from 'react';
import { DollarSign, Package, Users, Bell, TrendingUp, TrendingDown, Calendar, MapPin, RefreshCw, Wifi, WifiOff } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    revenue: 0,
    listings: 0,
    buyers: 0,
    alerts: 0
  });

  const [marketPrices, setMarketPrices] = useState([]);
  const [weather, setWeather] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(140); // USD to KSH approximation
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const [harvests, setHarvests] = useState([
    { crop: 'Maize', field: 'Field A', expected: 500, daysLeft: 3, color: 'green' },
    { crop: 'Beans', field: 'Field B', expected: 300, daysLeft: 7, color: 'blue' },
    { crop: 'Sukuma Wiki', field: 'Field C', expected: 200, daysLeft: 14, color: 'purple' },
    { crop: 'Tomatoes', field: 'Field D', expected: 400, daysLeft: 21, color: 'red' }
  ]);

  const [notifications, setNotifications] = useState([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');

  // Kenyan crops and their typical price ranges (in KSH per kg)
  const kenyanCrops = [
    { name: 'Maize', basePrice: 45, location: 'Nairobi Market' },
    { name: 'Beans', basePrice: 120, location: 'Mombasa Market' },
    { name: 'Sukuma Wiki', basePrice: 25, location: 'Kisumu Market' },
    { name: 'Tomatoes', basePrice: 60, location: 'Nakuru Market' },
    { name: 'Onions', basePrice: 80, location: 'Eldoret Market' },
    { name: 'Carrots', basePrice: 70, location: 'Nyeri Market' },
    { name: 'Cabbage', basePrice: 35, location: 'Thika Market' },
    { name: 'Irish Potatoes', basePrice: 55, location: 'Meru Market' }
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
      // Keep default rate if API fails
    }
  };

  // Fetch weather data for Nairobi (can be made location-specific)
  const fetchWeather = async () => {
    try {
      // Using a free weather API (OpenWeatherMap alternative)
      const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-1.2921&longitude=36.8219&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=Africa/Nairobi');
      const data = await response.json();
      
      if (data.current_weather) {
        setWeather({
          temperature: Math.round(data.current_weather.temperature),
          description: getWeatherDescription(data.current_weather.weathercode),
          precipitation: data.daily.precipitation_sum[0] || 0
        });
      }
    } catch (error) {
      console.log('Weather data unavailable');
    }
  };

  // Get weather description from weather code
  const getWeatherDescription = (code) => {
    const weatherCodes = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Foggy',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain'
    };
    return weatherCodes[code] || 'Unknown';
  };

  // Simulate market price data with realistic Kenyan variations
  const generateMarketPrices = () => {
    return kenyanCrops.map(crop => ({
      crop: crop.name,
      location: crop.location,
      price: crop.basePrice + (Math.random() - 0.5) * 20,
      change: (Math.random() - 0.5) * 30
    }));
  };

  // Generate realistic farm statistics
  const generateStats = () => {
    const baseRevenue = 750000; // Base monthly revenue in KSH
    const multiplier = getTimeframeMultiplier();
    
    setStats({
      revenue: Math.round(baseRevenue * multiplier * (0.8 + Math.random() * 0.4)),
      listings: Math.floor(5 + Math.random() * 10),
      buyers: Math.floor(15 + Math.random() * 20),
      alerts: Math.floor(2 + Math.random() * 5)
    });
  };

  // Generate notifications based on current data
  const generateNotifications = () => {
    const notificationTemplates = [
      { message: "Maize prices increased by 15% in Nairobi Market", type: "success" },
      { message: "New buyer inquiry for beans from Mombasa", type: "info" },
      { message: "Weather alert: Heavy rains expected this week", type: "warning" },
      { message: "Sukuma Wiki harvest ready in Field C", type: "success" },
      { message: "Low stock alert: Only 2 days of seeds remaining", type: "warning" },
      { message: "Payment received: KSH 45,000 from recent sale", type: "success" }
    ];

    const randomNotifications = notificationTemplates
      .sort(() => 0.5 - Math.random())
      .slice(0, 4)
      .map((notif, index) => ({
        id: Date.now() + index,
        ...notif,
        read: Math.random() > 0.6,
        timestamp: new Date(Date.now() - Math.random() * 86400000) // Random time within last 24h
      }));

    setNotifications(randomNotifications);
  };

  // Initial data load
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      
      if (isOnline) {
        await Promise.all([
          fetchExchangeRate(),
          fetchWeather()
        ]);
      }
      
      setMarketPrices(generateMarketPrices());
      generateStats();
      generateNotifications();
      setLastUpdated(new Date());
      setLoading(false);
    };

    loadInitialData();
  }, [isOnline]);

  // Regular data updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (isOnline) {
        // Update market prices with realistic fluctuations
        setMarketPrices(prev => prev.map(item => ({
          ...item,
          price: Math.max(10, item.price + (Math.random() - 0.5) * 5),
          change: item.change + (Math.random() - 0.5) * 10
        })));
        
        setLastUpdated(new Date());
      }
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [isOnline]);

  const handleStatClick = (statType) => {
    switch(statType) {
      case 'revenue':
        setStats(prev => ({ ...prev, revenue: prev.revenue + Math.floor(Math.random() * 50000) }));
        break;
      case 'listings':
        setStats(prev => ({ ...prev, listings: prev.listings + 1 }));
        break;
      case 'buyers':
        setStats(prev => ({ ...prev, buyers: prev.buyers + Math.floor(Math.random() * 3) }));
        break;
      case 'alerts':
        const newAlert = {
          id: Date.now(),
          message: `Price alert: ${marketPrices[Math.floor(Math.random() * marketPrices.length)]?.crop || 'Crop'} price changed significantly`,
          type: "info",
          read: false,
          timestamp: new Date()
        };
        setNotifications(prev => [newAlert, ...prev]);
        setStats(prev => ({ ...prev, alerts: prev.alerts + 1 }));
        break;
    }
  };

  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const getTimeframeMultiplier = () => {
    switch(selectedTimeframe) {
      case 'week': return 0.25;
      case 'month': return 1;
      case 'quarter': return 3;
      case 'year': return 12;
      default: return 1;
    }
  };

  const refreshData = async () => {
    setLoading(true);
    if (isOnline) {
      await fetchExchangeRate();
      await fetchWeather();
    }
    setMarketPrices(generateMarketPrices());
    generateStats();
    setLastUpdated(new Date());
    setLoading(false);
  };

  if (loading && marketPrices.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-green-500" />
          <p className="text-gray-600">Loading farm dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold mb-2">Welcome, John! 🌾</h2>
              <p className="text-green-100">Hali ya shamba lako leo</p>
              {weather && (
                <p className="text-sm text-green-200 mt-2">
                  🌡️ {weather.temperature}°C - {weather.description}
                  {weather.precipitation > 0 && ` - ${weather.precipitation}mm rain expected`}
                </p>
              )}
            </div>
            <div className="text-right">
              <div className="flex items-center mb-2">
                {isOnline ? (
                  <Wifi className="h-4 w-4 mr-2 text-green-200" />
                ) : (
                  <WifiOff className="h-4 w-4 mr-2 text-red-200" />
                )}
                <span className="text-sm">{isOnline ? 'Online' : 'Offline'}</span>
              </div>
              <p className="text-sm opacity-75">Last updated</p>
              <p className="font-medium">{lastUpdated.toLocaleTimeString()}</p>
              <button
                onClick={refreshData}
                disabled={loading}
                className="mt-2 px-3 py-1 bg-white/20 rounded text-sm hover:bg-white/30 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`h-3 w-3 inline mr-1 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
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

        {/* Timeframe Selector */}
        <div className="flex justify-center">
          <div className="bg-white rounded-lg p-1 shadow-sm border">
            {['week', 'month', 'quarter', 'year'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedTimeframe(period)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedTimeframe === period
                    ? 'bg-green-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div 
            onClick={() => handleStatClick('revenue')}
            className="bg-white p-6 rounded-xl shadow-sm border cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">KSH {stats.revenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-12 w-12 text-green-500" />
            </div>
            <p className="text-xs text-green-600 mt-2 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% from last {selectedTimeframe}
            </p>
          </div>

          <div 
            onClick={() => handleStatClick('listings')}
            className="bg-white p-6 rounded-xl shadow-sm border cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Listings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.listings}</p>
              </div>
              <Package className="h-12 w-12 text-blue-500" />
            </div>
            <p className="text-xs text-blue-600 mt-2">3 new inquiries today</p>
          </div>

          <div 
            onClick={() => handleStatClick('buyers')}
            className="bg-white p-6 rounded-xl shadow-sm border cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Potential Buyers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.buyers}</p>
              </div>
              <Users className="h-12 w-12 text-purple-500" />
            </div>
            <p className="text-xs text-purple-600 mt-2">5 new this week</p>
          </div>

          <div 
            onClick={() => handleStatClick('alerts')}
            className="bg-white p-6 rounded-xl shadow-sm border cursor-pointer hover:shadow-md transition-shadow relative"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Price Alerts</p>
                <p className="text-2xl font-bold text-gray-900">{stats.alerts}</p>
              </div>
              <Bell className="h-12 w-12 text-orange-500" />
            </div>
            <p className="text-xs text-orange-600 mt-2">Click to create new alert</p>
            {notifications.filter(n => !n.read).length > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                {notifications.filter(n => !n.read).length}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Market Prices */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Live Market Prices</h3>
              <div className={`animate-pulse h-2 w-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            </div>
            <div className="space-y-4">
              {marketPrices.slice(0, 5).map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div>
                    <p className="font-medium">{item.crop}</p>
                    <p className="text-sm text-gray-500 flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {item.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">KSH {item.price.toFixed(0)}/kg</p>
                    <p className={`text-sm flex items-center ${item.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {item.change > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                      {item.change > 0 ? '+' : ''}{item.change.toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Harvests */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Mavuno Yanayokuja
            </h3>
            <div className="space-y-4">
              {harvests.map((harvest, index) => (
                <div key={index} className={`flex items-center justify-between p-3 bg-${harvest.color}-50 rounded-lg border border-${harvest.color}-100 hover:bg-${harvest.color}-100 transition-colors cursor-pointer`}>
                  <div>
                    <p className="font-medium">{harvest.crop}</p>
                    <p className="text-sm text-gray-600">{harvest.field} - {harvest.expected}kg expected</p>
                  </div>
                  <div className={`text-sm text-${harvest.color}-600 font-medium px-2 py-1 bg-white rounded`}>
                    {harvest.daysLeft === 1 ? 'Kesho' : harvest.daysLeft < 7 ? `${harvest.daysLeft} days` : `${Math.ceil(harvest.daysLeft/7)} week${harvest.daysLeft > 7 ? 's' : ''}`}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Recent Notifications</h3>
            <div className="space-y-3">
              {notifications.slice(0, 5).map((notification) => (
                <div 
                  key={notification.id}
                  onClick={() => markNotificationRead(notification.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    notification.read 
                      ? 'bg-gray-50 text-gray-600' 
                      : notification.type === 'success' 
                        ? 'bg-green-50 text-green-800 border border-green-200' 
                        : notification.type === 'warning'
                          ? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                          : 'bg-blue-50 text-blue-800 border border-blue-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm">{notification.message}</p>
                      {notification.timestamp && (
                        <p className="text-xs opacity-60 mt-1">
                          {notification.timestamp.toLocaleString()}
                        </p>
                      )}
                    </div>
                    {!notification.read && (
                      <div className="h-2 w-2 bg-blue-500 rounded-full ml-2 mt-1"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p>Farm Management Dashboard - Designed for Kenyan Farmers 🇰🇪</p>
          <p className="text-xs mt-1">Real-time updates • Offline support • KSH currency</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;