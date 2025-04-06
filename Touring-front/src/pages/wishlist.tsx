import { useState, useEffect } from 'react';
import { FiHeart, FiTrash2, FiCalendar, FiDollarSign, FiInfo } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
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

const Wishlist = () => {
  const [wishlist, setWishlist] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const response = await api.get('/tours/wishlist');
        setWishlist(response.data.data.tours);
      } catch (err) {
        setError('Failed to fetch wishlist. Please try again later.');
        console.error('Error fetching wishlist:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
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
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#8B4513]">Your Wishlist</h2>
      
      {wishlist.length === 0 ? (
        <div className="bg-[#F5F0E6] p-6 rounded-lg text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <FiHeart className="h-12 w-12 text-[#8B4513]" />
            <p className="text-gray-600">Your wishlist is empty</p>
            <p className="text-gray-500 text-sm">Save your favorite tours here for easy access later</p>
            <a 
              href="/tours" 
              className="mt-4 inline-block px-4 py-2 bg-[#8B4513] text-white rounded-md hover:bg-[#A0522D] transition-colors"
            >
              Browse Tours
            </a>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {wishlist.map((tour) => (
            <div key={tour.id} className="bg-[#F5F0E6] p-6 rounded-lg border border-[#E8D9C5]">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-start space-x-4 mb-4 md:mb-0">
                  {tour.cover_image && (
                    <img 
                      src={tour.cover_image} 
                      alt={tour.title}
                      className="w-24 h-24 object-cover rounded-md"
                    />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-[#8B4513]">{tour.title}</h3>
                    <div className="flex items-center mt-2 text-gray-600">
                      <FiDollarSign className="mr-2" />
                      <span>{formatCurrency(tour.discount_price || tour.price)}</span>
                      {tour.discount_price && (
                        <span className="ml-2 text-sm line-through text-gray-400">
                          {formatCurrency(tour.price)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center mt-1 text-gray-600">
                      <FiCalendar className="mr-2" />
                      <span>{tour.duration} day{tour.duration !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="mt-1">
                      <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                        {tour.difficulty}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      Added on {formatDate(tour.added_to_wishlist_at)}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewTour(tour.slug)}
                      className="flex items-center px-3 py-2 bg-[#8B4513] text-white rounded-md hover:bg-[#A0522D] transition-colors"
                    >
                      <FiInfo className="mr-1" /> View Tour
                    </button>
                    <button
                      onClick={() => handleRemoveFromWishlist(tour.id)}
                      className="flex items-center px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                      <FiTrash2 className="mr-1" /> Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;