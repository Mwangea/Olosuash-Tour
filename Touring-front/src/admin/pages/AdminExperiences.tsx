import { useState, useEffect, useCallback } from "react";
import { FiEdit, FiTrash2, FiPlus, FiSearch, FiRefreshCw, FiChevronRight, FiChevronLeft, FiFilter, FiImage } from "react-icons/fi";
import { toast } from "react-hot-toast";
import api from "../../api/axios";
import AdminLayout from "../Adminlayout";
import { useNavigate } from "react-router-dom";

interface Experience {
  id: string;
  title: string;
  category_name: string;
  category_slug: string;
  price: number;
  discount_price: number | null;
  duration: string;
  is_active: boolean;
  created_at: string;
  cover_image: string;
  is_featured: boolean;
}

interface Category {
  id: string;
  name: string;
}

const AdminExperiences = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [experienceToDelete, setExperienceToDelete] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  });
  const navigate = useNavigate();

  const fetchExperiences = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/experiences", {
        params: {
          search: searchTerm,
          category_id: categoryFilter === "all" ? undefined : categoryFilter,
          page: pagination.page,
          limit: pagination.limit
        }
      });
      
      // Ensure numeric values
      const total = Number(response.data.pagination?.total) || 0;
      const limit = Number(pagination.limit) || 10;
      
      setExperiences(response.data.data.experiences || []);
      
      // Fetch categories separately if not already loaded
      if (categories.length === 0) {
        const categoriesResponse = await api.get("/experiences/categories");
        setCategories(categoriesResponse.data.data.categories || []);
      }
      
      setPagination(prev => ({
        ...prev,
        total,
        totalPages: Math.ceil(total / limit)
      }));
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch experiences");
      toast.error("Failed to fetch experiences");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, categoryFilter, pagination.page, pagination.limit, categories.length]);

  useEffect(() => {
    fetchExperiences();
  }, [fetchExperiences]);

  const toggleExperienceStatus = async (id: string, currentStatus: boolean) => {
    try {
      await api.patch(`/experiences/${id}`, {
        is_active: !currentStatus
      });
      toast.success(`Experience ${currentStatus ? 'deactivated' : 'activated'} successfully`);
      fetchExperiences();
    } catch (err) {
      toast.error("Failed to update experience status");
      console.error(err);
    }
  };

  const deleteExperience = async (id: string) => {
    try {
      setDeletingId(id);
      await api.delete(`/experiences/${id}`);
      toast.success("Experience deleted successfully");
      await fetchExperiences();
    } catch (err) {
      toast.error("Failed to delete experience");
      console.error(err);
    } finally {
      setDeletingId(null);
      setIsDeleteModalOpen(false);
      setExperienceToDelete(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatPrice = (price: number, discountPrice: number | null) => {
    if (discountPrice) {
      return (
        <>
          <span className="text-gray-500 line-through mr-2">${price.toFixed(2)}</span>
          <span className="text-[#8B6B3D] font-semibold">${discountPrice.toFixed(2)}</span>
        </>
      );
    }
    return `$${price.toFixed(2)}`;
  };

  // Skeleton loading component
  const SkeletonRow = () => (
    <tr className="animate-pulse">
      <td className="px-3 py-3 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-md"></div>
          <div className="ml-4">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="h-3 bg-gray-200 rounded w-24 mt-2"></div>
          </div>
        </div>
      </td>
      <td className="px-3 py-3 whitespace-nowrap">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </td>
      <td className="px-3 py-3 whitespace-nowrap">
        <div className="h-4 bg-gray-200 rounded w-16"></div>
      </td>
      <td className="px-3 py-3 whitespace-nowrap">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </td>
      <td className="px-3 py-3 whitespace-nowrap">
        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
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
            Experiences Management
          </h1>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative flex-grow sm:w-48 md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search experiences..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-[#8B6B3D] focus:border-[#8B6B3D] text-sm sm:text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiFilter className="text-gray-400" />
              </div>
              <select
                title="filter"
                className="appearance-none block w-full pl-10 pr-8 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-[#8B6B3D] focus:border-[#8B6B3D] text-sm sm:text-base"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-2">
              <button
                onClick={() => navigate("/admin/experiences/new")}
                className="flex items-center justify-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#8B6B3D] hover:bg-[#6B4F2D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B6B3D] whitespace-nowrap"
              >
                <FiPlus className="mr-1 sm:mr-2" />
                <span className="hidden sm:inline">New Experience</span>
                <span className="sm:hidden">Add</span>
              </button>

              <button
                onClick={fetchExperiences}
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
                    Experience
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    Category
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
                    Duration
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
                ) : experiences.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-3 py-4 text-center text-gray-500"
                    >
                      No experiences found
                    </td>
                  </tr>
                ) : (
                  experiences.map((experience) => (
                    <tr key={experience.id} className="hover:bg-gray-50">
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {experience.cover_image ? (
                              <img
                                className="h-10 w-10 rounded-md object-cover"
                                src={experience.cover_image}
                                alt={experience.title}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center text-gray-400">
                                <FiImage />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {experience.title}
                              {experience.is_featured && (
                                <span className="ml-2 px-2 py-0.5 text-xs bg-[#8B6B3D] text-white rounded-full">
                                  Featured
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500">
                              Created: {formatDate(experience.created_at)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {experience.category_name}
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatPrice(experience.price, experience.discount_price)}
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {experience.duration}
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer ${
                            experience.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                          onClick={() =>
                            toggleExperienceStatus(experience.id, experience.is_active)
                          }
                        >
                          {experience.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() =>
                              navigate(`/admin/experience/edit/${experience.id}`)
                            }
                            className="text-[#8B6B3D] hover:text-[#6B4F2D]"
                            title="Edit"
                          >
                            <FiEdit className="h-4 w-4 sm:h-5 sm:w-5" />
                          </button>

                          <button
                            onClick={() => {
                              setExperienceToDelete(experience.id);
                              setIsDeleteModalOpen(true);
                            }}
                            disabled={deletingId === experience.id}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                            title="Delete"
                          >
                            {deletingId === experience.id ? (
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

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Confirm Deletion
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete this experience? This action cannot be
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
                    if (experienceToDelete) await deleteExperience(experienceToDelete);
                    setIsDeleteModalOpen(false);
                  }}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  {deletingId === experienceToDelete ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminExperiences;