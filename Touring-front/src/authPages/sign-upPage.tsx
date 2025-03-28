import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../api/axios';
import { AxiosError } from 'axios';

// Enhanced Password Validation Function
const isValidPassword = (password: string): { 
  isValid: boolean; 
  errors: string[] 
} => {
  const errors: string[] = [];

  // Check if password exists and is a string
  if (!password || typeof password !== 'string') {
    errors.push('Password is required');
    return { isValid: false, errors };
  }

  // Length validation
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  // Uppercase letter validation
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one capital letter');
  }

  // Number validation
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  // Return validation result
  return {
    isValid: errors.length === 0,
    errors
  };
};

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Validate username
    if (!formData.username.trim()) {
      setErrors(prev => ({ ...prev, username: 'Username is required' }));
      setIsLoading(false);
      return;
    }

    // Validate email
    if (!formData.email.trim()) {
      setErrors(prev => ({ ...prev, email: 'Email is required' }));
      setIsLoading(false);
      return;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email' }));
      setIsLoading(false);
      return;
    }

    // Enhanced password validation
    const passwordValidation = isValidPassword(formData.password);
    if (!passwordValidation.isValid) {
      setErrors(prev => ({ 
        ...prev, 
        password: passwordValidation.errors.join('. ') 
      }));
      setIsLoading(false);
      return;
    }

    try {
      await api.post('/auth/signup', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      toast.success('Registration successful! Please check your email to verify your account.');
      
      navigate('/signin', { 
        state: { 
          message: 'Please check your email to verify your account before logging in.' 
        } 
      });
    } catch (error) {
      //console.error('Registration error:', error);
      
      if (error instanceof AxiosError) {
        const backendMessage = error.response?.data?.message;
        
      //  console.log('Complete error response:', {
      //    status: error.response?.status,
      //    data: error.response?.data,
      //    headers: error.response?.headers
      //  });
        
        const displayMessage = backendMessage || 
                             error.message || 
                             'Registration failed. Please try again.';
        
        toast.error(displayMessage);
        
        if (backendMessage) {
          if (backendMessage.toLowerCase().includes('email')) {
            setErrors(prev => ({ ...prev, email: backendMessage }));
          } else if (backendMessage.toLowerCase().includes('username')) {
            setErrors(prev => ({ ...prev, username: backendMessage }));
          }
        }
      } else {
        toast.error('Network error. Please check your connection and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0E6D2] via-[#E6D2BA] to-[#D2C1A5] flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* Left Side - Form */}
        <div className="flex items-center justify-center p-6 md:p-10 lg:p-12">
          <div className="w-full max-w-md">
            <div className="flex items-center gap-2 mb-6">
            <img src="/title-logo.png" alt="Logo" className="w-12 h-12" />

              <h1 className="text-2xl font-bold text-gray-900">Olosuashi Tours</h1>
            </div>
            
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-5">Create your account</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  title='username'
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 rounded-lg border ${errors.username ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-[#8B4513] focus:border-transparent`}
                  disabled={isLoading}
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  title='email'
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-[#8B4513] focus:border-transparent`}
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    title='password'
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-[#8B4513] focus:border-transparent`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="terms"
                  className="h-4 w-4 text-[#8B4513] focus:ring-[#8B4513] border-gray-300 rounded"
                  required
                  disabled={isLoading}
                />
                <label htmlFor="terms" className="ml-2 text-xs sm:text-sm text-gray-600">
                  I agree to the{' '}
                  <a href="#" className="text-[#8B4513] hover:text-[#A0522D]">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-[#8B4513] hover:text-[#A0522D]">
                    Privacy Policy
                  </a>
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-[#8B4513] text-white py-2 px-4 rounded-lg hover:bg-[#A0522D] transition duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={18} />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            <p className="mt-4 text-center text-xs sm:text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/signin" className="text-[#8B4513] hover:text-[#A0522D] font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side - Image */}
        <div 
          className="hidden lg:block bg-cover bg-center relative"
          style={{ backgroundImage: "url('/giraffe.avif')" }}
        >
          <div className="absolute inset-0   bg-black flex items-center justify-center p-8" style={{ opacity: 0.6 }}>
            <div className="text-white text-center">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">Join Our Adventure Community</h2>
              <p className="text-sm md:text-base">Start your journey to explore amazing destinations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;