/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback, useEffect } from "react";
import {
  FiCalendar,
  FiUser,
  FiDollarSign,
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiMail,
  FiPhone,
} from "react-icons/fi";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
} from "react-icons/fa";
import api from "../../api/axios";
import { toast } from "react-hot-toast";
import AdminLayout from "../Adminlayout";

interface ExperienceBooking {
  id: string;
  booking_reference: string;
  experience_title: string;
  experience_slug: string;
  booking_date: string;
  number_of_guests: number;
  total_price: number;
  status: "pending" | "confirmed" | "cancelled";
  payment_status: "pending" | "paid" | "refunded" | "failed";
  created_at: string;
  full_name: string;
  email: string;
  phone: string;
  special_requests?: string;
}

interface ApiResponse {
  status: string;
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
  data: {
    bookings: ExperienceBooking[];
  };
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

interface BookingDetails extends ExperienceBooking {
  admin_notes?: string;
  status_history?: Array<{
    status: string;
    payment_status: string;
    notes: string;
    created_at: string;
    changed_by: string;
  }>;
  experience_details?: {
    duration: string;
    difficulty: string;
    category_name: string;
  };
}

const AdminExperienceBooking = () => {
  const [selectedBooking, setSelectedBooking] = useState<BookingDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [bookings, setBookings] = useState<ExperienceBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>("all");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get<ApiResponse>("/experiences/bookings", {
        params: {
          page: pagination.page,
          limit: pagination.limit,
          search: searchTerm,
          status: statusFilter === "all" ? undefined : statusFilter,
          payment_status: paymentStatusFilter === "all" ? undefined : paymentStatusFilter,
        },
      });

      const processedBookings = response.data.data.bookings.map((booking) => ({
        ...booking,
        total_price: Number(booking.total_price),
        id: String(booking.id),
      }));

      setBookings(processedBookings);
      setPagination({
        ...pagination,
        total: response.data.pagination.total,
        totalPages: response.data.pagination.totalPages,
      });
    } catch (err) {
      console.error("Error fetching experience bookings:", err);
      setError("Failed to load bookings. Please try again.");
      toast.error("Failed to load experience bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, searchTerm, statusFilter, paymentStatusFilter]);

  const fetchBookingDetails = async (bookingId: string) => {
    try {
      setLoadingDetails(true);
      const response = await api.get<{ data: { booking: BookingDetails } }>(
        `/experiences/bookings/${bookingId}`
      );
      
      const bookingData = response.data.data.booking;
      bookingData.total_price = typeof bookingData.total_price === 'string' 
        ? parseFloat(bookingData.total_price) 
        : bookingData.total_price;
      
      setSelectedBooking(bookingData);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Error fetching booking details:", err);
      toast.error("Failed to load booking details");
    } finally {
      setLoadingDetails(false);
    }
  };

  useEffect(() => {
    fetchBookings().catch((err) => {
      console.error("Uncaught error in fetch:", err);
    });
  }, [fetchBookings]);

  useEffect(() => {
    // Check URL for view parameter
    const urlParams = new URLSearchParams(window.location.search);
    const viewBookingId = urlParams.get("view");

    if (viewBookingId) {
      fetchBookingDetails(viewBookingId);
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    fetchBookings().catch((err) => {
      console.error("Uncaught error in fetch:", err);
    });
  }, [fetchBookings]);

  const handleStatusUpdate = async (bookingId: string, newStatus: string, newPaymentStatus?: string) => {
    try {
      setUpdatingId(bookingId);
      await api.patch(`/experiences/bookings/${bookingId}/status`, { 
        status: newStatus,
        payment_status: newPaymentStatus 
      });
      toast.success("Booking status updated successfully");
      await fetchBookings();
      setIsModalOpen(false);
    } catch (err) {
      const error = err as ApiError;
      toast.error(error.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <FaCheckCircle className="text-green-500" />;
      case "cancelled":
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaHourglassHalf className="text-yellow-500" />;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "refunded":
        return "bg-blue-100 text-blue-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  // Skeleton loading component
  const SkeletonRow = () => (
    <tr className="animate-pulse">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200"></div>
          <div className="ml-4">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-200 rounded w-8"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-200 rounded w-16"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-8 bg-gray-200 rounded w-24"></div>
      </td>
    </tr>
  );

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-2xl font-bold text-[#8B6B3D] mb-4 md:mb-0">
            Experience Bookings Management
          </h1>

          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="relative flex-grow md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search bookings..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-[#8B6B3D] focus:border-[#8B6B3D] sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiFilter className="text-gray-400" />
              </div>
              <select
              title="status"
                className="appearance-none block w-full pl-10 pr-8 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-[#8B6B3D] focus:border-[#8B6B3D] sm:text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiFilter className="text-gray-400" />
              </div>
              <select
              title="status"
                className="appearance-none block w-full pl-10 pr-8 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-[#8B6B3D] focus:border-[#8B6B3D] sm:text-sm"
                value={paymentStatusFilter}
                onChange={(e) => setPaymentStatusFilter(e.target.value)}
              >
                <option value="all">All Payment Statuses</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="refunded">Refunded</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            <button
              onClick={fetchBookings}
              disabled={loading}
              className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#8B6B3D] hover:bg-[#6B4F2D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B6B3D] disabled:opacity-70"
            >
              <FiRefreshCw
                className={`mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 text-red-700 rounded">
            <p>{error}</p>
          </div>
        )}

        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking Reference
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Experience
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Guests
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <SkeletonRow key={`skeleton-${index}`} />
                  ))
                ) : bookings.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
                      No bookings found
                    </td>
                  </tr>
                ) : (
                  bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {booking.booking_reference}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(booking.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-gray-100">
                            <FiUser className="text-[#8B6B3D]" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {booking.full_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {booking.experience_title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FiCalendar className="text-[#8B6B3D] mr-2" />
                          <div className="text-sm text-gray-900">
                            {formatDate(booking.booking_date)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking.number_of_guests}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <FiDollarSign className="text-[#8B6B3D] mr-1" />
                          {booking.total_price.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(booking.status)}
                          <span className="ml-2 text-sm text-gray-900 capitalize">
                            {booking.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusBadge(booking.payment_status)}`}>
                          {booking.payment_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => fetchBookingDetails(booking.id)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View
                          </button>
                          {booking.status === "pending" && (
                            <>
                              <span className="text-gray-300">|</span>
                              <button
                                onClick={() => handleStatusUpdate(booking.id, "confirmed", "paid")}
                                disabled={updatingId === booking.id}
                                className="text-green-600 hover:text-green-900 disabled:opacity-50"
                              >
                                {updatingId === booking.id ? "Confirming..." : "Confirm"}
                              </button>
                            </>
                          )}
                          {booking.status !== "cancelled" && (
                            <>
                              <span className="text-gray-300">|</span>
                              <button
                                onClick={() => handleStatusUpdate(booking.id, "cancelled", "refunded")}
                                disabled={updatingId === booking.id}
                                className="text-red-600 hover:text-red-900 disabled:opacity-50"
                              >
                                {updatingId === booking.id ? "Cancelling..." : "Cancel"}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!loading && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">
                      {(pagination.page - 1) * pagination.limit + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(
                        pagination.page * pagination.limit,
                        pagination.total
                      )}
                    </span>{" "}
                    of <span className="font-medium">{pagination.total}</span>{" "}
                    results
                  </p>
                </div>
                <div>
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() =>
                        setPagination((prev) => ({
                          ...prev,
                          page: prev.page - 1,
                        }))
                      }
                      disabled={pagination.page === 1 || loading}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Previous</span>
                      Previous
                    </button>
                    {Array.from(
                      { length: Math.min(5, pagination.totalPages) },
                      (_, i) => {
                        let pageNum;
                        if (pagination.totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (pagination.page <= 3) {
                          pageNum = i + 1;
                        } else if (
                          pagination.page >=
                          pagination.totalPages - 2
                        ) {
                          pageNum = pagination.totalPages - 4 + i;
                        } else {
                          pageNum = pagination.page - 2 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() =>
                              setPagination((prev) => ({
                                ...prev,
                                page: pageNum,
                              }))
                            }
                            disabled={loading}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              pagination.page === pageNum
                                ? "bg-[#8B6B3D] text-white border-[#8B6B3D]"
                                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                            } disabled:opacity-50`}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                    )}
                    <button
                      onClick={() =>
                        setPagination((prev) => ({
                          ...prev,
                          page: prev.page + 1,
                        }))
                      }
                      disabled={
                        pagination.page === pagination.totalPages || loading
                      }
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Next</span>
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Booking Details Modal */}
        {isModalOpen && selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-bold text-gray-800">
                    Booking Details - {selectedBooking.booking_reference}
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {loadingDetails ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8B6B3D]" />
                  </div>
                ) : (
                  <div className="mt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          Customer Information
                        </h3>
                        <div className="mt-4 space-y-2">
                          <p>
                            <span className="font-medium">Name:</span>{" "}
                            {selectedBooking.full_name}
                          </p>
                          <p className="flex items-center">
                            <FiMail className="mr-2 text-[#8B6B3D]" />
                            <span className="font-medium">Email:</span>{" "}
                            {selectedBooking.email}
                          </p>
                          <p className="flex items-center">
                            <FiPhone className="mr-2 text-[#8B6B3D]" />
                            <span className="font-medium">Phone:</span>{" "}
                            {selectedBooking.phone}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          Booking Information
                        </h3>
                        <div className="mt-4 space-y-2">
                          <p>
                            <span className="font-medium">Experience:</span>{" "}
                            {selectedBooking.experience_title}
                          </p>
                          {selectedBooking.experience_details && (
                            <>
                              <p>
                                <span className="font-medium">Duration:</span>{" "}
                                {selectedBooking.experience_details.duration}
                              </p>
                              <p>
                                <span className="font-medium">Difficulty:</span>{" "}
                                {selectedBooking.experience_details.difficulty}
                              </p>
                              <p>
                                <span className="font-medium">Category:</span>{" "}
                                {selectedBooking.experience_details.category_name}
                              </p>
                            </>
                          )}
                          <p>
                            <span className="font-medium">Booking Date:</span>{" "}
                            {formatDate(selectedBooking.booking_date)}
                          </p>
                          <p>
                            <span className="font-medium">Number of Guests:</span>{" "}
                            {selectedBooking.number_of_guests}
                          </p>
                          <p>
                            <span className="font-medium">Total Price:</span>{" "}
                            ${selectedBooking.total_price.toFixed(2)}
                          </p>
                          <p>
                            <span className="font-medium">Status:</span>
                            <span
                              className={`ml-2 capitalize ${
                                selectedBooking.status === "confirmed"
                                  ? "text-green-600"
                                  : selectedBooking.status === "cancelled"
                                  ? "text-red-600"
                                  : "text-yellow-600"
                              }`}
                            >
                              {selectedBooking.status}
                            </span>
                          </p>
                          <p>
                            <span className="font-medium">Payment Status:</span>
                            <span
                              className={`ml-2 capitalize ${
                                selectedBooking.payment_status === "paid"
                                  ? "text-green-600"
                                  : selectedBooking.payment_status === "refunded"
                                  ? "text-blue-600"
                                  : selectedBooking.payment_status === "failed"
                                  ? "text-red-600"
                                  : "text-yellow-600"
                              }`}
                            >
                              {selectedBooking.payment_status}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {selectedBooking.special_requests && (
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          Special Requests
                        </h3>
                        <p className="mt-2 text-gray-700">
                          {selectedBooking.special_requests}
                        </p>
                      </div>
                    )}

                    {selectedBooking.admin_notes && (
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          Admin Notes
                        </h3>
                        <p className="mt-2 text-gray-700">
                          {selectedBooking.admin_notes}
                        </p>
                      </div>
                    )}

                    {selectedBooking.status_history && selectedBooking.status_history.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          Status History
                        </h3>
                        <div className="mt-4 space-y-4">
                          {selectedBooking.status_history.map((history, index) => (
                            <div
                              key={index}
                              className="border-l-2 border-gray-200 pl-4 py-2"
                            >
                              <div className="flex justify-between">
                                <div>
                                  <span className="font-medium capitalize">
                                    {history.status}
                                  </span>
                                  {history.payment_status && (
                                    <span className="ml-2 text-sm">
                                      (Payment: {history.payment_status})
                                    </span>
                                  )}
                                </div>
                                <span className="text-sm text-gray-500">
                                  {formatDate(history.created_at)}
                                </span>
                              </div>
                              {history.notes && (
                                <p className="text-gray-700 mt-1">
                                  {history.notes}
                                </p>
                              )}
                              {history.changed_by && (
                                <p className="text-sm text-gray-500 mt-1">
                                  Changed by: {history.changed_by}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-4 border-t border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">
                        Update Status
                      </h3>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          onClick={() => handleStatusUpdate(selectedBooking.id, "confirmed", "paid")}
                          disabled={updatingId === selectedBooking.id}
                          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                        >
                          {updatingId === selectedBooking.id ? "Processing..." : "Confirm Booking"}
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(selectedBooking.id, "cancelled", "refunded")}
                          disabled={updatingId === selectedBooking.id}
                          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                        >
                          {updatingId === selectedBooking.id ? "Processing..." : "Cancel Booking"}
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(selectedBooking.id, selectedBooking.status, "paid")}
                          disabled={updatingId === selectedBooking.id || selectedBooking.payment_status === "paid"}
                          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                          {updatingId === selectedBooking.id ? "Processing..." : "Mark as Paid"}
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(selectedBooking.id, selectedBooking.status, "refunded")}
                          disabled={updatingId === selectedBooking.id || selectedBooking.payment_status === "refunded"}
                          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                        >
                          {updatingId === selectedBooking.id ? "Processing..." : "Mark as Refunded"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminExperienceBooking;