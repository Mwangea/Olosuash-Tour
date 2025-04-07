import { useState, useEffect } from 'react';
import { FiHeart, FiTrash2, FiCalendar, FiDollarSign, FiInfo, FiRefreshCw } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import api from '../api/axios';
import { formatCurrency, formatDate } from '../utils/format';

interface Tour {
  id: number;
  title: string;
  slug: string;
  price: number;
  discount_price: number | null;
  duration: number;
  difficulty: string;
  cover_image: string;
  added_to_wishlist_at: string;
}

const WishlistSkeleton = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((item) => (
        <div key={item} className="bg-white p-4 rounded-lg border border-gray-200 animate-pulse">
          <div className="flex flex-col gap-4">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-md"></div>
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="flex items-center space-x-3">
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
            <div className="flex flex-row items-center justify-center gap-2">
              <div className="h-10 bg-gray-200 rounded w-full"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const Wishlist = () => {
  const [wishlist, setWishlist] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/tours/wishlist');
      setWishlist(response.data.data.tours);
    } catch (err) {
      setError('Failed to fetch wishlist. Please try again later.');
      console.error('Error fetching wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRefresh = () => {
    fetchWishlist();
  };

  const handleRemoveFromWishlist = async (tourId: number) => {
    try {
      await api.delete(`/tours/${tourId}/wishlist`);
      setWishlist(wishlist.filter(tour => tour.id !== tourId));
    } catch (err) {
      setError('Failed to remove from wishlist. Please try again.');
      console.error('Error removing from wishlist:', err);
    }
  };

  const handleViewTour = (slug: string) => {
    navigate(`/tours/${slug}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F4EA] to-[#E9F5FF] py-6 px-4 lg:py-12 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-[#8B4513]">Your Wishlist</h2>
          <button
            onClick={handleRefresh}
            className="flex items-center justify-center px-4 py-2 bg-[#8B4513] text-white rounded-md hover:bg-[#A0522D] transition-colors w-full md:w-auto"
            disabled={loading}
          >
            <FiRefreshCw className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <WishlistSkeleton />
        ) : wishlist.length === 0 ? (
          <div className="bg-[#F5F0E6] p-8 rounded-lg text-center">
            <div className="flex flex-col items-center justify-center space-y-4">
              <FiHeart className="h-12 w-12 text-[#8B4513]" />
              <p className="text-gray-600 text-lg">Your wishlist is empty</p>
              <p className="text-gray-500 text-sm">Save your favorite tours here for easy access later</p>
              <a 
                href="/tours" 
                className="mt-4 inline-block px-6 py-2 bg-[#8B4513] text-white rounded-md hover:bg-[#A0522D] transition-colors text-sm"
              >
                Browse Tours
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {wishlist.map((tour) => (
              <div key={tour.id} className="bg-[#F5F0E6] p-4 rounded-lg border border-[#E8D9C5]">
                <div className="flex flex-col gap-4">
                  <div className="flex items-start space-x-4">
                    {tour.cover_image && (
                      <img 
                        src={tour.cover_image} 
                        alt={tour.title}
                        className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-[#8B4513] line-clamp-2">{tour.title}</h3>
                      <div className="mt-1 space-y-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <FiDollarSign className="mr-1 flex-shrink-0" />
                          <span>{formatCurrency(tour.discount_price || tour.price)}</span>
                          {tour.discount_price && (
                            <span className="ml-1 text-xs line-through text-gray-400">
                              {formatCurrency(tour.price)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <FiCalendar className="mr-1 flex-shrink-0" />
                          <span>{tour.duration} day{tour.duration !== 1 ? 's' : ''}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-1">
                          <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                            {tour.difficulty}
                          </span>
                          <span className="text-xs text-gray-500">
                            Added {formatDate(tour.added_to_wishlist_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-row justify-between space-x-2">
                    <button
                      onClick={() => handleViewTour(tour.slug)}
                      className="flex items-center justify-center px-3 py-2 bg-[#8B4513] text-white text-sm rounded-md hover:bg-[#A0522D] transition-colors flex-1"
                    >
                      <FiInfo className="mr-1" /> <span>View</span>
                    </button>
                    <button
                      onClick={() => handleRemoveFromWishlist(tour.id)}
                      className="flex items-center justify-center px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors flex-1"
                    >
                      <FiTrash2 className="mr-1" /> <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;