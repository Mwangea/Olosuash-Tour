import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi } from '../api/authApi';
 // Adjust the import path as needed

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Call the forgotPassword API method
      const response = await authApi.forgotPassword(email);
      
      // If successful, show success message and mark as submitted
      setIsSubmitted(true);
      toast.success(response.message || 'Reset instructions sent to your email!');
    } catch (error) {
      // Handle any errors from the API
      const errorMessage = error instanceof Error ? error.message : 
                           'Failed to send reset instructions. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0E6D2] via-[#E6D2BA] to-[#D2C1A5] flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* Left Side - Form */}
        <div className="flex items-center justify-center p-6 md:p-10 lg:p-12">
          <div className="w-full max-w-md">
            <Link to="/signin" className="flex items-center gap-2 text-gray-600 mb-6 hover:text-[#8B4513] text-xs sm:text-sm">
              <ArrowLeft size={16} />
              <span>Back to login</span>
            </Link>

            <div className="flex items-center gap-2 mb-6">
              <img src="/title-logo.png" alt="Logo" className="w-12 h-12" />
              <h1 className="text-2xl font-bold text-gray-900">Olosuashi Tours</h1>
            </div>

            {!isSubmitted ? (
              <>
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3">Forgot your password?</h2>
                <p className="text-gray-600 mb-5 text-sm">
                  Enter your email address and we'll send you instructions to reset your password.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#8B4513] focus:border-transparent"
                      placeholder="Enter your email"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#8B4513] text-white py-2 px-4 rounded-lg hover:bg-[#A0522D] transition duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="animate-spin mr-2" size={18} />
                        Sending instructions...
                      </>
                    ) : (
                      'Send Reset Instructions'
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center">
                <div className="bg-green-50 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3">Check your email</h2>
                <p className="text-gray-600 mb-5 text-sm">
                  We've sent password reset instructions to:<br />
                  <span className="font-medium">{email}</span>
                </p>
                <Link
                  to="/signin"
                  className="text-[#8B4513] hover:text-[#A0522D] font-medium text-sm"
                >
                  Back to login
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Image */}
        <div 
          className="hidden lg:block bg-cover bg-center relative"
          style={{ backgroundImage: "url('/tiger.jpg')" }}
        >
          <div className="absolute inset-0 bg-black flex items-center justify-center p-8" style={{ opacity: 0.5 }}>
            <div className="text-white text-center">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">Don't Worry</h2>
              <p className="text-sm md:text-base">We'll help you get back to exploring amazing destinations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;