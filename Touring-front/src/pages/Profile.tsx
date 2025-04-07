import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Book, Heart, Settings, User, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import defaultAvatar from '/default-avatar.jpg';
import { userApi, UserProfile } from '../api/userApi';
import ProfileOverview from './ProfileOverview';
import { useAuth } from '../context/AuthContext';


const Profile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { logout } = useAuth();

  const navigationProfile = [
    { name: "Profile", link: "/profile", icon: User },
    { name: "Bookings", link: "/profile/bookings", icon: Book },
    { name: "Wishlist", link: "/profile/wishlist", icon: Heart },
    { name: "Settings", link: "/profile/settings", icon: Settings }
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userData = await userApi.getProfile();
        setProfile(userData);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    logout();
  };

  // Check if a navigation item is active
  const isActive = (path: string) => {
    if (path === "/profile" && location.pathname === "/profile") {
      return true;
    }
    return location.pathname.startsWith(path) && path !== "/profile";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F0E6D2]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8B4513]"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#F8F4EA] to-[#E9F5FF]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-[#8B4513]">Profile not found</h2>
          <p className="mt-2 text-gray-600">Please sign in to view your profile</p>
          <Link 
            to="/signin" 
            className="mt-4 inline-block px-4 py-2 bg-[#8B4513] text-white rounded-md hover:bg-[#A0522D] transition"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0E6D2]">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-80 bg-white rounded-lg shadow-md p-6 h-fit">
            <div className="flex flex-col items-center mb-8">
              <div className="relative mb-4">
                <img
                  src={profile.profile_picture || defaultAvatar}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-[#8B4513]"
                />
              </div>
              <h2 className="text-xl font-bold text-[#8B4513]">
                {profile.username}
              </h2>
              <p className="text-gray-600">{profile.email}</p>
            </div>

            <nav className="space-y-2">
              {navigationProfile.map((item) => (
                <Link
                  key={item.name}
                  to={item.link}
                  className={`flex items-center px-4 py-3 rounded-lg transition ${
                    isActive(item.link)
                      ? "bg-[#8B4513] text-white"
                      : "text-gray-700 hover:bg-[#F5F0E6] hover:text-[#8B4513]"
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span>{item.name}</span>
                </Link>
              ))}
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-[#F5F0E6] hover:text-[#8B4513] transition"
              >
                <LogOut className="w-5 h-5 mr-3" />
                <span>Logout</span>
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-white rounded-lg shadow-md p-6">
            {location.pathname === "/profile" ? (
              <ProfileOverview profile={profile} setProfile={setProfile} />
            ) : (
              <Outlet context={{ profile, setProfile }} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;