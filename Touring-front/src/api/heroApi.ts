import api from "./axios";

export interface HeroSlide {
    id: number;
    title: string;
    description: string;
    image_path: string;
    is_active: boolean;
    display_order: number;
    created_at?: string;
    updated_at?: string;
  }

export const HeroService = {
  async getHeroSlides(): Promise<HeroSlide[]> {
    try {
      const response = await api.get('/hero');
      return response.data.data.slides;
    } catch (error) {
      console.error('Error fetching hero slides:', error);
      throw error;
    }
  },

  async getHeroSlideById(id: number): Promise<HeroSlide> {
    try {
      const response = await api.get(`/hero/${id}`);
      return response.data.data.slide;
    } catch (error) {
      console.error(`Error fetching hero slide ${id}:`, error);
      throw error;
    }
  }
};