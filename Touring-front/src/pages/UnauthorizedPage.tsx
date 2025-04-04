
import { Link } from 'react-router-dom';
import { Lock, ArrowLeft } from 'lucide-react';

const UnauthorizedPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F5F0E6] p-4">
      <div className="p-8 bg-white rounded-lg shadow-lg border border-gray-200 max-w-md w-full text-center">
        {/* Icon Container */}
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-[#F5F0E6] mb-4">
          <Lock className="h-8 w-8 text-[#8B6B3D]" />
        </div>
        
        {/* Title */}
        <h1 className="text-2xl font-bold text-[#8B6B3D] mb-3">
          Access Restricted
        </h1>
        
        {/* Description */}
        <p className="text-gray-600 mb-6">
          You don't have permission to access this page. This area is restricted to authorized personnel only.
        </p>
        
        {/* Additional Info */}
        <div className="bg-[#F5F0E6] p-3 rounded-md mb-6">
          <p className="text-sm text-[#6B4F2D]">
            If you believe this is an error, please contact your system administrator.
          </p>
        </div>
        
        {/* Action Button */}
        <div className="flex justify-center">
          <Link 
            to="/" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#8B6B3D] hover:bg-[#6B4F2D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B6B3D] transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Return to Home
          </Link>
        </div>
        
        {/* Footer Note */}
        <p className="mt-6 text-xs text-gray-500">
          Unauthorized access attempts are logged
        </p>
      </div>
    </div>
  );
};

export default UnauthorizedPage;