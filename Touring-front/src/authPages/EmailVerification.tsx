import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import axios from 'axios';

const EmailVerification: React.FC = () => {
  const [verificationStatus, setVerificationStatus] = useState<{
    isLoading: boolean;
    isVerified: boolean;
    message: string;
    redirecting: boolean;
  }>({
    isLoading: true,
    isVerified: false,
    message: 'Verifying your email...',
    redirecting: false
  });

  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        if (!token || token === 'undefined') {
          throw new Error('Invalid verification token');
        }

        console.log('Verifying email with token:', token);
        const response = await authApi.verifyEmail(token);
        console.log('Verification response:', response);

        setVerificationStatus({
          isLoading: false,
          isVerified: response.data.verified,
          message: response.message || 
            (response.data.verified 
              ? 'Email verified successfully!' 
              : 'Email verification failed.'),
          redirecting: true
        });

        // Smooth redirect with loading indicator
        setTimeout(() => {
          if (response.data.redirectUrl) {
            window.location.href = response.data.redirectUrl;
          } else if (response.data.verified) {
            navigate('/verify-email/success', { 
              state: { message: 'Your email has been verified successfully!' } 
            });
          } else {
            navigate('/verify-email/failed');
          }
        }, 2000);

      } catch (error) {
        console.error('Verification error:', error);
        setVerificationStatus({
          isLoading: false,
          isVerified: false,
          message: axios.isAxiosError(error) 
            ? error.response?.data?.message || 'Verification failed'
            : 'Verification failed',
          redirecting: true
        });

        setTimeout(() => {
          navigate('/verify-email/failed');
        }, 2000);
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
        {/* Loading State */}
        {verificationStatus.isLoading && (
          <div className="space-y-4">
            <div className="animate-spin mb-4 mx-auto h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            <p className="text-gray-600">Verifying your email...</p>
          </div>
        )}

        {/* Redirecting State */}
        {verificationStatus.redirecting && !verificationStatus.isLoading && (
          <div className="space-y-4">
            <div className="animate-pulse mb-4 mx-auto h-12 w-12 border-4 border-blue-500 rounded-full"></div>
            <p className="text-gray-600">
              {verificationStatus.isVerified 
                ? 'Redirecting you to your account...' 
                : 'Taking you to the failure page...'}
            </p>
          </div>
        )}

        {/* Results (shown briefly before redirect) */}
        {!verificationStatus.redirecting && !verificationStatus.isLoading && (
          <>
            {verificationStatus.isVerified ? (
              <div className="text-green-600 space-y-4">
                <svg 
                  className="mx-auto h-16 w-16" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                    clipRule="evenodd" 
                  />
                </svg>
                <h2 className="text-2xl font-bold">Success!</h2>
                <p>{verificationStatus.message}</p>
              </div>
            ) : (
              <div className="text-red-600 space-y-4">
                <svg 
                  className="mx-auto h-16 w-16" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                    clipRule="evenodd" 
                  />
                </svg>
                <h2 className="text-2xl font-bold">Verification Failed</h2>
                <p>{verificationStatus.message}</p>
                <div className="mt-6 space-y-3">
                  <button 
                    onClick={() => navigate('/resend-verification')}
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                  >
                    Resend Verification Email
                  </button>
                  <button 
                    onClick={() => navigate('/signin')}
                    className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
                  >
                    Back to Login
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EmailVerification;