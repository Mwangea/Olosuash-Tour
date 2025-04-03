import { FiAlertTriangle, FiX } from 'react-icons/fi';
import { UserProfile } from '../../api/userApi';

interface UserDeleteModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

const UserDeleteModal = ({ 
  user, 
  isOpen, 
  onClose, 
  onConfirm, 
  isLoading 
}: UserDeleteModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-[#8B4513]">Delete User</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiX size={24} />
            </button>
          </div>

          <div className="flex items-start mb-6">
            <FiAlertTriangle className="text-yellow-500 mr-3 mt-1" size={24} />
            <div>
              <p className="text-gray-700 mb-2">
                Are you sure you want to delete the user <strong>{user.username}</strong> ({user.email})?
              </p>
              <p className="text-gray-600">
                This action cannot be undone. All user data will be permanently removed.
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B4513]"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-400"
              disabled={isLoading}
            >
              {isLoading ? 'Deleting...' : 'Delete User'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDeleteModal;