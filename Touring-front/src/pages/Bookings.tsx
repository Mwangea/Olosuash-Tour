import { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaUsers,
  FaMoneyBillWave,
  FaInfoCircle,
  FaTrash,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaFilter,
  FaSync,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { BookingApi } from "../api/bookingApi";
import { formatCurrency, formatDate } from "../utils/format";
import { Booking } from "../api/bookingApi";
import BookingDetailsModal from "../components/BookingDetailsModal";
import { useBooking } from "../context/BookingContext";
import DeleteConfirmationBookingModal from "../components/DeleteConfirmationBookingModal";

const Bookings = () => {
  const { bookingSuccess } = useBooking();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, [bookingSuccess]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await BookingApi.getMyBookings();
      setBookings(data || []);
    } catch (err) {
      setError("Failed to fetch bookings. Please try again later.");
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  const handleCancelBooking = (id: string) => {
    setBookingToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmCancelBooking = async () => {
    if (!bookingToDelete) return;

    try {
      setCancelling(true);
      await BookingApi.cancelBooking(bookingToDelete);
      setBookings(
        bookings.map((booking) =>
          booking.id === bookingToDelete
            ? { ...booking, status: "cancelled" }
            : booking
        )
      );
    } catch (err) {
      setError("Failed to cancel booking. Please try again.");
      console.error("Error cancelling booking:", err);
    } finally {
      setCancelling(false);
      setShowDeleteModal(false);
      setBookingToDelete(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses =
      "inline-flex items-center px-2 py-1 rounded-full text-xs sm:text-sm font-medium";

    switch (status) {
      case "pending":
        return (
          <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
            <FaClock className="mr-1" /> Pending
          </span>
        );
      case "approved":
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800`}>
            <FaCheckCircle className="mr-1" /> Approved
          </span>
        );
      case "cancelled":
        return (
          <span className={`${baseClasses} bg-red-100 text-red-800`}>
            <FaTimesCircle className="mr-1" /> Cancelled
          </span>
        );
      default:
        return (
          <span className={`${baseClasses} bg-gray-100 text-gray-800`}>
            Unknown
          </span>
        );
    }
  };

  const filteredBookings = bookings.filter(
    (booking) => statusFilter === "all" || booking.status === statusFilter
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F8F4EA] to-[#E9F5FF] py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2A2A2A] mb-6">
            My Bookings
          </h1>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-white rounded-lg shadow p-4 sm:p-6 animate-pulse"
              >
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F8F4EA] to-[#E9F5FF] py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2A2A2A] mb-6">
            My Bookings
          </h1>
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 text-center">
            <p className="text-red-500">{error}</p>
            <button
              onClick={handleRefresh}
              className="mt-4 px-4 py-2 bg-[#8B6B3D] text-white rounded-lg hover:bg-[#6B4F2D] transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F4EA] to-[#E9F5FF] py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2A2A2A]">My Bookings</h1>
          <div className="flex flex-col xs:flex-row items-start xs:items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center px-3 sm:px-4 py-2 bg-[#8B6B3D] text-white rounded-lg hover:bg-[#6B4F2D] transition disabled:opacity-50 text-sm sm:text-base w-full xs:w-auto justify-center"
            >
              <FaSync className={`mr-2 ${refreshing ? "animate-spin" : ""}`} />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
            <div className="relative w-full xs:w-auto">
              <div className="flex items-center px-3 sm:px-4 py-2 border border-[#8B6B3D] rounded-lg cursor-pointer w-full">
                <FaFilter className="text-[#8B6B3D] mr-2" />
                <select
                  title="status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none bg-transparent pr-8 focus:outline-none w-full text-sm sm:text-base"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {!bookings || bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 text-center">
            <p className="text-gray-600 mb-4">
              You don't have any bookings yet.
            </p>
            <Link
              to="/tours"
              className="inline-block px-4 sm:px-6 py-2 bg-[#8B6B3D] text-white rounded-lg hover:bg-[#6B4F2D] transition text-sm sm:text-base"
            >
              Browse Tours
            </Link>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto pb-4">
            {filteredBookings.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-4 sm:p-6 text-center">
                <p className="text-gray-600">
                  No bookings match the selected filter.
                </p>
              </div>
            ) : (
              filteredBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white rounded-lg shadow overflow-hidden"
                >
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col xs:flex-row justify-between items-start gap-2 mb-4">
                      <h2 className="text-lg sm:text-xl font-bold text-gray-800 pr-2">
                        {booking.tour_title}
                      </h2>
                      {getStatusBadge(booking.status)}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4 sm:mb-6">
                      <div className="flex items-center text-sm sm:text-base">
                        <FaCalendarAlt className="text-[#8B6B3D] mr-2 flex-shrink-0" />
                        <span className="truncate">{formatDate(booking.travel_date)}</span>
                      </div>
                      <div className="flex items-center text-sm sm:text-base">
                        <FaUsers className="text-[#8B6B3D] mr-2 flex-shrink-0" />
                        <span>
                          {booking.number_of_travelers} traveler
                          {booking.number_of_travelers !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="flex items-center text-sm sm:text-base">
                        <FaMoneyBillWave className="text-[#8B6B3D] mr-2 flex-shrink-0" />
                        <span>{formatCurrency(booking.total_price)}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      <button
                        onClick={() => handleViewDetails(booking)}
                        className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 border border-[#8B6B3D] text-[#8B6B3D] rounded-lg hover:bg-gray-50 transition text-xs sm:text-sm"
                      >
                        <FaInfoCircle className="mr-1 sm:mr-2" />
                        View Details
                      </button>
                      {booking.status !== "cancelled" && (
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          disabled={cancelling}
                          className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition disabled:opacity-50 text-xs sm:text-sm"
                        >
                          <FaTrash className="mr-1 sm:mr-2" />
                          {cancelling ? "Cancelling..." : "Cancel Booking"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationBookingModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setBookingToDelete(null);
        }}
        onConfirm={confirmCancelBooking}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
        confirmText={cancelling ? "Cancelling..." : "Yes, Cancel"}
        cancelText="No, Keep It"
        isProcessing={cancelling}
      />
    </div>
  );
};

export default Bookings;