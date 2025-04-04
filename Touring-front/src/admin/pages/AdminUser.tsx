import { useState, useEffect } from "react";
import AdminLayout from "../Adminlayout";
import {
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiFilter,
  FiRefreshCw,
} from "react-icons/fi";
import { formatDate } from "../../utils/format";
import LoadingSpinner from "../../components/LoadingSpinner";
import api from "../../api/axios";
import { UserProfile } from "../../api/userApi";
import UserEditModal from "../components/UserEditModal";
import Pagination from "../../components/Pagination";
import UserDeleteModal from "../components/UserDeleteModal";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminUser = () => {
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [displayUsers, setDisplayUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [verificationFilter, setVerificationFilter] = useState<
    "all" | "verified" | "unverified"
  >("all");
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setError("");
        // Changed API call to fetch all users instead of paginated data
        const response = await api.get(`/admin/users?limit=1000`);
        setAllUsers(response.data.data.users);
        setTotalUsers(response.data.results);
      } catch (err) {
        setError("Failed to fetch users. Please try again later.");
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    };

    fetchUsers();
  }, []);

  // Apply filters and search whenever the underlying data changes
  useEffect(() => {
    let filtered = [...allUsers];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply verification status filter
    if (verificationFilter !== "all") {
      filtered = filtered.filter(
        (user) =>
          (verificationFilter === "verified" && user.is_verified === 1) ||
          (verificationFilter === "unverified" && user.is_verified === 0)
      );
    }

    // Calculate total pages
    setTotalUsers(filtered.length);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));

    // Apply pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setDisplayUsers(filtered.slice(startIndex, endIndex));
  }, [allUsers, searchTerm, verificationFilter, currentPage]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleVerificationFilterChange = (
    status: "all" | "verified" | "unverified"
  ) => {
    setVerificationFilter(status);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleEditUser = (user: UserProfile) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDeleteUser = (user: UserProfile) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const refreshUsersList = async () => {
    setIsRefreshing(true);
    try {
      const response = await api.get(`/admin/users?limit=1000`);
      setAllUsers(response.data.data.users);
      setTotalUsers(response.data.results);
    } catch (err) {
      setError("Failed to refresh users. Please try again later.");
      console.error("Error refreshing users:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const confirmDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      setIsProcessing(true);
      await api.delete(`/admin/users/${selectedUser.id}`);

      // Update the users list
      const updatedUsers = allUsers.filter(
        (user) => user.id !== selectedUser.id
      );
      setAllUsers(updatedUsers);

      setShowDeleteModal(false);
    } catch (err) {
      setError("Failed to delete user. Please try again.");
      console.error("Error deleting user:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const updateUserInList = (updatedUser: UserProfile) => {
    setAllUsers(
      allUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            Admin
          </span>
        );
      case "user":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            User
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {role}
          </span>
        );
    }
  };

  const getVerificationStatus = (isVerified: number) => {
    return isVerified === 1 ? (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Verified
      </span>
    ) : (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        Unverified
      </span>
    );
  };

  // Skeleton row for loading state
  const SkeletonRow = () => (
    <tr className="animate-pulse">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
          <div className="ml-4">
            <div className="h-4 bg-gray-300 rounded w-24"></div>
            <div className="h-3 bg-gray-300 rounded w-16 mt-2"></div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-300 rounded w-32"></div>
        <div className="h-3 bg-gray-300 rounded w-24 mt-2"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-6 bg-gray-300 rounded w-20"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-300 rounded w-24"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="flex justify-end space-x-2">
          <div className="h-6 bg-gray-300 rounded w-16"></div>
          <div className="h-6 bg-gray-300 rounded w-16"></div>
        </div>
      </td>
    </tr>
  );

  // Render loading skeleton
  const renderSkeletonLoader = () => {
    return Array(5)
      .fill(0)
      .map((_, index) => <SkeletonRow key={`skeleton-${index}`} />);
  };

  // Loading state indicator above the table
  const LoadingIndicator = () => (
    <div className="flex items-center justify-center py-2 px-4 bg-blue-50 rounded-md mb-4">
      <div className="mr-2">
        <LoadingSpinner />
      </div>
      <span className="ml-2 text-blue-700 font-medium text-sm">
        Refreshing users data...
      </span>
    </div>
  );

  // Mini spinner component for inline usage
  const MiniSpinner = () => (
    <div className="mr-2 h-4 w-4 border-2 border-t-2 border-[#8B4513] border-t-transparent rounded-full animate-spin"></div>
  );

  // Full page loading
  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h1 className="text-2xl font-bold text-[#8B4513]">
              Users Management
            </h1>
            <div className="mt-4 md:mt-0">
              <div className="h-6 bg-gray-300 rounded w-32 animate-pulse"></div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                  <div className="h-10 bg-gray-300 rounded w-full animate-pulse"></div>
                </div>
                <div className="flex items-center">
                  <div className="h-10 bg-gray-300 rounded w-40 animate-pulse"></div>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#F5F0E6]">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-[#8B4513] uppercase tracking-wider"
                    >
                      User
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-[#8B4513] uppercase tracking-wider"
                    >
                      Contact
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-[#8B4513] uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-[#8B4513] uppercase tracking-wider"
                    >
                      Joined
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-[#8B4513] uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {renderSkeletonLoader()}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold text-[#8B4513]">
            Users Management
          </h1>
          <div className="mt-4 md:mt-0 flex items-center">
            <p className="text-sm text-gray-600 mr-4">
              Total Users: <span className="font-medium">{totalUsers}</span>
            </p>
            <button
              onClick={refreshUsersList}
              disabled={isRefreshing}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-[#8B4513] hover:bg-[#A0522D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B4513] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRefreshing ? (
                <>
                  <MiniSpinner /> Refreshing...
                </>
              ) : (
                <>
                  <FiRefreshCw className="mr-1" /> Refresh
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3 flex justify-between items-center w-full">
                <p className="text-sm text-red-700">{error}</p>
                <button
                  onClick={() => setError("")}
                  className="text-red-700 hover:text-red-900"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {isRefreshing && <LoadingIndicator />}

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-[#8B4513] focus:border-[#8B4513] sm:text-sm"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>

              <div className="flex items-center">
                <div className="relative inline-block text-left">
                  <div className="flex items-center">
                    <FiFilter className="mr-2 text-[#8B4513]" />
                    <select
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#8B4513] focus:border-[#8B4513] sm:text-sm rounded-md"
                      value={verificationFilter}
                      onChange={(e) =>
                        handleVerificationFilterChange(
                          e.target.value as "all" | "verified" | "unverified"
                        )
                      }
                      aria-label="Filter users by verification status"
                    >
                      <option value="all">All Users</option>
                      <option value="verified">Verified</option>
                      <option value="unverified">Unverified</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#F5F0E6]">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-[#8B4513] uppercase tracking-wider"
                  >
                    User
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-[#8B4513] uppercase tracking-wider"
                  >
                    Contact
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-[#8B4513] uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-[#8B4513] uppercase tracking-wider"
                  >
                    Joined
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-[#8B4513] uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No users found
                    </td>
                  </tr>
                ) : (
                  displayUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {user.profile_picture ? (
                              <img
                                className="h-10 w-10 rounded-full"
                                src={user.profile_picture}
                                alt=""
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <FiUser className="text-gray-500" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.username}
                            </div>
                            <div className="text-sm text-gray-500">
                              {getRoleBadge(user.role)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <FiMail className="mr-2 text-[#8B4513]" />
                          {user.email}
                        </div>
                        {user.phone_number && (
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <FiPhone className="mr-2 text-[#8B4513]" />
                            {user.phone_number}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getVerificationStatus(user.is_verified)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <FiCalendar className="mr-2 text-[#8B4513]" />
                          {formatDate(user.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-[#8B4513] hover:text-[#A0522D] mr-4 transition-colors"
                        >
                          <FiEdit2 className="inline mr-1" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                        >
                          <FiTrash2 className="inline mr-1" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </div>

      {/* Edit User Modal */}
      {selectedUser && (
        <UserEditModal
          user={selectedUser}
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={updateUserInList}
        />
      )}

      {/* Delete User Modal */}
      {selectedUser && (
        <UserDeleteModal
          user={selectedUser}
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDeleteUser}
          isLoading={isProcessing}
        />
      )}
    </AdminLayout>
  );
};

export default AdminUser;