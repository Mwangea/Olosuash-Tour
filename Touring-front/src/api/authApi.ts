
import { api } from './axios';
import axios from 'axios';


export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  profile_picture?: string | null;
  auth_provider: string;
  is_verified: boolean;
}

export interface AuthTokens {
  token: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData {
  username: string;
  email: string;
  password: string;
}

export interface ResetPasswordData {
  password: string;
  passwordConfirm: string;
}

export interface ApiResponse<T> {
  status: 'success' | 'fail';
  message?: string;
  data: T;
}

export interface EmailVerificationResponse {
  verified: boolean;
  redirectUrl: string;
}

export const authApi = {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);
    return response.data.data;
  },

  async signup(data: SignupData): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/signup', data);
    return response.data.data;
  },

  async verifyEmail(token: string): Promise<ApiResponse<EmailVerificationResponse>> {
    try {
      const response = await api.get<ApiResponse<EmailVerificationResponse>>(
        `/auth/verify-email/${token}`,
        { headers: { 'Accept': 'application/json' } }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      }
      throw error;
    }
  },

  async forgotPassword(email: string): Promise<ApiResponse<null>> {
    const response = await api.post<ApiResponse<null>>('/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword(token: string, data: ResetPasswordData): Promise<ApiResponse<null>> {
    try {
      const response = await api.post<ApiResponse<null>>(
        `/auth/reset-password/${token}`,
        data,
        { headers: { 'Content-Type': 'application/json' } }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Reset password API error:', error.message);
      }
      throw error;
    }
  },
};