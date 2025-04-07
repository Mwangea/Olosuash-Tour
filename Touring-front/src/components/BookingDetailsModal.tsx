import {
  FiCalendar,
  FiUsers,
  FiDollarSign,
  FiCreditCard,
  FiMessageSquare,
  FiX,
  FiMapPin,
  FiClock,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import { formatCurrency, formatDate } from "../utils/format";
import { Booking } from "../api/bookingApi";

interface BookingDetailsModalProps {
  booking: Booking;
  isOpen: boolean;
  onClose: () => void;
}

const BookingDetailsModal = ({
  booking,
  isOpen,
  onClose,
}: BookingDetailsModalProps) => {
  if (!isOpen) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <FiClock className="text-yellow-500" />;
      case "approved":
        return <FiCheckCircle className="text-green-500" />;
      case "cancelled":
        return <FiXCircle className="text-red-500" />;
      default:
        return <FiClock className="text-gray-500" />;
    }
  };

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

          <div className="space-y-6">
            {/* Tour Information */}
            <div className="bg-[#F8F4EA] p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-[#8B4513] mb-3">
                Tour Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start">
                  <FiMapPin className="mr-2 text-[#8B4513] mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Tour Title</p>
                    <p className="font-medium">{booking.tour_title}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FiCalendar className="mr-2 text-[#8B4513] mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Travel Date</p>
                    <p className="font-medium">{formatDate(booking.travel_date)}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FiUsers className="mr-2 text-[#8B4513] mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Travelers</p>
                    <p className="font-medium">{booking.number_of_travelers}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FiDollarSign className="mr-2 text-[#8B4513] mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Total Price</p>
                    <p className="font-medium">
                      {formatCurrency(booking.total_price)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="border-t pt-4">
              <h4 className="text-lg font-semibold text-[#8B4513] mb-3">
                Payment Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start">
                  <FiCreditCard className="mr-2 text-[#8B4513] mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Payment Method</p>
                    <p className="font-medium capitalize">
                      {booking.payment_method}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="mr-2 text-[#8B4513] mt-1">
                    {getStatusIcon(booking.status)}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Current Status</p>
                    <p className="font-medium capitalize">{booking.status}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Special Requests */}
            {booking.special_requests && (
              <div className="border-t pt-4">
                <h4 className="text-md font-semibold text-[#8B4513] mb-2">
                  Special Requests
                </h4>
                <div className="flex items-start">
                  <FiMessageSquare className="mr-2 text-[#8B4513] mt-1" />
                  <p className="text-gray-700">{booking.special_requests}</p>
                </div>
              </div>
            )}

            {/* Status History */}
            <div className="border-t pt-4">
              <h4 className="text-md font-semibold text-[#8B4513] mb-3">
                Status History
              </h4>
              <div className="space-y-4">
                {booking.status_history?.map((status, index) => (
                  <div key={index} className="flex items-start">
                    <div className="mr-3 mt-1">
                      <div className="w-3 h-3 bg-[#8B4513] rounded-full"></div>
                    </div>
                    <div className="flex-1 border-b pb-2">
                      <div className="flex justify-between items-center">
                        <p className="font-medium capitalize">{status.status}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(status.created_at).toLocaleString()}
                        </p>
                      </div>
                      {status.notes && (
                        <p className="text-sm text-gray-500 mt-1">
                          {status.notes}
                        </p>
                      )}
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