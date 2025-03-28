import { api } from './axios';
import { User } from './authApi';

export interface HeroSlide {
    id?: number;
    title: string;
    description: string;
    image_path?: string;
    is_active: boolean;
    display_order: number;
  }

  
export const adminApi = {
  async getAdminProfile(): Promise<{ profile: User }> {
    const response = await api.get('/admin/profile');
    return response.data.data;
  },

  async updateAdminProfile(data: FormData): Promise<{ profile: User }> {
    const response = await api.patch('/admin/profile', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.data;
  },

  async getAllHeroSlides(): Promise<HeroSlide[]> {
    try {
      const response = await api.get('/hero');
      return response.data.data.slides || [];
    } catch (error) {
      console.error('Failed to fetch hero slides:', error);
      throw error;
    }
  },

  async createHeroSlide(data: FormData): Promise<HeroSlide> {
    try {
      const response = await api.post('/hero', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data.data.slide;
    } catch (error) {
      console.error('Failed to create hero slide:', error);
      throw error;
    }
  },

  async updateHeroSlide(id: number, data: FormData): Promise<HeroSlide> {
    try {
      const response = await api.patch(`/hero/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data.data.slide;
    } catch (error) {
      console.error('Failed to update hero slide:', error);
      throw error;
    }
  },

  async deleteHeroSlide(id: number): Promise<void> {
    try {
      await api.delete(`/hero/${id}`);
    } catch (error) {
      console.error('Failed to delete hero slide:', error);
      throw error;
    }
  }


};

export default adminApi;