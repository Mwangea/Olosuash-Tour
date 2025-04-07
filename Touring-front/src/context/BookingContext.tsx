/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useState, ReactNode } from 'react';
import { BookingData, } from '../api/bookingApi';

interface BookingContextType {
  currentBooking: BookingData | null;
  setCurrentBooking: (booking: BookingData | null) => void;
  bookingSuccess: boolean;
  setBookingSuccess: (success: boolean) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [currentBooking, setCurrentBooking] = useState<BookingData | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  return (
    <BookingContext.Provider 
      value={{ 
        currentBooking, 
        setCurrentBooking,
        bookingSuccess,
        setBookingSuccess
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};