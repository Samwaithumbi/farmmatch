import { useState } from 'react';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';

const MyListings = () => {
  // Initial listings data in KSH
  const [listings, setListings] = useState([
    {
      id: 1,
      crop: "Tomatoes",
      quantity: "200 kg available",
      price: 80, // KSH per kg
      status: "Active",
      inquiries: 5,
      date: "2023-05-15"
    },
    {
      id: 2,
      crop: "Maize",
      quantity: "500 kg available",
      price: 50, // KSH per kg
      status: "Pending",
      inquiries: 2,
      date: "2023-05-18"
    },
    {
      id: 3,
      crop: "Avocados",
      quantity: "150 kg available",
      price: 120, // KSH per kg
      status: "Sold",
      inquiries: 8,
      date: "2023-05-10"
    },
    {
      id: 4,
      crop: "Kale",
      quantity: "100 kg available",
      price: 40, // KSH per kg
      status: "Active",
      inquiries: 3,
      date: "2023-05-20"
    }
  ]);

  // Delete a listing
  const handleDelete = (id) => {
    setListings(listings.filter(listing => listing.id !== id));
  };

  // Toggle listing status
  const toggleStatus = (id) => {
    setListings(listings.map(listing => {
      if (listing.id === id) {
        return {
          ...listing,
          status: listing.status === "Active" ? "Inactive" : "Active"
        };
      }
      return listing;
    }));
  };

  // Format currency to KSH
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Calculate performance metrics
  const performanceMetrics = {
    totalListings: listings.length,
    activeListings: listings.filter(l => l.status === "Active").length,
    successRate: Math.round((listings.filter(l => l.status === "Sold").length / listings.length) * 100) || 0
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">My Listings</h2>
        <button 
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          onClick={() => alert("Add new listing functionality would go here")}
        >
          <FiPlus className="mr-2" />
          Add New Listing
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <div key={listing.id} className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{listing.crop}</h3>
                <p className="text-sm text-gray-500">{listing.quantity}</p>
                <p className="text-xs text-gray-400 mt-1">Posted: {listing.date}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                listing.status === 'Active' ? 'bg-green-100 text-green-800' :
                listing.status === 'Sold' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {listing.status}
              </span>
            </div>
            
            <div className="mb-4">
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(listing.price)}</p>
              <p className="text-sm text-gray-500">per kg</p>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500">Inquiries</p>
                <p className="font-semibold">{listing.inquiries}</p>
              </div>
              <div className="flex space-x-2">
                <button 
                  className="flex items-center px-3 py-1 bg-blue-100 text-blue-600 rounded text-sm hover:bg-blue-200 transition-colors"
                  onClick={() => alert(`Edit listing ${listing.id}`)}
                >
                  <FiEdit2 className="mr-1" /> Edit
                </button>
                <button 
                  className="flex items-center px-3 py-1 bg-red-100 text-red-600 rounded text-sm hover:bg-red-200 transition-colors"
                  onClick={() => handleDelete(listing.id)}
                >
                  <FiTrash2 className="mr-1" /> Remove
                </button>
              </div>
            </div>
            
            {listing.status === 'Active' && (
              <button 
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                onClick={() => alert(`View inquiries for ${listing.crop}`)}
              >
                View Inquiries
              </button>
            )}
            
            {listing.status !== 'Sold' && (
              <button 
                className="w-full mt-2 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                onClick={() => toggleStatus(listing.id)}
              >
                {listing.status === 'Active' ? 'Mark as Inactive' : 'Activate Listing'}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Performance Metrics */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Listing Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{performanceMetrics.totalListings}</p>
            <p className="text-sm text-gray-500">Total Listings</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{performanceMetrics.activeListings}</p>
            <p className="text-sm text-gray-500">Active Listings</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">{performanceMetrics.successRate}%</p>
            <p className="text-sm text-gray-500">Success Rate</p>
          </div>
        </div>
      </div>
      
      {/* Empty State */}
      {listings.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">You don't have any listings yet</p>
          <button 
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            onClick={() => alert("Add new listing flow would start here")}
          >
            Create Your First Listing
          </button>
        </div>
      )}
    </div>
  );
};

export default MyListings;