import api from "./axios";

export interface Booking {
  id: string;
  tour_id: string;
  tour_title: string;
  travel_date: string;
  number_of_travelers: number;
  total_price: number;
  phone: string; // Changed from optional to required
  status: "pending" | "approved" | "cancelled";
  payment_method: string;
  special_requests?: string;
  status_history?: {
    status: string;
    notes: string;
    created_at: string;
  }[];
  created_at: string;
  user_id: string;
  payment_status: string;
  tour_duration: number;
  user_name: string;
  user_email: string;
  whatsapp_url?: string; // Add this
  admin_notes?: string; // Add this
}

export interface BookingData {
  tour_id: string;
  travel_date: string;
  number_of_travelers: number;
  payment_method: 'online' | 'whatsapp' | 'call'; 
  special_requests?: string;
  whatsapp_number?: string;
  phone?: string;
}

export const BookingApi = {
  async createBooking(bookingData: BookingData): Promise<Booking> {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  async getBooking(id: string): Promise<Booking> {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  async getMyBookings(): Promise<Booking[]> {
    const response = await api.get('/bookings/my-bookings');
    return response.data.data?.bookings || []; 
  },

  async cancelBooking(id: string): Promise<void> {
    await api.delete(`/bookings/${id}`);
  },
};