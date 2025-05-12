import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import clsx from 'clsx';
import {
  Users,
  BookOpen,
  Image,
  Menu as MenuIcon,
  X,
  ChevronDown,
  LogOut,
  Home,
  User,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  CassetteTapeIcon,
  LogOutIcon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { FaBinoculars, FaMap, FaWpexplorer } from 'react-icons/fa';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Hero Section', href: '/admin/hero', icon: Image },
  { name: 'Tours', href: '/admin/tours', icon: FaMap },
  { name: 'Experience', href: '/admin/experience', icon: FaBinoculars },
  { name: 'Tour Bookings', href: '/admin/bookings', icon: BookOpen },
  { name: 'Experience Bookings', href: '/admin/experience-booking', icon: FaWpexplorer },
  { name: 'Categories', href: '/admin/categories', icon: CassetteTapeIcon },
  { name: 'Users', href: '/admin/users', icon: Users },
];

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to login page after logout
  };

   // Function to ensure image URLs are absolute
const getFullImageUrl = (path: string) => {
  if (!path) return ''; // Handle empty paths
  
  // If it's already a full URL, return as-is
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;

  // In production, use the production API URL
  return `https://api.olosuashi.com/${cleanPath}`;
};

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      {/* Mobile sidebar overlay */}
      <div
        className={clsx(
          'fixed inset-0 z-50 bg-gray-900/80 lg:hidden',
          sidebarOpen ? 'block' : 'hidden'
        )}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Mobile sidebar */}
      <div
        className={clsx(
          'fixed inset-y-0 left-0 z-50 w-72 bg-white lg:hidden transform transition-transform duration-300 ease-in-out',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b border-[#E8E6E1]">
          <div className="flex items-center gap-2">
            <img src="/title-logo.png" alt="Logo" className="w-12 h-12" />
            <span className="text-xl font-semibold text-[#2D2B2A]">Olosuashi Tours</span>
          </div>
          <button
            title='close'
            onClick={() => setSidebarOpen(false)}
            className="text-gray-500 hover:text-[#8B4513] transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex flex-col gap-2 p-4">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={clsx(
                  'flex items-center gap-3 px-4 py-4 text-sm font-medium rounded-lg transition-colors',
                  location.pathname === item.href
                    ? 'bg-[#8B4513] text-white'
                    : 'text-[#2D2B2A] hover:bg-[#E8E6E1]'
                )}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
          {/* Logout button in mobile sidebar */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-4 text-sm font-medium rounded-lg transition-colors text-red-600 hover:bg-red-50 mt-auto mb-4"
          >
            <LogOutIcon className="h-5 w-5" />
            Logout
          </button>
        </nav>
      </div>

      {/* Desktop sidebar */}
      <div 
        className={clsx(
          'hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col transition-all duration-300',
          isCollapsed ? 'lg:w-20' : 'lg:w-72'
        )}
      >
        <div className="flex flex-col flex-grow bg-white border-r border-[#E8E6E1]">
          <div className="flex h-16 items-center gap-2 px-6 border-b border-[#E8E6E1]">
            <img src="/title-logo.png" alt="Logo" className="w-12 h-12" />
            {!isCollapsed && (
              <span className="text-xl font-semibold text-[#2D2B2A]">Olosuashi Tours</span>
            )}
          </div>
          <nav className="flex flex-col gap-2 p-4 flex-grow">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={clsx(
                    'flex items-center gap-3 px-4 py-4 text-sm font-medium rounded-lg transition-colors',
                    location.pathname === item.href
                      ? 'bg-[#8B4513] text-white'
                      : 'text-[#2D2B2A] hover:bg-[#E8E6E1]'
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && item.name}
                </Link>
              );
            })}
            {/* Logout button in desktop sidebar */}
            <button
              onClick={handleLogout}
              className={clsx(
                'flex items-center gap-3 px-4 py-4 text-sm font-medium rounded-lg transition-colors text-red-600 hover:bg-red-50 mt-auto',
                isCollapsed ? 'justify-center' : ''
              )}
            >
              <LogOutIcon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && 'Logout'}
            </button>
          </nav>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-3 top-20 bg-white border border-[#E8E6E1] rounded-full p-1.5 text-[#8B4513] hover:text-[#A0522D] transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Main content wrapper */}
      <div 
        className={clsx(
          'transition-all duration-300 ease-in-out',
          isCollapsed ? 'lg:ml-20' : 'lg:ml-72'
        )}
      >
        {/* Navbar */}
        <div className={clsx(
          "sticky top-0 z-40 bg-white border-b border-[#E8E6E1]",
          isCollapsed ? "lg:left-20" : "lg:left-72"
        )}>
          <div className="flex h-16 items-center gap-4 px-4 shadow-sm sm:px-6">
            <button
              title='button'
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-[#8B4513] transition-colors"
            >
              <MenuIcon className="h-6 w-6" />
            </button>

            {/* Profile dropdown */}
            <Menu as="div" className="relative ml-auto">
              <Menu.Button className="flex items-center gap-3 rounded-lg bg-white p-1.5 text-sm font-medium text-[#2D2B2A] hover:bg-[#F8F7F4] transition-colors">
                <img
                  src={getFullImageUrl(user?.profile_picture || '')}
                  alt="Admin Profile" 
                  className="h-8 w-8 rounded-full object-cover"
                />
                <div className="hidden lg:flex lg:flex-col lg:items-start">
                  <span className="text-[#2D2B2A]">{user?.email}</span>
                  <span className="text-sm text-gray-500">{user?.username || 'Admin'}</span>
                </div>
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </Menu.Button>

              <Transition
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/admin/profile"
                          className={clsx(
                            active ? 'bg-[#F8F7F4]' : '',
                            'flex items-center gap-3 px-4 py-2 text-sm text-[#2D2B2A]'
                          )}
                        >
                          <User className="h-5 w-5" />
                          Update Profile
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/"
                          className={clsx(
                            active ? 'bg-[#F8F7F4]' : '',
                            'flex items-center gap-3 px-4 py-2 text-sm text-[#2D2B2A]'
                          )}
                        >
                          <Home className="h-5 w-5" />
                          Homepage
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={clsx(
                            active ? 'bg-[#F8F7F4]' : '',
                            'flex w-full items-center gap-3 px-4 py-2 text-sm text-red-700'
                          )}
                        >
                          <LogOut className="h-5 w-5" />
                          Logout
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>

        {/* Main content */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;