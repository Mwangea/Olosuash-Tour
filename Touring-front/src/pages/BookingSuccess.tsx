
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { FaCheckCircle } from 'react-icons/fa';
import { useBooking } from '../context/BookingContext';

export const BookingSuccess = () => {
  const { bookingSuccess, setBookingSuccess } = useBooking();
  const navigate = useNavigate();

  useEffect(() => {
    if (!bookingSuccess) {
    //  navigate('/tours');
    }
    return () => {
      setBookingSuccess(false);
    };
  }, [bookingSuccess, navigate, setBookingSuccess]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F4EA] to-[#E9F5FF] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="flex justify-center text-6xl text-green-500 mb-4">
          <FaCheckCircle />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Booking Confirmed!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your booking. We've sent a confirmation to your email.
          You can view your bookings in your account dashboard.
        </p>
        <div className="flex flex-col space-y-3">
          <Link
            to="/profile/bookings"
            className="px-6 py-3 bg-[#8B6B3D] text-white rounded-lg hover:bg-[#6B4F2D] transition"
          >
            View My Bookings
          </Link>
          <Link
            to="/tours"
            className="px-6 py-3 border border-[#8B6B3D] text-[#8B6B3D] rounded-lg hover:bg-gray-50 transition"
          >
            Browse More Tours
          </Link>
        </div>
      </div>
    </div>
  );
};