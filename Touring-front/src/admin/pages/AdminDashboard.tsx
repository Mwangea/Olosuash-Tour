import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  BookOpen,
  Calendar,
  Clock,
  ArrowUpRight,
  ChevronRight,
  Activity,
  DollarSign,
  TrendingUp,
  UserCheck,
  Star,
} from "lucide-react";
import AdminLayout from "../Adminlayout";
import api from "../../api/axios";

interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
  profile_picture?: string;
}

interface Booking {
  id: number;
  tour_title: string;
  user_name: string;
  travel_date: string;
  status: string;
  total_price: number;
}

interface Stats {
  total_users: number;
  total_bookings: number;
  recent_signups: number;
  revenue: number;
  tour_stats?: {
    total_tours: number;
    average_price: number;
    min_price: number;
    max_price: number;
    total_reviews: number;
    average_rating: number;
    featured_tours: number;
    total_reviews_all: number;
  };
}

interface QuickStats {
  avgBookings: string;
  avgRevenue: number;
  conversionRate: string;
  avgResponseTime: number;
  period_days?: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [quickStats, setQuickStats] = useState<QuickStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState({
    stats: true,
    users: true,
    bookings: true,
    quickStats: true,
  });

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use the API client with authentication interceptors instead of native fetch
        const [usersRes, bookingsRes, quickStatsRes, toursRes] =
          await Promise.all([
            api.get("/admin/users/stats"),
            api.get("/bookings/stats/overview"),
            api.get("/bookings/stats/quick?days=30"),
            api.get("/tours/stats"),
          ]);

        const usersData = usersRes.data;
        const bookingsData = bookingsRes.data;
        const quickStatsData = quickStatsRes.data;
        const toursData = toursRes.data;

        setStats({
          total_users: usersData.data.stats.totalUsers,
          recent_signups: usersData.data.stats.usersByMonth?.[0]?.count || 0,
          total_bookings: bookingsData.data.stats.total_bookings,
          revenue: bookingsData.data.stats.total_revenue || 0,
          tour_stats: toursData.data.stats,
        });

        setQuickStats(quickStatsData.data);

        setLoading((prev) => ({
          ...prev,
          stats: false,
          quickStats: false,
        }));

        // Use API client for recent users
        const usersListRes = await api.get("/admin/users?limit=5");
        const usersListData = usersListRes.data;
        setRecentUsers(usersListData.data.users);
        setLoading((prev) => ({ ...prev, users: false }));

