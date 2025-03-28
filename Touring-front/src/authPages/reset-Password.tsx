import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react';
import { authApi } from '../api/authApi';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      toast.error('Invalid reset token');
      navigate('/');
    }
  }, [token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords
    if (password !== passwordConfirm) {
      toast.error('Password confirmation does not match password');
      return;
    }

    if (!/^(?=.*[a-zA-Z])(?=.*\d).{6,}$/.test(password)) {
      toast.error('Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number');
      return;
    }
    
    setIsLoading(true);
    try {
      await authApi.resetPassword(token!, { password, passwordConfirm });
      
      setIsSubmitted(true);
      toast.success('Password reset successfully');
      
      setTimeout(() => {
        navigate('/signin');
      }, 3000);
    } catch (error: unknown) {
      console.error('Reset password error:', error);

      const errorMessage = error instanceof Error ? error.message : 
                           'Failed to reset password. Please try again.';
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
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3">Reset your password</h2>
                <p className="text-gray-600 mb-5 text-sm">
                  Enter your new password below.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#8B4513] focus:border-transparent"
                        placeholder="Enter new password"
                        required
                        disabled={isLoading}
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        disabled={isLoading}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#8B4513] focus:border-transparent"
                        placeholder="Confirm new password"
                        required
                        disabled={isLoading}
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        disabled={isLoading}
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#8B4513] text-white py-2 px-4 rounded-lg hover:bg-[#A0522D] transition duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="animate-spin mr-2" size={18} />
                        Resetting password...
                      </>
                    ) : (
                      'Reset Password'
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
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3">Password Reset Successful</h2>
                <p className="text-gray-600 mb-5 text-sm">
                  Your password has been successfully reset.
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
          style={{ backgroundImage: "url('/Maasai.jpg')" }}
        >
          <div className="absolute inset-0 bg-black flex items-center justify-center p-8" style={{ opacity: 0.6 }}>
            <div className="text-white text-center">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">Reset Your Password</h2>
              <p className="text-sm md:text-base">Secure access to your Olosuashi Tours account</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;