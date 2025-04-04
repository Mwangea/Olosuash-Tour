import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import adminApi from '../../api/adminApi';
import AdminLayout from '../Adminlayout';
import { User, Upload, Save } from 'lucide-react';

const UpdateProfilePage: React.FC = () => {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
  });
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(
    user?.profile_picture || null
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formDataToSend = new FormData();
    formDataToSend.append('username', formData.username);
    formDataToSend.append('email', formData.email);
    
    if (profilePicture) {
      formDataToSend.append('profile_picture', profilePicture);
    }

    try {
      const { profile } = await adminApi.updateAdminProfile(formDataToSend);
      setUser(profile);
      // Show success notification instead of alert
    } catch (error) {
      console.error('Failed to update profile', error);
      // Show error notification instead of alert
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto mt-8">
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
              <User className="h-5 w-5 text-[#8B6B3D] mr-2" />
              Update Profile
            </h3>
          </div>
          
          <div className="px-6 py-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Picture */}
              <div className="space-y-2">
                <label htmlFor="profile-picture" className="block text-sm font-medium text-gray-700">
                  Profile Picture
                </label>
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <img 
                      src={previewImage || '/default-avatar.png'} 
                      alt="Profile" 
                      className="w-20 h-20 rounded-full object-cover border-2 border-[#8B6B3D]"
                    />
                  </div>
                  <div>
                    <input 
                      type="file" 
                      id="profile-picture"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label 
                      htmlFor="profile-picture" 
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#8B6B3D] hover:bg-[#6B4F2D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B6B3D]"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Change Photo
                    </label>
                    <p className="mt-1 text-xs text-gray-500">
                      JPG, GIF or PNG. Max size 2MB
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#8B6B3D] focus:border-[#8B6B3D] sm:text-sm"
                    required
                  />
                </div>
              </div>
              
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#8B6B3D] focus:border-[#8B6B3D] sm:text-sm"
                    required
                  />
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#8B6B3D] hover:bg-[#6B4F2D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B6B3D] disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    'Saving...'
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UpdateProfilePage;