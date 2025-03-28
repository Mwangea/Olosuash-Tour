import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import adminApi from '../../api/adminApi';


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
    
    const formDataToSend = new FormData();
    formDataToSend.append('username', formData.username);
    formDataToSend.append('email', formData.email);
    
    if (profilePicture) {
      formDataToSend.append('profile_picture', profilePicture);
    }

    try {
      const { profile } = await adminApi.updateAdminProfile(formDataToSend);
      setUser(profile);
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile', error);
      alert('Failed to update profile');
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="max-w-md mx-auto mt-10">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="profile-picture" className="block mb-2">
            Profile Picture
          </label>
          <input 
            type="file" 
            id="profile-picture"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="flex items-center space-x-4">
            <img 
              src={previewImage || '/default-avatar.png'} 
              alt="Profile" 
              className="w-20 h-20 rounded-full object-cover"
            />
            <label 
              htmlFor="profile-picture" 
              className="px-4 py-2 bg-[#8B4513] text-white rounded hover:bg-[#A0522D] cursor-pointer"
            >
              Change Picture
            </label>
          </div>
        </div>
        
        <div>
          <label htmlFor="username">Username</label>
          <input 
            type="text" 
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        
        <div>
          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        
        <button 
          type="submit" 
          className="w-full px-4 py-2 bg-[#8B4513] text-white rounded hover:bg-[#A0522D]"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default UpdateProfilePage;