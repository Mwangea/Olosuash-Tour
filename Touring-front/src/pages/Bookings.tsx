import { useState, useEffect } from 'react';

import { FiCalendar, FiUsers, FiDollarSign, FiTrash2, FiInfo, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import BookingDetailsModal from '../components/BookingDetailsModal';
import CancelBookingModal from '../components/CancelBookingModal';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../api/axios';
import { formatCurrency, formatDate } from '../utils/format';
import { Booking } from '../api/bookingApi';

const Bookings = () => {
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await api.get('/bookings/my-bookings');
        setBookings(response.data.data.bookings);
      } catch (err) {
        setError('Failed to fetch bookings. Please try again later.');
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  const handleCancelBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
  };

  const confirmCancelBooking = async () => {
    if (!selectedBooking) return;

    try {
      setCancelling(true);
      await api.delete(`/bookings/${selectedBooking.id}`);
      
      // Update the bookings list
      setBookings(bookings.map(booking => 
        booking.id === selectedBooking.id 
          ? { ...booking, status: 'cancelled' } 
          : booking
      ));
      
      setShowCancelModal(false);
    } catch (err) {
      setError('Failed to cancel booking. Please try again.');
      console.error('Error cancelling booking:', err);
    } finally {
      setCancelling(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <FiClock className="mr-1" /> Pending
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <FiCheckCircle className="mr-1" /> Approved
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <FiXCircle className="mr-1" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            Unknown
          </span>
        );
    }
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
      <h2 className="text-2xl font-bold text-[#8B4513]">Your Bookings</h2>
      
      {bookings.length === 0 ? (
        <div className="bg-[#F5F0E6] p-6 rounded-lg text-center">
          <p className="text-gray-600">You have no bookings yet.</p>
          <a 
            href="/tours" 
            className="mt-4 inline-block px-4 py-2 bg-[#8B4513] text-white rounded-md hover:bg-[#A0522D] transition-colors"
          >
            Browse Tours
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-[#F5F0E6] p-6 rounded-lg border border-[#E8D9C5]">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-lg font-semibold text-[#8B4513]">{booking.tour_title}</h3>
                  <div className="flex items-center mt-2 text-gray-600">
                    <FiCalendar className="mr-2" />
                    <span>{formatDate(booking.travel_date)}</span>
                  </div>
                  <div className="flex items-center mt-1 text-gray-600">
                    <FiUsers className="mr-2" />
                    <span>{booking.number_of_travelers} traveler{booking.number_of_travelers !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center mt-1 text-gray-600">
                    <FiDollarSign className="mr-2" />
                    <span>{formatCurrency(booking.total_price)}</span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="mb-2 sm:mb-0">
                    {getStatusBadge(booking.status)}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewDetails(booking)}
                      className="flex items-center px-3 py-2 bg-[#8B4513] text-white rounded-md hover:bg-[#A0522D] transition-colors"
                    >
                      <FiInfo className="mr-1" /> Details
                    </button>
                    {booking.status !== 'cancelled' && (
                      <button
                        onClick={() => handleCancelBooking(booking)}
                        className="flex items-center px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                      >
                        <FiTrash2 className="mr-1" /> Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Details Modal */}
      {selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
        />
      )}

      {/* Cancel Booking Modal */}
      {selectedBooking && (
        <CancelBookingModal
          booking={selectedBooking}
          isOpen={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          onConfirm={confirmCancelBooking}
          isLoading={cancelling}
        />
      )}
    </div>
  );
};

export default Bookings;