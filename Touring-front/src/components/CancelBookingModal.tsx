import { FiAlertTriangle, FiX } from 'react-icons/fi';
import { Booking } from '../api/bookingApi';

interface CancelBookingModalProps {
  booking: Booking;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

const CancelBookingModal = ({ 
  booking, 
  isOpen, 
  onClose, 
  onConfirm, 
  isLoading 
}: CancelBookingModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-[#8B4513]">Cancel Booking</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiX size={24} />
            </button>
          </div>

          <div className="flex items-start mb-6">
            <FiAlertTriangle className="text-yellow-500 mr-3 mt-1" size={24} />
            <div>
              <p className="text-gray-700 mb-2">
                Are you sure you want to cancel your booking for <strong>{booking.tour_title}</strong> on {new Date(booking.travel_date).toLocaleDateString()}?
              </p>
              <p className="text-gray-600">
                This action cannot be undone. Any payments made may be refunded according to our cancellation policy.
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={isLoading}
            >
              Go Back
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-400"
              disabled={isLoading}
            >
              {isLoading ? 'Cancelling...' : 'Confirm Cancellation'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelBookingModal;