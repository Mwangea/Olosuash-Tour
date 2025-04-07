// components/WishlistIcon.tsx
import { useState, useEffect } from 'react';
import { FiHeart } from 'react-icons/fi';
import api from '../api/axios';
import toast from 'react-hot-toast';

interface WishlistIconProps {
  tourId: string;
  size?: number;
  className?: string;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

const WishlistIcon = ({ 
  tourId, 
  size = 24, 
  className = '',
  position = 'top-right'
}: WishlistIconProps) => {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hover, setHover] = useState(false);


  useEffect(() => {
    const checkWishlistStatus = async () => {
      try {
        const response = await api.get(`/tours/${tourId}/wishlist/check`);
        setIsInWishlist(response.data.data.isInWishlist);
      } catch (err) {
        console.error('Error checking wishlist status:', err);
      }
    };

    checkWishlistStatus();
  }, [tourId]);

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling to parent elements
    if (loading) return;
    
    setLoading(true);
   
    
    try {
      if (isInWishlist) {
        await api.delete(`/tours/${tourId}/wishlist`);
        setIsInWishlist(false);
        toast.success('Removed from wishlist');
      } else {
        await api.post(`/tours/${tourId}/wishlist`);
        setIsInWishlist(true);
        toast.success('Added to wishlist');
      }
    } catch (err) {
      ;
      console.error('Error updating wishlist:', err);
      toast.error('Failed to update wishlist');
    } finally {
      setLoading(false);
    }
  };

  // Position classes
  const positionClasses = {
    'top-right': 'top-2 right-2',
    'top-left': 'top-2 left-2',
    'bottom-right': 'bottom-2 right-2',
    'bottom-left': 'bottom-2 left-2'
  };

  return (
    <button
      onClick={toggleWishlist}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      disabled={loading}
      className={`absolute ${positionClasses[position]} z-10 p-2 rounded-full bg-white bg-opacity-80 transition-all duration-200 ${
        loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-100 hover:scale-110'
      } ${className}`}
      aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <FiHeart
        size={size}
        className={`transition-colors duration-200 ${
          isInWishlist 
            ? 'fill-red-500 text-red-500' 
            : hover 
              ? 'text-gray-600' 
              : 'text-gray-400'
        }`}
      />
    </button>
  );
};

export default WishlistIcon;