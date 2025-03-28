import  { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {CheckCircle } from 'lucide-react';

const EmailVerificationSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login after 5 seconds
    const timer = setTimeout(() => {
      navigate('/signin');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

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
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Email Verified Successfully!</h2>
            
            <p className="text-gray-600 mb-6">
              Your email has been successfully verified. You can now access all features of Olosuashi Tours.
            </p>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Redirecting to login page in a few seconds...
              </p>
              <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 animate-[progress_5s_linear]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block flex-1 bg-cover bg-center" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')"
      }}>
        <div className="h-full w-full bg-black bg-opacity-40 flex items-center justify-center p-16">
          <div className="text-white">
            <h2 className="text-4xl font-bold mb-4">Welcome to Olosuashi Tours</h2>
            <p className="text-lg">Your journey begins here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationSuccess;