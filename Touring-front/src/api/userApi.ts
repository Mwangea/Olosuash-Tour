import { ApiResponse } from "./authApi";
import api from "./axios";

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  profile_picture: string | null;
  phone_number: string | null;
  role: string;
  is_verified: number;
  created_at: string;
  first_name: string | null;
  last_name: string | null;
  date_of_birth: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  postal_code: string | null;
  [key: string]: unknown;
}

export interface ProfileContext {
    profile: UserProfile;
    setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  }

interface ProfileResponse {
  profile: UserProfile;
}

// Define the form data interface
export interface ProfileFormData {
    username: string;
    email: string;
    phone_number: string;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    address: string;
    city: string;
    country: string;
    postal_code: string;
    [key: string]: string; // Add index signature for dynamic access
  }

export interface ProfileUpdateData {
  username?: string;
  email?: string;
  phone_number?: string;
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
  address?: string;
  city?: string;
  country?: string;
  postal_code?: string;
}

export const userApi = {
  async getProfile(): Promise<UserProfile> {
    const response = await api.get<ApiResponse<ProfileResponse>>('/users/profile');
    return response.data.data.profile;
  },
  
  async updateProfile(data: ProfileUpdateData): Promise<ApiResponse<ProfileResponse>> {
    const response = await api.patch<ApiResponse<ProfileResponse>>('/users/profile', data);
    return response.data;
  }
};