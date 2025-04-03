export interface Booking {
    id: string;
    tour_id: string;
    tour_title: string;
    travel_date: string;
    number_of_travelers: number;
    total_price: number;
    status: 'pending' | 'approved' | 'cancelled';
    payment_method: string;
    special_requests?: string;
    status_history?: {
      status: string;
      notes: string;
      created_at: string;
    }[];
    created_at: string;
  }