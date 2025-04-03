import { FiCalendar, FiUsers, FiDollarSign, FiCreditCard, FiMessageSquare, FiX } from 'react-icons/fi';
import { formatCurrency, formatDate } from '../utils/format';
import { Booking } from '../api/bookingApi';


interface BookingDetailsModalProps {
  booking: Booking;
  isOpen: boolean;
  onClose: () => void;
}

const BookingDetailsModal = ({ booking, isOpen, onClose }: BookingDetailsModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-[#8B4513]">Booking Details</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiX size={24} />
            </button>
          </div>

          <div className="space-y-4">
            <div className="border-b pb-4">
              <h4 className="text-lg font-semibold text-[#8B4513] mb-2">{booking.tour_title}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <FiCalendar className="mr-2 text-[#8B4513]" />
                  <div>
                    <p className="text-sm text-gray-500">Travel Date</p>
                    <p className="font-medium">{formatDate(booking.travel_date)}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FiUsers className="mr-2 text-[#8B4513]" />
                  <div>
                    <p className="text-sm text-gray-500">Travelers</p>
                    <p className="font-medium">{booking.number_of_travelers}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FiDollarSign className="mr-2 text-[#8B4513]" />
                  <div>
                    <p className="text-sm text-gray-500">Total Price</p>
                    <p className="font-medium">{formatCurrency(booking.total_price)}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FiCreditCard className="mr-2 text-[#8B4513]" />
                  <div>
                    <p className="text-sm text-gray-500">Payment Method</p>
                    <p className="font-medium capitalize">{booking.payment_method}</p>
                  </div>
                </div>
              </div>
            </div>

            {booking.special_requests && (
              <div>
                <h4 className="text-md font-semibold text-[#8B4513] mb-2">Special Requests</h4>
                <div className="flex items-start">
                  <FiMessageSquare className="mr-2 text-[#8B4513] mt-1" />
                  <p className="text-gray-700">{booking.special_requests}</p>
                </div>
              </div>
            )}

            <div>
              <h4 className="text-md font-semibold text-[#8B4513] mb-2">Status History</h4>
              <div className="space-y-2">
                {booking.status_history?.map((status, index) => (
                  <div key={index} className="flex items-start">
                    <div className="mr-3 mt-1">
                      <div className="w-2 h-2 bg-[#8B4513] rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium capitalize">{status.status}</p>
                      <p className="text-sm text-gray-500">{status.notes}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(status.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;