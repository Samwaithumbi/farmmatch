import { useState, useEffect } from 'react';
import { MapPin, Star, Phone, Mail, Filter } from 'react-feather';

const FindBuyers = () => {
  // State for buyers data
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    productType: '',
    location: '',
    minRating: 0
  });

  // Fetch buyers data (mock API call)
  useEffect(() => {
    const fetchBuyers = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data - in a real app, this would come from an API
        const mockBuyers = [
          {
            id: 1,
            name: "FreshCo Market",
            location: "Nairobi, CBD",
            rating: 4.5,
            demand: "100kg Tomatoes weekly",
            orders: 42,
            phone: "+254700123456",
            email: "orders@freshco.co.ke",
            products: ["tomatoes", "onions"],
            distance: "5km"
          },
          {
            id: 2,
            name: "Green Valley Restaurant",
            location: "Westlands, Nairobi",
            rating: 4.2,
            demand: "50kg Potatoes daily",
            orders: 28,
            phone: "+254711234567",
            email: "supplies@greenvalley.com",
            products: ["potatoes", "carrots"],
            distance: "8km"
          },
          {
            id: 3,
            name: "Organic Foods Ltd",
            location: "Karen, Nairobi",
            rating: 4.8,
            demand: "Mixed seasonal vegetables",
            orders: 65,
            phone: "+254722345678",
            email: "procurement@organicfoods.co.ke",
            products: ["kale", "spinach", "lettuce"],
            distance: "12km"
          },
          {
            id: 4,
            name: "Mama Mboga Wholesale",
            location: "Eastleigh, Nairobi",
            rating: 3.9,
            demand: "200kg Onions bi-weekly",
            orders: 37,
            phone: "+254733456789",
            email: "mamamboga@business.com",
            products: ["onions", "garlic"],
            distance: "7km"
          }
        ];
        
        setBuyers(mockBuyers);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching buyers:", error);
        setLoading(false);
      }
    };

    fetchBuyers();
  }, []);

  // Filter buyers based on selected filters
  const filteredBuyers = buyers.filter(buyer => {
    return (
      (filters.productType === '' || 
       buyer.products.includes(filters.productType.toLowerCase())) &&
      (filters.location === '' || 
       buyer.location.toLowerCase().includes(filters.location.toLowerCase())) &&
      buyer.rating >= filters.minRating
    );
  });

  // Handle contact actions
  const handleContact = (contactMethod, contactInfo) => {
    if (contactMethod === 'phone') {
      window.open(`tel:${contactInfo}`);
    } else if (contactMethod === 'email') {
      window.open(`mailto:${contactInfo}`);
    }
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Find Buyers</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <select
              name="productType"
              value={filters.productType}
              onChange={handleFilterChange}
              className="appearance-none pl-4 pr-8 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Products</option>
              <option value="tomatoes">Tomatoes</option>
              <option value="potatoes">Potatoes</option>
              <option value="onions">Onions</option>
              <option value="kale">Kale</option>
            </select>
            <Filter className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Search and advanced filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input
            type="text"
            name="location"
            placeholder="Search location..."
            value={filters.location}
            onChange={handleFilterChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Rating</label>
          <select
            name="minRating"
            value={filters.minRating}
            onChange={handleFilterChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="0">Any Rating</option>
            <option value="3">3+ Stars</option>
            <option value="4">4+ Stars</option>
            <option value="4.5">4.5+ Stars</option>
          </select>
        </div>
        <div className="flex items-end">
          <button 
            onClick={() => setFilters({
              productType: '',
              location: '',
              minRating: 0
            })}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Buyers List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredBuyers.length > 0 ? (
          filteredBuyers.map((buyer) => (
            <div key={buyer.id} className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{buyer.name}</h3>
                  <p className="text-sm text-gray-500 flex items-center mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {buyer.location} • {buyer.distance} away
                  </p>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm font-medium">{buyer.rating}</span>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Currently seeking:</p>
                <p className="font-medium text-green-700">{buyer.demand}</p>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500">Total Orders</p>
                  <p className="font-semibold">{buyer.orders}</p>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleContact('phone', buyer.phone)}
                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                    aria-label="Call buyer"
                  >
                    <Phone className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleContact('email', buyer.email)}
                    className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                    aria-label="Email buyer"
                  >
                    <Mail className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <button 
                onClick={() => handleContact('phone', buyer.phone)}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                Contact Buyer
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center py-10">
            <p className="text-gray-500">No buyers match your current filters</p>
            <button 
              onClick={() => setFilters({
                productType: '',
                location: '',
                minRating: 0
              })}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Recent Requests Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Recent Buyer Requests</h3>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div className="mb-2 md:mb-0">
              <p className="font-medium">Green Valley Restaurant</p>
              <p className="text-sm text-gray-600">Needs: 50kg Tomatoes, 30kg Lettuce</p>
              <p className="text-xs text-gray-500">Posted 2 hours ago • 5km away</p>
            </div>
            <button 
              onClick={() => handleContact('phone', '+254711234567')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 md:self-start"
            >
              Respond
            </button>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-green-50 rounded-lg">
            <div className="mb-2 md:mb-0">
              <p className="font-medium">Fresh Mart Grocery</p>
              <p className="text-sm text-gray-600">Needs: Mixed seasonal vegetables</p>
              <p className="text-xs text-gray-500">Posted 5 hours ago • 3km away</p>
            </div>
            <button 
              onClick={() => handleContact('phone', '+254722345678')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 md:self-start"
            >
              Respond
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindBuyers;