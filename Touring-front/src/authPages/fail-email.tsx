
import { Link } from 'react-router-dom';
import { XCircle, RefreshCw } from 'lucide-react';

const EmailVerificationFailed = () => {
  const handleResendVerification = () => {
    // Handle resend verification logic here
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Left Side - Content */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md text-center">
          <div className="flex items-center gap-2 mb-8 justify-center">
          <img src="/title-logo.png" alt="Logo" className="w-12 h-12" />
            <h1 className="text-3xl font-bold text-gray-900">Olosuashi Tours</h1>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="flex justify-center mb-6">
              <XCircle className="w-16 h-16 text-red-500" />
            </div>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Email Verification Failed</h2>
            
            <p className="text-gray-600 mb-6">
              We couldn't verify your email address. This might be because:
            </p>
            
            <ul className="text-left text-gray-600 mb-8 space-y-2">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                The verification link has expired
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                The verification link was already used
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                The verification link is invalid
              </li>
            </ul>

            <div className="space-y-4">
              <button
                onClick={handleResendVerification}
                className="w-full bg-[#8B4513] text-white py-3 px-4 rounded-lg hover:bg-[#A0522D] transition duration-200 flex items-center justify-center"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Resend Verification Email
              </button>

              <Link
                to="/signin"
                className="block text-[#8B4513] hover:text-[#A0522D] font-medium"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block flex-1 bg-cover bg-center" style={{
        backgroundImage: "url('/monkey.jpg')"
      }}>
        <div className="h-full w-full bg-black bg-opacity-40 flex items-center justify-center p-16" style={{ opacity: 0.7}}>
          <div className="text-white">
            <h2 className="text-4xl font-bold mb-4">Don't Worry</h2>
            <p className="text-lg">We'll help you get back on track</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationFailed;