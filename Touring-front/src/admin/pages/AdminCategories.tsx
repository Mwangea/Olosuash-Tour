import { useState, useEffect, useCallback } from 'react';
import { FiEdit, FiTrash2, FiPlus, FiSearch, FiRefreshCw, FiChevronRight, FiChevronLeft, FiImage } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import api from '../../api/axios';
import AdminLayout from '../Adminlayout';
import { useNavigate } from 'react-router-dom';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_path: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const AdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  });
  const navigate = useNavigate();

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/experiences/categories', {
        params: {
          search: searchTerm,
          page: pagination.page,
          limit: pagination.limit
        }
      });
      
      // Ensure numeric values
      const total = Number(response.data.data.total) || 0;
      const limit = Number(pagination.limit) || 10;
      
      setCategories(response.data.data.categories || []);
      setPagination(prev => ({
        ...prev,
        total,
        totalPages: Math.ceil(total / limit)
      }));
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to fetch categories');
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const toggleCategoryStatus = async (id: string, currentStatus: boolean) => {
    try {
      await api.patch(`/experiences/categories/${id}`, {
        is_active: !currentStatus
      });
      toast.success(`Category ${currentStatus ? 'deactivated' : 'activated'} successfully`);
      fetchCategories();
    } catch (err) {
      toast.error('Failed to update category status');
      console.error(err);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      setDeletingId(id);
      await api.delete(`/experiences/categories/${id}`);
      toast.success('Category deleted successfully');
      await fetchCategories();
    } catch (err) {
      toast.error('Failed to delete category');
      console.error(err);
    } finally {
      setDeletingId(null);
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Skeleton loading component
  const SkeletonRow = () => (
    <tr className="animate-pulse">
      <td className="px-3 py-3 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-md"></div>
          <div className="ml-3">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
      </td>
      <td className="px-3 py-3 whitespace-nowrap">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </td>
      <td className="px-3 py-3 whitespace-nowrap">
        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
      </td>
      <td className="px-3 py-3 whitespace-nowrap">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
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
            Experience Categories
          </h1>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative flex-grow sm:w-48 md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search categories..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-[#8B6B3D] focus:border-[#8B6B3D] text-sm sm:text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-2">
              <button
                onClick={() => navigate('/admin/categories/new')}
                className="flex items-center justify-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#8B6B3D] hover:bg-[#6B4F2D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B6B3D] whitespace-nowrap"
              >
                <FiPlus className="mr-1 sm:mr-2" />
                <span className="hidden sm:inline">New Category</span>
                <span className="sm:hidden">Add</span>
              </button>

              <button
                onClick={fetchCategories}
                disabled={loading}
                className="flex items-center justify-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#8B6B3D] hover:bg-[#6B4F2D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B6B3D] disabled:opacity-70 whitespace-nowrap"
              >
                <FiRefreshCw
                  className={`mr-1 sm:mr-2 ${loading ? 'animate-spin' : ''}`}
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
                    Category
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    Slug
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
                    Created
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
                ) : categories.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-3 py-4 text-center text-gray-500"
                    >
                      No categories found
                    </td>
                  </tr>
                ) : (
                  categories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50">
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          {category.image_path ? (
                            <div className="flex-shrink-0 h-10 w-10">
                              <img
                                className="h-10 w-10 rounded-md object-cover"
                                src={category.image_path}
                                alt={category.name}
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.onerror = null;
                                  target.src = '/placeholder-image.jpg';
                                }}
                              />
                            </div>
                          ) : (
                            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-md bg-gray-100">
                              <FiImage className="text-gray-400" />
                            </div>
                          )}
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900 line-clamp-1">
                              {category.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {category.slug}
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer ${
                            category.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                          onClick={() =>
                            toggleCategoryStatus(category.id, category.is_active)
                          }
                        >
                          {category.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="text-xs sm:text-sm text-gray-500">
                          {formatDate(category.created_at)}
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() =>
                              navigate(`/admin/categories/edit/${category.id}`)
                            }
                            className="text-[#8B6B3D] hover:text-[#6B4F2D]"
                            title="Edit"
                          >
                            <FiEdit className="h-4 w-4 sm:h-5 sm:w-5" />
                          </button>

                          <button
                            onClick={() => {
                              setCategoryToDelete(category.id);
                              setIsDeleteModalOpen(true);
                            }}
                            disabled={deletingId === category.id}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                            title="Delete"
                          >
                            {deletingId === category.id ? (
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
                    Showing{' '}
                    <span className="font-medium">
                      {(pagination.page - 1) * pagination.limit + 1}
                    </span>{' '}
                    to{' '}
                    <span className="font-medium">
                      {Math.min(
                        pagination.page * pagination.limit,
                        pagination.total
                      )}
                    </span>{' '}
                    of <span className="font-medium">{pagination.total}</span>{' '}
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
                                ? 'bg-[#8B6B3D] text-white border-[#8B6B3D]'
                                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
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
                Are you sure you want to delete this category? This action cannot be
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
                    if (categoryToDelete) await deleteCategory(categoryToDelete);
                    setIsDeleteModalOpen(false);
                  }}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  {deletingId === categoryToDelete ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCategories;