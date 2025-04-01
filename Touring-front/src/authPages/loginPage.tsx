import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi } from '../api/authApi';
import { userApi } from '../api/userApi';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            const { user, token } = await authApi.login({ email, password });
            
            // Store token and user info in localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            // Fetch complete profile including profile picture
            const completeProfile = await userApi.getProfile();
            localStorage.setItem('user', JSON.stringify(completeProfile));

            // Customize toast based on user role
            toast.success(`Welcome back, ${user.username}!`);

            // Redirect based on user role
            if (user.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/');
            }
        } catch (error: unknown) {
            let errorMessage = 'Login failed';

            if (error instanceof Error) {
                if ('response' in error && error.response) {
                    const response = error.response as { status: number; data: { message: string } };
                    const { status, data } = response;

                    switch (status) {
                        case 400:
                            errorMessage = data.message || 'Invalid login credentials';
                            break;
                        case 401:
                            errorMessage = 'Incorrect email or password';
                            break;
                        case 403:
                            if (data.message.includes('verify')) {
                                errorMessage = 'Please verify your email before logging in';
                                toast.error(errorMessage, {
                                    duration: 4000,
                                    position: 'top-right',
                                });
                            } else {
                                errorMessage = 'Access denied';
                            }
                            break;
                        case 429:
                            errorMessage = 'Too many login attempts. Please try again later.';
                            break;
                        case 500:
                            errorMessage = 'Server error. Please try again later.';
                            break;
                        default:
                            errorMessage = data.message || 'An unexpected error occurred';
                    }
                } else if (error.message) {
                    errorMessage = error.message;
                }
            } else if (typeof error === 'object' && error !== null && 'request' in error) {
                errorMessage = 'No response from server. Please check your connection.';
            }

            toast.error(errorMessage, {
                duration: 3000,
                position: 'top-right',
            });
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
                        <div className="flex items-center gap-2 mb-6">
                            <img src="/title-logo.png" alt="Logo" className="w-12 h-12" />
                            <h1 className="text-2xl font-bold text-gray-900">Olosuashi Tours</h1>
                        </div>
                        
                        <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-5">Welcome back</h2>
                        
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

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#8B4513] focus:border-transparent"
                                        placeholder="Enter your password"
                                        required
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
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="remember"
                                        className="h-4 w-4 text-[#8B4513] focus:ring-[#8B4513] border-gray-300 rounded"
                                        disabled={isLoading}
                                    />
                                    <label htmlFor="remember" className="ml-2 text-xs sm:text-sm text-gray-600">
                                        Remember me
                                    </label>
                                </div>
                                <Link
                                    to="/forgot-password"
                                    className="text-xs sm:text-sm text-[#8B4513] hover:text-[#A0522D]"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-[#8B4513] text-white py-2 px-4 rounded-lg hover:bg-[#A0522D] transition duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin mr-2" size={18} />
                                        Signing in...
                                    </>
                                ) : (
                                    'Sign in'
                                )}
                            </button>
                        </form>

                        <p className="mt-4 text-center text-xs sm:text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-[#8B4513] hover:text-[#A0522D] font-medium">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Right Side - Image */}
                <div 
                    className="hidden lg:block bg-cover bg-center relative"
                    style={{ backgroundImage: "url('/zebra.jpg')" }}
                >
                    <div className="absolute inset-0 bg-black flex items-center justify-center p-8" style={{ opacity: 0.7 }} >
                        <div className="text-white text-center">
                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">Zebras Quenching Their Thirst in Amboseli</h2>
                            <p className="text-sm md:text-base"> Watch herds of zebras gather at watering holes, enjoying a moment of peace with the breathtaking backdrop of Mount Kilimanjaro.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;