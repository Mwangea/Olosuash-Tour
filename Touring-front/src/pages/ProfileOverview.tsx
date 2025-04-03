import React, { useState, useRef, ChangeEvent, FormEvent } from 'react';
import { Edit2, Save, X, Upload, Camera } from 'lucide-react';
import toast from 'react-hot-toast';
import { ProfileFormData, userApi, UserProfile } from '../api/userApi';





// Define API response interfaces
interface ProfileResponse {
  profile: UserProfile;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: string;
}

// Extend the userApi type with the updateProfileWithImage method
interface UserApiExtended {
  getProfile(): Promise<UserProfile>;
  updateProfile(data: ProfileFormData): Promise<ApiResponse<ProfileResponse>>;
  updateProfileWithImage?: (formData: FormData) => Promise<ApiResponse<ProfileResponse>>;
}

// Props interface
interface ProfileOverviewProps {
    profile: UserProfile;
    setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  }
// Cast userApi to extended interface with a conversion to 'unknown' first
const extendedUserApi = userApi as unknown as UserApiExtended;

const ProfileOverview: React.FC<ProfileOverviewProps> = ({ profile, setProfile }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    username: profile.username || '',
    email: profile.email || '',
    phone_number: profile.phone_number || '',
    first_name: profile.first_name || '',
    last_name: profile.last_name || '',
    date_of_birth: profile.date_of_birth ? profile.date_of_birth.split('T')[0] : '',
    address: profile.address || '',
    city: profile.city || '',
    country: profile.country || '',
    postal_code: profile.postal_code || ''
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(profile.profile_picture || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Create FormData object to send both data and file
      const data = new FormData();
      
      // Add all form fields to FormData
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          data.append(key, formData[key]);
        }
      });
      
      // Add profile image if selected
      if (profileImage) {
        data.append('profile_picture', profileImage);
      }
      
      // Create API method to update profile if not exists
      if (!extendedUserApi.updateProfileWithImage) {
        extendedUserApi.updateProfileWithImage = async (formData: FormData) => {
          const response = await fetch('/api/users/profile', {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData // Don't set Content-Type - browser will set it with boundary for FormData
          });
          
          if (!response.ok) {
            throw new Error('Failed to update profile');
          }
          
          return response.json();
        };
      }
      
      const updatedProfile = await extendedUserApi.updateProfileWithImage(data);
      
      // Update the profile in parent component
      setProfile(updatedProfile.data.profile);
      
      // Reset profile image state
      setProfileImage(null);
      
      // Show success message
      toast.success('Profile updated successfully!');
      
      // Exit edit mode
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to current profile values
    setFormData({
      username: profile.username || '',
      email: profile.email || '',
      phone_number: profile.phone_number || '',
      first_name: profile.first_name || '',
      last_name: profile.last_name || '',
      date_of_birth: profile.date_of_birth ? profile.date_of_birth.split('T')[0] : '',
      address: profile.address || '',
      city: profile.city || '',
      country: profile.country || '',
      postal_code: profile.postal_code || ''
    });
    
    // Reset profile image states
    setProfileImage(null);
    setPreviewUrl(profile.profile_picture || '');
    
    // Exit edit mode
    setIsEditing(false);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Function to get display name
  const getDisplayName = () => {
    if (profile.first_name && profile.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    } else if (profile.first_name) {
      return profile.first_name;
    } else {
      return profile.username;
    }
  };

  // Function to get profile picture or generate initials
  const getProfileDisplay = () => {
    if (previewUrl) {
      return (
        <img 
          src={previewUrl.startsWith('data:') ? previewUrl : previewUrl} 
          alt="Profile"
          className="w-full h-full object-cover"
         />
      );
    } else {
      // Generate initials for avatar
      const initials = getDisplayName()
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
        
      return (
        <div className="w-full h-full flex items-center justify-center bg-[#A0522D] text-white text-3xl font-bold">
          {initials}
        </div>
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#8B4513]">Profile Overview</h2>
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center px-4 py-2 bg-[#8B4513] text-white rounded-md hover:bg-[#A0522D] transition"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Edit Profile
          </button>
        ) : (
          <div className="flex space-x-2">
            <button 
              onClick={handleCancel}
              className="flex items-center px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
              disabled={isSubmitting}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </button>
            <button 
              onClick={handleSubmit}
              className="flex items-center px-4 py-2 bg-[#8B4513] text-white rounded-md hover:bg-[#A0522D] transition"
              disabled={isSubmitting}
            >
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>
      
      {/* Profile Picture Section - Always visible */}
      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 bg-[#F5F0E6] p-6 rounded-lg">
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#8B4513]">
            {getProfileDisplay()}
          </div>
          
          {isEditing && (
            <button 
              onClick={triggerFileInput}
              className="absolute bottom-0 right-0 w-8 h-8 bg-[#8B4513] rounded-full flex items-center justify-center text-white hover:bg-[#A0522D]"
            >
              <Camera className="w-4 h-4" />
            </button>
          )}
          
          <input 
          title='image'
            type="file" 
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />
        </div>
        
        <div>
          <h3 className="text-xl font-semibold">{getDisplayName()}</h3>
          <p className="text-gray-600">{profile.email}</p>
          {isEditing && (
            <div className="mt-2">
              <button
                onClick={triggerFileInput}
                className="flex items-center text-sm text-[#8B4513] hover:text-[#A0522D]"
              >
                <Upload className="w-4 h-4 mr-1" />
                Change Profile Picture
              </button>
            </div>
          )}
        </div>
      </div>
      
      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Account Information */}
            <div className="bg-[#F5F0E6] p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-[#8B4513] mb-4">Account Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-600 mb-1">Username</label>
                  <input
                  title='user-name'
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B4513]"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">Email</label>
                  <input
                  title="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B4513]"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">Phone Number</label>
                  <input
                  title='phone number'
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B4513]"
                  />
                </div>
              </div>
            </div>
            
            {/* Personal Information */}
            <div className="bg-[#F5F0E6] p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-[#8B4513] mb-4">Personal Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-600 mb-1">First Name</label>
                  <input
                  title='name'
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B4513]"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">Last Name</label>
                  <input
                  title='text'
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B4513]"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">Date of Birth</label>
                  <input
                  title='date'
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B4513]"
                  />
                </div>
              </div>
            </div>
            
            {/* Address */}
            <div className="bg-[#F5F0E6] p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-[#8B4513] mb-4">Address</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-600 mb-1">Address</label>
                  <input
                  title='text'
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B4513]"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">City</label>
                  <input
                  title='city'
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B4513]"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">Country</label>
                  <input
                  title='text'
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B4513]"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">Postal Code</label>
                  <input
                  title='postal code'
                    type="text"
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B4513]"
                  />
                </div>
              </div>
            </div>
            
            {/* Account Status - View only */}
            <div className="bg-[#F5F0E6] p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-[#8B4513] mb-4">Account Status</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-600">Email Verification</p>
                  <div className="flex items-center">
                    <span className={`inline-block w-3 h-3 rounded-full mr-2 ${profile.is_verified ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    <p className="font-medium">{profile.is_verified ? 'Verified' : 'Not Verified'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-600">Member Since</p>
                  <p className="font-medium">{new Date(profile.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">Account Type</p>
                  <p className="font-medium capitalize">{profile.role}</p>
                </div>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Account Information */}
          <div className="bg-[#F5F0E6] p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-[#8B4513] mb-4">Account Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-gray-600">Username</p>
                <p className="font-medium">{profile.username}</p>
              </div>
              <div>
                <p className="text-gray-600">Email</p>
                <p className="font-medium">{profile.email}</p>
              </div>
              <div>
                <p className="text-gray-600">Phone Number</p>
                <p className="font-medium">{profile.phone_number || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-gray-600">Account Type</p>
                <p className="font-medium capitalize">{profile.role}</p>
              </div>
              <div>
                <p className="text-gray-600">Member Since</p>
                <p className="font-medium">{new Date(profile.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
          
          {/* Personal Information */}
          <div className="bg-[#F5F0E6] p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-[#8B4513] mb-4">Personal Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-gray-600">Full Name</p>
                <p className="font-medium">
                  {profile.first_name && profile.last_name 
                    ? `${profile.first_name} ${profile.last_name}` 
                    : 'Not provided'}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Date of Birth</p>
                <p className="font-medium">
                  {profile.date_of_birth 
                    ? new Date(profile.date_of_birth).toLocaleDateString() 
                    : 'Not provided'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Address */}
          <div className="bg-[#F5F0E6] p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-[#8B4513] mb-4">Address</h3>
            <div className="space-y-3">
              <div>
                <p className="text-gray-600">Address</p>
                <p className="font-medium">{profile.address || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-gray-600">City</p>
                <p className="font-medium">{profile.city || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-gray-600">Country</p>
                <p className="font-medium">{profile.country || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-gray-600">Postal Code</p>
                <p className="font-medium">{profile.postal_code || 'Not provided'}</p>
              </div>
            </div>
          </div>
          
          {/* Account Status */}
          <div className="bg-[#F5F0E6] p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-[#8B4513] mb-4">Account Status</h3>
            <div className="space-y-3">
              <div>
                <p className="text-gray-600">Email Verification</p>
                <div className="flex items-center">
                  <span className={`inline-block w-3 h-3 rounded-full mr-2 ${profile.is_verified ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <p className="font-medium">{profile.is_verified ? 'Verified' : 'Not Verified'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileOverview;