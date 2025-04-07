/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback, useEffect } from "react";
import {
  FiCalendar,
  FiUser,
  FiDollarSign,
  FiSearch,
  FiFilter,
  FiRefreshCw,
} from "react-icons/fi";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
} from "react-icons/fa";
import api from "../../api/axios";

import { toast } from "react-hot-toast";
import AdminLayout from "../Adminlayout";

interface Booking {
  id: string;
  tour_title: string;
  travel_date: string;
  number_of_travelers: number;
  total_price: number;
  status: "pending" | "approved" | "cancelled";
  payment_method: string;
  created_at: string;
  user_name: string;
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
    bookings: {
      id: number;
      tour_id: number;
      tour_title: string;
      travel_date: string;
      number_of_travelers: number;
      total_price: string; // Note this is string from backend
      status: "pending" | "approved" | "cancelled";
      payment_method: string;
      created_at: string;
      user_name: string;
    }[];
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

interface BookingDetails extends Booking {
  tour_description: string;
  tour_duration: string;
  tour_difficulty: string;
  special_requests?: string;
  whatsapp_number?: string;
  admin_notes?: string;
  status_history?: Array<{
    status: string;
    notes: string;
    created_at: string;
    changed_by: string;
  }>;
  tour_details?: {
    itinerary: Array<{ day: number; title: string; description: string }>;
    included_services: Array<{ name: string; details: string }>;
    excluded_services: Array<{ name: string; details: string }>;
  };
}

const AdminBooking = () => {
  const [selectedBooking, setSelectedBooking] = useState<BookingDetails | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
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
      const response = await api.get<ApiResponse>("/bookings", {
        params: {
          page: pagination.page,
          limit: pagination.limit,
          search: searchTerm,
          status: statusFilter === "all" ? undefined : statusFilter,
        },
      });

      // Convert string prices to numbers and ensure all fields are properly set
      const processedBookings = response.data.data.bookings.map((booking) => ({
        ...booking,
        total_price: Number(booking.total_price),
        id: String(booking.id), // Ensure ID is string if your interface expects it
        user_name: booking.user_name || "Unknown", // Fallback for user_name
      }));

      setBookings(processedBookings);
      setPagination({
        ...pagination,
        total: response.data.pagination.total,
        totalPages: response.data.pagination.totalPages,
      });
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Failed to load bookings. Please try again.");
      toast.error("Failed to load bookings");
      setBookings([]); // Reset bookings on error
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, searchTerm, statusFilter]);

  const fetchBookingDetails = async (bookingId: string) => {
    try {
      setLoadingDetails(true);
      const response = await api.get<{ data: { booking: BookingDetails } }>(
        `/bookings/${bookingId}`
      );
      
      // Ensure total_price is a number
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
    console.log("Fetching bookings..."); // Debug log
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

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    try {
      setUpdatingId(bookingId);
      await api.patch(`/bookings/${bookingId}/status`, { status: newStatus });
      toast.success("Booking status updated successfully");
      await fetchBookings();
    } catch (err) {
      const error = err as ApiError;
      toast.error(error.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (bookingId: string) => {
    if (!window.confirm("Are you sure you want to delete this booking?"))
      return;

    try {
      setDeletingId(bookingId);
      await api.delete(`/bookings/${bookingId}`);
      toast.success("Booking deleted successfully");
      await fetchBookings();
    } catch (err) {
      const error = err as ApiError;
      toast.error(error.response?.data?.message || "Failed to delete booking");
    } finally {
      setDeletingId(null);
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
      case "approved":
        return <FaCheckCircle className="text-green-500" />;
      case "cancelled":
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaHourglassHalf className="text-yellow-500" />;
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
            Bookings Management
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
                className="appearance-none block w-full pl-10 pr-8 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-[#8B6B3D] focus:border-[#8B6B3D] sm:text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter users by verification status"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="cancelled">Cancelled</option>
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
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Tour
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Traveler
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Travel Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Travelers
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Payment
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
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
                    <td
                      colSpan={8}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No bookings found
                    </td>
                  </tr>
                ) : (
                  bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {booking.tour_title}
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
                              {booking.user_name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FiCalendar className="text-[#8B6B3D] mr-2" />
                          <div className="text-sm text-gray-900">
                            {formatDate(booking.travel_date)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking.number_of_travelers}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <FiDollarSign className="text-[#8B6B3D] mr-1" />
                          {booking.total_price.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {booking.payment_method}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(booking.status)}
                          <span className="ml-2 text-sm text-gray-900 capitalize">
                            {booking.status}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => fetchBookingDetails(booking.id)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            view
                          </button>
                          {booking.status === "pending" && (
                            <>
                              <span className="text-gray-300">|</span>
                              <button
                                onClick={() =>
                                  handleStatusUpdate(booking.id, "approved")
                                }
                                disabled={updatingId === booking.id}
                                className="text-green-600 hover:text-green-900 disabled:opacity-50"
                              >
                                {updatingId === booking.id
                                  ? "Approving..."
                                  : "Approve"}
                              </button>
                            </>
                          )}
                          <span className="text-gray-300">|</span>
                          <button
                            onClick={() => handleDelete(booking.id)}
                            disabled={deletingId === booking.id}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50 flex items-center"
                          >
                            {deletingId === booking.id ? (
                              "Deleting..."
                            ) : (
                              <>Delete</>
                            )}
                          </button>
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
          {isModalOpen && selectedBooking && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-bold text-gray-800">
                      Booking Details
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
                            Tour Information
                          </h3>
                          <div className="mt-4 space-y-2">
                            <p>
                              <span className="font-medium">Tour:</span>{" "}
                              {selectedBooking.tour_title}
                            </p>
                            <p>
                              <span className="font-medium">Description:</span>{" "}
                              {selectedBooking.tour_description}
                            </p>
                            <p>
                              <span className="font-medium">Duration:</span>{" "}
                              {selectedBooking.tour_duration}
                            </p>
                            <p>
                              <span className="font-medium">Difficulty:</span>{" "}
                              {selectedBooking.tour_difficulty}
                            </p>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            Booking Information
                          </h3>
                          <div className="mt-4 space-y-2">
                            <p>
                              <span className="font-medium">Booking ID:</span>{" "}
                              {selectedBooking.id}
                            </p>
                            <p>
                              <span className="font-medium">Travel Date:</span>{" "}
                              {formatDate(selectedBooking.travel_date)}
                            </p>
                            <p>
                              <span className="font-medium">
                                Number of Travelers:
                              </span>{" "}
                              {selectedBooking.number_of_travelers}
                            </p>
                            <p>
                              <span className="font-medium">Total Price:</span>{" "}
                              ${selectedBooking.total_price.toFixed(2)}
                            </p>
                            <p>
                              <span className="font-medium">Status:</span>
                              <span
                                className={`ml-2 capitalize ${
                                  selectedBooking.status === "approved"
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
                              <span className="font-medium">
                                Payment Method:
                              </span>{" "}
                              {selectedBooking.payment_method}
                            </p>
                            {selectedBooking.whatsapp_number && (
                              <p>
                                <span className="font-medium">
                                  WhatsApp Number:
                                </span>{" "}
                                {selectedBooking.whatsapp_number}
                              </p>
                            )}
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

                      {selectedBooking.tour_details && (
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">
                              Itinerary
                            </h3>
                            <div className="mt-4 space-y-4">
                              {selectedBooking.tour_details.itinerary.map(
                                (day) => (
                                  <div
                                    key={day.day}
                                    className="border-l-2 border-[#8B6B3D] pl-4 py-2"
                                  >
                                    <h4 className="font-medium">
                                      Day {day.day}: {day.title}
                                    </h4>
                                    <p className="text-gray-700 mt-1">
                                      {day.description}
                                    </p>
                                  </div>
                                )
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">
                                Included Services
                              </h3>
                              <ul className="mt-4 space-y-2">
                                {selectedBooking.tour_details.included_services.map(
                                  (service, index) => (
                                    <li
                                      key={index}
                                      className="flex items-start"
                                    >
                                      <svg
                                        className="h-5 w-5 text-green-500 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M5 13l4 4L19 7"
                                        />
                                      </svg>
                                      <span>
                                        <span className="font-medium">
                                          {service.name}
                                        </span>
                                        : {service.details}
                                      </span>
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>

                            <div>
                              <h3 className="text-lg font-medium text-gray-900">
                                Excluded Services
                              </h3>
                              <ul className="mt-4 space-y-2">
                                {selectedBooking.tour_details.excluded_services.map(
                                  (service, index) => (
                                    <li
                                      key={index}
                                      className="flex items-start"
                                    >
                                      <svg
                                        className="h-5 w-5 text-red-500 mr-2"
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
                                      <span>
                                        <span className="font-medium">
                                          {service.name}
                                        </span>
                                        : {service.details}
                                      </span>
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedBooking.status_history &&
                        selectedBooking.status_history.length > 0 && (
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">
                              Status History
                            </h3>
                            <div className="mt-4 space-y-4">
                              {selectedBooking.status_history.map(
                                (history, index) => (
                                  <div
                                    key={index}
                                    className="border-l-2 border-gray-200 pl-4 py-2"
                                  >
                                    <div className="flex justify-between">
                                      <span className="font-medium capitalize">
                                        {history.status}
                                      </span>
                                      <span className="text-sm text-gray-500">
                                        {formatDate(history.created_at)}
                                      </span>
                                    </div>
                                    <p className="text-gray-700 mt-1">
                                      {history.notes}
                                    </p>
                                    {history.changed_by && (
                                      <p className="text-sm text-gray-500 mt-1">
                                        Changed by: {history.changed_by}
                                      </p>
                                    )}
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminBooking;