        // Use API client for recent bookings
        const bookingsListRes = await api.get("/bookings?limit=5");
        const bookingsListData = bookingsListRes.data;
        setRecentBookings(bookingsListData.data.bookings);
        setLoading((prev) => ({ ...prev, bookings: false }));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <AdminLayout>
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Dashboard Overview
          </h2>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {/* Total Users */}
        <div className="bg-white overflow-hidden rounded-lg shadow border border-gray-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-[#F5F0E6] p-3 rounded-md">
                <Users className="h-6 w-6 text-[#8B6B3D]" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Users
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {loading.stats ? (
                        <div className="h-8 w-12 bg-gray-200 rounded animate-pulse"></div>
                      ) : (
                        stats?.total_users.toLocaleString()
                      )}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link
                to="/admin/users"
                className="font-medium text-[#8B6B3D] hover:text-[#6B4F2D]"
              >
                View all users <ArrowUpRight className="inline h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Total Bookings */}
        <div className="bg-white overflow-hidden rounded-lg shadow border border-gray-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-[#F5F0E6] p-3 rounded-md">
                <BookOpen className="h-6 w-6 text-[#8B6B3D]" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Bookings
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {loading.stats ? (
                        <div className="h-8 w-12 bg-gray-200 rounded animate-pulse"></div>
                      ) : (
                        stats?.total_bookings.toLocaleString()
                      )}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link
                to="/admin/bookings"
                className="font-medium text-[#8B6B3D] hover:text-[#6B4F2D]"
              >
                View all bookings <ArrowUpRight className="inline h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Total Tours */}
        <div className="bg-white overflow-hidden rounded-lg shadow border border-gray-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-[#F5F0E6] p-3 rounded-md">
                <BookOpen className="h-6 w-6 text-[#8B6B3D]" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Tours
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {loading.stats ? (
                        <div className="h-8 w-12 bg-gray-200 rounded animate-pulse"></div>
                      ) : (
                        stats?.tour_stats?.total_tours.toLocaleString()
                      )}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link
                to="/admin/tours"
                className="font-medium text-[#8B6B3D] hover:text-[#6B4F2D]"
              >
                View all tours <ArrowUpRight className="inline h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white overflow-hidden rounded-lg shadow border border-gray-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-[#F5F0E6] p-3 rounded-md">
                <DollarSign className="h-6 w-6 text-[#8B6B3D]" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Revenue
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {loading.stats ? (
                        <div className="h-8 w-12 bg-gray-200 rounded animate-pulse"></div>
                      ) : (
                        formatCurrency(stats?.revenue || 0)
                      )}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link
                to="/admin/bookings"
                className="font-medium text-[#8B6B3D] hover:text-[#6B4F2D]"
              >
                View revenue report <ArrowUpRight className="inline h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Users and Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Users */}
        <div className="bg-white overflow-hidden rounded-lg shadow border border-gray-200">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
              <Users className="h-5 w-5 text-[#8B6B3D] mr-2" />
              Recent Signups
            </h3>
          </div>
          <div className="bg-white overflow-hidden">
            {loading.users ? (
              <div className="p-6 space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
                    <div className="flex-1 ml-4 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {recentUsers.map((user) => (
                  <li key={user.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
                          {user.profile_picture ? (
                            <img
                              className="h-full w-full object-cover"
                              src={user.profile_picture}
                              alt={user.username}
                            />
                          ) : (
                            <div className="h-full w-full bg-[#8B6B3D] flex items-center justify-center text-white font-medium">
                              {user.username.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-[#8B6B3D] truncate">
                              {user.username}
                            </p>
                            <div className="ml-2 flex-shrink-0 flex">
                              <Link
                                to={`/admin/users/${user.id}`}
                                className="text-xs text-gray-500 hover:text-[#8B6B3D]"
                              >
                                View
                              </Link>
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <p className="text-sm text-gray-500 truncate">
                              {user.email}
                            </p>
                            <p className="text-xs text-gray-400">
                              {formatDate(user.created_at)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="bg-gray-50 px-4 py-4 sm:px-6 border-t border-gray-200">
            <div className="text-sm">
              <Link
                to="/admin/users"
                className="font-medium text-[#8B6B3D] hover:text-[#6B4F2D] inline-flex items-center"
              >
                View all users <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white overflow-hidden rounded-lg shadow border border-gray-200">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
              <Calendar className="h-5 w-5 text-[#8B6B3D] mr-2" />
              Recent Bookings
            </h3>
          </div>
          <div className="bg-white overflow-hidden">
            {loading.bookings ? (
              <div className="p-6 space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                    <div className="flex justify-between">
                      <div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {recentBookings.map((booking) => (
                  <li key={booking.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-[#8B6B3D] truncate">
                          {booking.tour_title}
                        </p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              booking.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : booking.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            <UserCheck className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            {booking.user_name}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          <p>
                            {formatDate(booking.travel_date)} •{" "}
                            <span className="font-medium text-gray-900">
                              {formatCurrency(booking.total_price)}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="bg-gray-50 px-4 py-4 sm:px-6 border-t border-gray-200">
            <div className="text-sm">
              <Link
                to="/admin/bookings"
                className="font-medium text-[#8B6B3D] hover:text-[#6B4F2D] inline-flex items-center"
              >
                View all bookings <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-lg shadow border border-gray-200 mb-8">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
            <Activity className="h-5 w-5 text-[#8B6B3D] mr-2" />
            Quick Stats
            {!loading.quickStats && quickStats?.period_days && (
              <span className="ml-2 text-sm text-gray-500">
                (Last {quickStats.period_days} days)
              </span>
            )}
          </h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* Average Bookings Per Day */}
            <div className="bg-[#F5F0E6] overflow-hidden rounded-lg px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-[#8B6B3D] rounded-md p-3">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Avg. Bookings/Day
                  </dt>
                  <dd className="flex items-baseline">
                    {loading.quickStats ? (
                      <div className="h-6 w-16 bg-gray-300 rounded animate-pulse"></div>
                    ) : (
                      <div className="text-2xl font-semibold text-gray-900">
                        {quickStats?.avgBookings || "0"}
                      </div>
                    )}
                  </dd>
                </div>
              </div>
            </div>

            {/* Average Revenue Per Booking */}
            <div className="bg-[#F5F0E6] overflow-hidden rounded-lg px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-[#8B6B3D] rounded-md p-3">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Avg. Revenue/Booking
                  </dt>
                  <dd className="flex items-baseline">
                    {loading.quickStats ? (
                      <div className="h-6 w-16 bg-gray-300 rounded animate-pulse"></div>
                    ) : (
                      <div className="text-2xl font-semibold text-gray-900">
                        {formatCurrency(Number(quickStats?.avgRevenue) || 0)}
                      </div>
                    )}
                  </dd>
                </div>
              </div>
            </div>

            {/* Conversion Rate */}
            <div className="bg-[#F5F0E6] overflow-hidden rounded-lg px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-[#8B6B3D] rounded-md p-3">
                  <UserCheck className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Conversion Rate
                  </dt>
                  <dd className="flex items-baseline">
                    {loading.quickStats ? (
                      <div className="h-6 w-16 bg-gray-300 rounded animate-pulse"></div>
                    ) : (
                      <div className="text-2xl font-semibold text-gray-900">
                        {quickStats?.conversionRate || "0"}%
                      </div>
                    )}
                  </dd>
                </div>
              </div>
            </div>

            {/* Average Response Time */}
            <div className="bg-[#F5F0E6] overflow-hidden rounded-lg px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-[#8B6B3D] rounded-md p-3">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Avg. Response Time
                  </dt>
                  <dd className="flex items-baseline">
                    {loading.quickStats ? (
                      <div className="h-6 w-16 bg-gray-300 rounded animate-pulse"></div>
                    ) : (
                      <div className="text-2xl font-semibold text-gray-900">
                        {quickStats?.avgResponseTime || "0"}h
                      </div>
                    )}
                  </dd>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tour Statistics */}
      <div className="bg-white rounded-lg shadow border border-gray-200 mb-8">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
            <Activity className="h-5 w-5 text-[#8B6B3D] mr-2" />
            Tour Statistics
          </h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* Average Price */}
            <div className="bg-[#F5F0E6] overflow-hidden rounded-lg px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-[#8B6B3D] rounded-md p-3">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Avg. Price
                  </dt>
                  <dd className="flex items-baseline">
                    {loading.stats ? (
                      <div className="h-6 w-16 bg-gray-300 rounded animate-pulse"></div>
                    ) : (
                      <div className="text-2xl font-semibold text-gray-900">
                        {formatCurrency(stats?.tour_stats?.average_price || 0)}
                      </div>
                    )}
                  </dd>
                </div>
              </div>
            </div>

            {/* Price Range */}
            <div className="bg-[#F5F0E6] overflow-hidden rounded-lg px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-[#8B6B3D] rounded-md p-3">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Price Range
                  </dt>
                  <dd className="flex items-baseline">
                    {loading.stats ? (
                      <div className="h-6 w-16 bg-gray-300 rounded animate-pulse"></div>
                    ) : (
                      <div className="text-2xl font-semibold text-gray-900">
                        {formatCurrency(stats?.tour_stats?.min_price || 0)} -{" "}
                        {formatCurrency(stats?.tour_stats?.max_price || 0)}
                      </div>
                    )}
                  </dd>
                </div>
              </div>
            </div>

            {/* Average Rating */}
            <div className="bg-[#F5F0E6] overflow-hidden rounded-lg px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-[#8B6B3D] rounded-md p-3">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Avg. Rating
                  </dt>
                  <dd className="flex items-baseline">
                    {loading.stats ? (
                      <div className="h-6 w-16 bg-gray-300 rounded animate-pulse"></div>
                    ) : (
                      <div className="text-2xl font-semibold text-gray-900">
                        {typeof stats?.tour_stats?.average_rating === "number"
                          ? stats.tour_stats.average_rating.toFixed(1)
                          : parseFloat(
                              stats?.tour_stats?.average_rating || "0"
                            ).toFixed(1)}
                        /5
                      </div>
                    )}
                  </dd>
                </div>
              </div>
            </div>

            {/* Featured Tours */}
            <div className="bg-[#F5F0E6] overflow-hidden rounded-lg px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-[#8B6B3D] rounded-md p-3">
                  <UserCheck className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Featured Tours
                  </dt>
                  <dd className="flex items-baseline">
                    {loading.stats ? (
                      <div className="h-6 w-16 bg-gray-300 rounded animate-pulse"></div>
                    ) : (
                      <div className="text-2xl font-semibold text-gray-900">
                        {stats?.tour_stats?.featured_tours || "0"}
                      </div>
                    )}
                  </dd>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
