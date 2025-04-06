export interface Tour {
  id: string;
  title: string;
  slug: string;
  description: string;
  summary: string;
  duration: number;
  maxGroupSize: number;
  minGroupSize: number;
  difficulty: string;
  price: string;
  price_per_guest: string;
  discount_price: string | null;
  rating: string;
  rating_quantity: number;
  featured: number;
  accommodationDetails: string;
  ratingQuantity?: number;
  created_at: string;
  updated_at: string;
  cover_image: string;
  images: {
    id: string;
    image_path: string;
    is_cover: boolean;
  }[];
  regions: {
    id: string;
    name: string;
  }[];
  vehicles: {
    id: string;
    vehicleType: string;
    vehicleTypeId: string;
    capacity: number;
    isPrimary: boolean;
  }[];
  itinerary: {
    id: string;
    day: number;
    title: string;
    description: string;
  }[];
  locations: {
    id: string;
    name: string;
    description: string | null;
    latitude: number;
    longitude: number;
    day: number | null;
  }[];
  includedServices: {
    id: string;
    name: string;
    description: string;
    details: string | null;
  }[];
  excludedServices: {
    id: string;
    name: string;
    description: string;
    details: string | null;
  }[];
  availability: {
    id: string;
    startDate: string;
    endDate: string;
    availableSpots: number;
  }[];
  reviews: {
    id: string;
    rating: number;
    review: string;
    createdAt: string;
    userId: string;
    username: string;
    profilePicture: string;
  }[];
  totalPrice?: number;
  priceDisplay?: string;
  discountPriceDisplay?: string | null;
  calculatedForGroupSize?: number;
}

  export interface ApiResponse {
    status: string;
    pagination: {
      total: number;
      totalPages: number;
      currentPage: number;
      limit: number;
    };
    data: {
      tours: Tour[];
    };
  }

  export interface ApiError {
    response?: {
      data?: {
        message?: string;
      };
    };
    message?: string;
  }

 export interface TourStats {
    total_tours: number;
    average_price: number;
    min_price: number;
    max_price: number;
    total_reviews: number;
    average_rating: number;
    featured_tours: number;
    total_reviews_all: number;
  }

  export interface Region {
    id: string;
    name: string;
  }

  export interface VehicleType {
    id: string;
    name: string;
  }

  export  interface ServiceCategory {
    id: string;
    name: string;
    services: {
      id: string;
      name: string;
      description: string;
    }[];
  }

  export interface TourFormData {
    title: string;
    description: string;
    summary: string;
    duration: number;
    maxGroupSize: number;
    minGroupSize: number;
    difficulty: 'easy' | 'medium' | 'difficult';
    price: number;
    discount_price: number | null;
    featured: boolean;
    accommodation_details: string;
    regions: string[];
    vehicles: {
      vehicleTypeId: string;
      capacity: number;
      isPrimary: boolean;
    }[];
    itinerary: {
      day: number;
      title: string;
      description: string;
    }[];
    locations: {
      name: string;
      description: string;
      latitude: number;
      longitude: number;
      day: number | null;
    }[];
    included_services: {
      serviceId: string;
      details?: string;
    }[];
    excluded_services: {
      serviceId: string;
      details?: string;
    }[];
    availability: {
      start_date: string;
      end_date: string;
      available_spots: number;
    }[];
    images: {
      id?: string;
      image_path: string;
      is_cover: boolean;
      file?: File;
    }[];
  }