import { useState, useEffect, useCallback } from "react";
import {
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiTrash2,
  FiEdit,
  FiPlus,
  FiImage,
  FiStar,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

import api from "../../api/axios";
import { toast } from "react-hot-toast";
import AdminLayout from "../Adminlayout";
import { useNavigate } from "react-router-dom";
import { ApiError, ApiResponse, Tour } from "../components/AdminTourApi";



// Function to ensure image URLs are absolute
const getFullImageUrl = (path: string) => {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // In development, use the proxy path (/uploads)
  if (process.env.NODE_ENV === "development") {
    return path.startsWith("/") ? path : `/${path}`;
  }

  // In production, use the full API domain
  return `https://api.olosuashi.com${
    path.startsWith("/") ? path : `/${path}`
  }`;
};


const AdminTour = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [featuredFilter, setFeaturedFilter] = useState<string>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [tourToDelete, setTourToDelete] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const navigate = useNavigate();

  const fetchTours = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get<ApiResponse>("/tours", {
        params: {
          page: pagination.page,
          limit: pagination.limit,
          search: searchTerm,
          featured: featuredFilter === "all" ? undefined : featuredFilter,
          difficulty: difficultyFilter === "all" ? undefined : difficultyFilter,
        },
      });

      // Process image URLs for all tours
      const processedTours = response.data.data.tours?.map(tour => ({
        ...tour,
        cover_image: tour.cover_image ? getFullImageUrl(tour.cover_image) : "",
        images: tour.images?.map(image => ({
          ...image,
          image_path: getFullImageUrl(image.image_path)
        })) || []
      })) || [];

      setTours(processedTours);
      setPagination((prev) => ({
        ...prev,
        total: response.data.pagination.total,
        totalPages: response.data.pagination.totalPages,
      }));
    } catch (err) {
      console.error("Fetch error:", err);
      const error = err as ApiError;
      setError(error.response?.data?.message || "Failed to fetch tours");
      toast.error(error.response?.data?.message || "Failed to fetch tours");
    } finally {
      setLoading(false);
    }
  }, [
    pagination.page,
    pagination.limit,
    searchTerm,
    featuredFilter,
    difficultyFilter,
  ]);

  useEffect(() => {
    fetchTours();
  }, [fetchTours]);

  const handleDelete = async (tourId: string) => {
    try {
      setDeletingId(tourId);
      await api.delete(`/tours/${tourId}`);
      toast.success("Tour deleted successfully");
      await fetchTours();
    } catch (err) {
      const error = err as ApiError;
      toast.error(error.response?.data?.message || "Failed to delete tour");
    } finally {
      setDeletingId(null);
    }
  };

  const toggleFeatured = async (tourId: string, currentFeatured: boolean) => {
    try {
      await api.patch(`/tours/${tourId}`, { featured: !currentFeatured });
      toast.success(
        `Tour ${currentFeatured ? "removed from" : "added to"} featured`
      );
      await fetchTours();
    } catch (err) {
      const error = err as ApiError;
      toast.error(error.response?.data?.message || "Failed to update tour");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Number(price));
  };

  const getDifficultyBadge = (difficulty: string) => {
    let color = "";
    switch (difficulty.toLowerCase()) {
      case "easy":
        color = "bg-green-100 text-green-800";
        break;
      case "medium":
        color = "bg-yellow-100 text-yellow-800";
        break;
      case "difficult":
        color = "bg-red-100 text-red-800";
        break;
      default:
        color = "bg-gray-100 text-gray-800";
    }
    return (
      <span
        className={`px-2 py-1 text-xs font-semibold rounded-full ${color} capitalize`}
      >
        {difficulty}
      </span>
    );
  };

  // Skeleton loading component
  const SkeletonRow = () => (
    <tr className="animate-pulse">
      <td className="px-3 py-3 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-md"></div>
          <div className="ml-3">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="h-3 bg-gray-200 rounded w-24 mt-2"></div>
          </div>
        </div>
      </td>
      <td className="px-3 py-3 whitespace-nowrap">
        <div className="h-4 bg-gray-200 rounded w-16"></div>
      </td>
      <td className="px-3 py-3 whitespace-nowrap">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </td>
      <td className="px-3 py-3 whitespace-nowrap">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </td>
      <td className="px-3 py-3 whitespace-nowrap">
        <div className="h-4 bg-gray-200 rounded w-12"></div>
      </td>
      <td className="px-3 py-3 whitespace-nowrap">
        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
      </td>
      <td className="px-3 py-3 whitespace-nowrap">
        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
      </td>
      <td className="px-3 py-3 whitespace-nowrap">
        <div className="h-8 bg-gray-200 rounded w-24"></div>
      </td>
    </tr>
  );

  return (
    <AdminLayout>
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 sm:mb-6 gap-3">
          <h1 className="text-xl sm:text-2xl font-bold text-[#8B6B3D]">
            Tours Management
          </h1>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative flex-grow sm:w-48 md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search tours..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-[#8B6B3D] focus:border-[#8B6B3D] text-sm sm:text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiFilter className="text-gray-400" />
                </div>
                <select
                  title="Filter by Featured"
                  className="appearance-none block w-full pl-10 pr-8 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-[#8B6B3D] focus:border-[#8B6B3D] text-sm"
                  value={featuredFilter}
                  onChange={(e) => setFeaturedFilter(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="true">Featured</option>
                  <option value="false">Regular</option>
                </select>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiFilter className="text-gray-400" />
                </div>
                <select
                  title="Filter by Difficulty"
                  className="appearance-none block w-full pl-10 pr-8 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-[#8B6B3D] focus:border-[#8B6B3D] text-sm"
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="difficult">Difficult</option>
                </select>
              </div>

              <button
                onClick={() => navigate("/admin/tours/new")}
                className="flex items-center justify-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#8B6B3D] hover:bg-[#6B4F2D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B6B3D] whitespace-nowrap"
              >
                <FiPlus className="mr-1 sm:mr-2" />
                <span className="hidden sm:inline">New Tour</span>
                <span className="sm:hidden">Add</span>
              </button>

              <button
                onClick={fetchTours}
                disabled={loading}
                className="flex items-center justify-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#8B6B3D] hover:bg-[#6B4F2D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B6B3D] disabled:opacity-70 whitespace-nowrap"
              >
                <FiRefreshCw
                  className={`mr-1 sm:mr-2 ${loading ? "animate-spin" : ""}`}
                />
                <span className="hidden sm:inline">Refresh</span>
                <span className="sm:hidden">Reload</span>
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 sm:p-4 bg-red-50 border-l-4 border-red-400 text-red-700 rounded text-sm sm:text-base">
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
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    Tour
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    Duration
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    Created
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    Rating
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    Difficulty
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
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
                ) : tours.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-3 py-4 text-center text-gray-500"
                    >
                      No tours found
                    </td>
                  </tr>
                ) : (
                  tours.map((tour) => (
                    <tr key={tour.id} className="hover:bg-gray-50">
                      <td className="px-3 py-3 whitespace-nowrap">
                        
                        <div className="flex items-center">
                  {tour.images?.find((img) => img.is_cover) ? (
                    <div className="flex-shrink-0 h-10 w-10">
                      <img
                        className="h-10 w-10 rounded-md object-cover"
                        src={
                          tour.images.find((img) => img.is_cover)
                            ?.image_path || getFullImageUrl(tour.cover_image)
                        }
                        alt={tour.title}
                      />
                    </div>
                  ) : tour.cover_image ? (
                    <div className="flex-shrink-0 h-10 w-10">
                      <img
                        className="h-10 w-10 rounded-md object-cover"
                        src={getFullImageUrl(tour.cover_image)}
                        alt={tour.title}
                      />
                    </div>
                  ) : (
                    <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-md bg-gray-100">
                      <FiImage className="text-gray-400" />
                    </div>
                  )}
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900 line-clamp-1">
                              {tour.title}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {tour.duration} days
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatPrice(tour.price)}
                          {tour.discount_price && (
                            <span className="ml-1 text-xs text-gray-500 line-through">
                              {formatPrice(tour.discount_price)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="text-xs sm:text-sm text-gray-500">
                          {formatDate(tour.created_at)}
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <FiStar className="text-yellow-400 mr-1" />
                          <span className="text-sm text-gray-900">
                            {tour.rating || "N/A"}
                          </span>
                          <span className="ml-1 text-xs text-gray-500">
                            ({tour.rating_quantity || 0})
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        {getDifficultyBadge(tour.difficulty)}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        {tour.featured === 1 ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Featured
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                            Regular
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() =>
                              navigate(`/admin/tours/edit/${tour.id}`)
                            }
                            className="text-[#8B6B3D] hover:text-[#6B4F2D]"
                            title="Edit"
                          >
                            <FiEdit className="h-4 w-4 sm:h-5 sm:w-5" />
                          </button>
                          <button
                            onClick={() =>
                              toggleFeatured(tour.id, tour.featured === 1)
                            }
                            className={
                              tour.featured === 1
                                ? "text-yellow-500 hover:text-yellow-700"
                                : "text-gray-400 hover:text-gray-600"
                            }
                            title={
                              tour.featured === 1 ? "Unfeature" : "Feature"
                            }
                          >
                            <FiStar className="h-4 w-4 sm:h-5 sm:w-5" />
                          </button>

                          <button
                            onClick={() => {
                              setTourToDelete(tour.id);
                              setIsDeleteModalOpen(true);
                            }}
                            disabled={deletingId === tour.id}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                            title="Delete"
                          >
                            {deletingId === tour.id ? (
                              <span className="text-xs">...</span>
                            ) : (
                              <FiTrash2 className="h-4 w-4 sm:h-5 sm:w-5" />
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
            <div className="bg-white px-2 sm:px-4 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="flex-1 flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-700">
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
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-xs sm:text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Previous</span>
                      <FiChevronLeft className="h-4 w-4" />
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
                            className={`relative inline-flex items-center px-3 sm:px-4 py-2 border text-xs sm:text-sm font-medium ${
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
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-xs sm:text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Next</span>
                      <FiChevronRight className="h-4 w-4" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Confirm Deletion
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete this tour? This action cannot be
                undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (tourToDelete) await handleDelete(tourToDelete);
                    setIsDeleteModalOpen(false);
                  }}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  {deletingId === tourToDelete ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminTour;
