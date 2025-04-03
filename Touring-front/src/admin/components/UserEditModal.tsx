import { FiX, FiUser, FiMail, FiPhone, FiCheck } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { UserProfile } from '../../api/userApi';
import toast from 'react-hot-toast';

interface UserEditModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedUser: UserProfile) => void;
}

const UserEditModal = ({ user, isOpen, onClose, onSave }: UserEditModalProps) => {
  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email,
    phone_number: user.phone_number || '',
    role: user.role,
    is_verified: Boolean(user.is_verified),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Add useEffect to update form data when user changes
  useEffect(() => {
    setFormData({
      username: user.username,
      email: user.email,
      phone_number: user.phone_number || '',
      role: user.role,
      is_verified: Boolean(user.is_verified),
    });
  }, [user]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.patch(`/admin/users/${user.id}`, formData);
      onSave(response.data.data.user);
      toast.success('User updated successfully!');
      onClose();
    } catch (err: unknown) {
      // Properly type the error
      let errorMsg: string;
      if (err instanceof Error) {
        errorMsg = (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to update user';
      } else {
        errorMsg = 'Failed to update user';
      }
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg w-full max-w-md shadow-xl transform transition-all">
        <div className="bg-[#8B6B3D] px-6 py-4 rounded-t-lg flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">Edit User</h3>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-[#6B4F2D]"
          >
            <FiX size={22} />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border-l-4 border-red-400 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="text-[#8B6B3D]" />
                </div>
                <input
                  type="text"
                  name="username"
                  id="username"
                  className=" mt-1 block w-full  pl-9 pr-10 py-2 text-sm border border-gray-100 focus:outline-none focus:ring-[#8B6B3D] focus:border-[#8B6B3D] rounded-md text-gray-700 bg-white"
                  placeholder="john_doe"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-[#8B6B3D]" />
                </div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className=" mt-1 block w-full  pl-9 pr-10 py-2 text-sm border border-gray-100 focus:outline-none focus:ring-[#8B6B3D] focus:border-[#8B6B3D] rounded-md text-gray-700 bg-white"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiPhone className="text-[#8B6B3D]" />
                </div>
                <input
                  type="tel"
                  name="phone_number"
                  id="phone_number"
                  className=" mt-1 block w-full  pl-9 pr-10 py-2 text-sm border border-gray-100 focus:outline-none focus:ring-[#8B6B3D] focus:border-[#8B6B3D] rounded-md text-gray-700 bg-white"
                  placeholder="+254 700 123456"
                  value={formData.phone_number}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                id="role"
                name="role"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-sm border border-gray-100 focus:outline-none focus:ring-[#8B6B3D] focus:border-[#8B6B3D] rounded-md text-gray-700 bg-white"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="" disabled className="text-gray-400 text-sm">Select a role</option>
                <option value="user" className="text-gray-700 text-sm">User</option>
                <option value="admin" className="text-gray-700 text-sm">Admin</option>
              </select>
            </div>

            <div className="flex items-center bg-gray-50 p-3 rounded-md border border-gray-100">
              <input
                id="is_verified"
                name="is_verified"
                type="checkbox"
                className="h-5 w-5 text-[#8B6B3D] focus:ring-[#8B6B3D] border-gray-200 rounded"
                checked={formData.is_verified}
                onChange={handleChange}
              />
              <label htmlFor="is_verified" className="ml-2 block text-sm text-gray-700">
                Verified Account
              </label>
              {formData.is_verified && (
                <FiCheck className="ml-auto text-green-500" size={18} />
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B6B3D] transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#8B6B3D] hover:bg-[#6B4F2D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B6B3D] transition-colors disabled:opacity-70"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserEditModal;