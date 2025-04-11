/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { BookingApi } from '../api/bookingApi';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { FaPhone, FaWhatsapp } from 'react-icons/fa';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  tourId: string;
  tourTitle: string;
  pricePerPerson: number;
  tourDuration: number;
}

export const BookingModal = ({ 
  isOpen, 
  onClose, 
  tourId, 
  tourTitle,
  pricePerPerson,
  tourDuration
}: BookingModalProps) => {
  const [date, setDate] = useState('');
  const [travelers, setTravelers] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'whatsapp' | 'call'>('whatsapp');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const { setBookingSuccess } = useBooking();
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setDate('');
      setTravelers(1);
      setPaymentMethod('whatsapp');
      setWhatsappNumber(user?.phone || '');
      setSpecialRequests('');
      setError('');
    }
  }, [isOpen, user]);

  const validateWhatsAppNumber = (number: string): boolean => {
    return /^\+?[1-9]\d{7,14}$/.test(number);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (paymentMethod === 'online') {
      setPaymentMethod('whatsapp');
      setError('Online payment is coming soon. Please use WhatsApp payment instead.');
      setIsSubmitting(false);
      return;
    }

    if (paymentMethod === 'whatsapp' && !validateWhatsAppNumber(whatsappNumber)) {
      setError('Please enter a valid WhatsApp number with country code (e.g., +254712345678)');
      setIsSubmitting(false);
      return;
    }

    try {
      const bookingData = {
        tour_id: tourId,
        travel_date: date,
        number_of_travelers: travelers,
        payment_method: paymentMethod,
        special_requests: specialRequests,
        whatsapp_number: paymentMethod === 'whatsapp' ? whatsappNumber : undefined,
        user_id: user?.id,
        phone: user?.phone || whatsappNumber,
        total_price: pricePerPerson * travelers,
        tour_title: tourTitle,
        tour_duration: tourDuration
      };

      // For call payment method, just create the booking without payment processing
      if (paymentMethod === 'call') {
        await BookingApi.createBooking(bookingData);
        setBookingSuccess(true);
        toast.success(
          <div>
            <p>Booking inquiry created successfully!</p>
            <p className="mt-2 text-sm">
              Please call us at <a href="tel:0708414577" className="text-blue-600 underline">0708414577</a> to complete your booking.
            </p>
          </div>,
          { duration: 10000 }
        );
        navigate('/booking-success');
        onClose();
        return;
      }

      const booking = await BookingApi.createBooking(bookingData);
      
      setBookingSuccess(true);
      
      if (paymentMethod === 'whatsapp' && booking.whatsapp_url) {
        window.open(booking.whatsapp_url, '_blank');
        
        toast.success(
          <div>
            <p>Booking created successfully!</p>
            <p className="mt-2 text-sm">
              WhatsApp payment window opened. If it didn't open, 
              <a 
                href={booking.whatsapp_url} 
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 text-blue-600 underline"
              >
                click here
              </a>
            </p>
          </div>,
          { duration: 10000 }
        );
      } else {
        toast.success('Booking created successfully!');
      }

      navigate('/booking-success');
      onClose();
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to create booking. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const totalPrice = pricePerPerson * travelers;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-lg bg-white p-6 max-h-[80vh] overflow-y-auto">
          <Dialog.Title className="text-xl font-bold text-gray-800 mb-4">
            Book {tourTitle}
          </Dialog.Title>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Travel Date
                </label>
                <input
                title='date'
                  type="date"
                  min={today}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Travelers
                </label>
                <input
                title='number'
                  type="number"
                  min="1"
                  max="20"
                  value={travelers}
                  onChange={(e) => setTravelers(Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="online"
                      name="paymentMethod"
                      value="online"
                      checked={paymentMethod === 'online'}
                      onChange={() => setPaymentMethod('online')}
                      className="mr-2"
                    />
                    <label htmlFor="online">
                      Pay Online 
                      <span className="ml-2 text-xs text-[#8B6B3D] font-medium bg-[#f8f4eb] px-2 py-0.5 rounded">
                        Coming Soon
                      </span>
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="whatsapp"
                      name="paymentMethod"
                      value="whatsapp"
                      checked={paymentMethod === 'whatsapp'}
                      onChange={() => setPaymentMethod('whatsapp')}
                      className="mr-2"
                    />
                    <label htmlFor="whatsapp" className="flex items-center">
                      <FaWhatsapp className="mr-2 text-green-500" /> Pay via WhatsApp
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="call"
                      name="paymentMethod"
                      value="call"
                      checked={paymentMethod === 'call'}
                      onChange={() => setPaymentMethod('call')}
                      className="mr-2"
                    />
                    <label htmlFor="call" className="flex items-center">
                      <FaPhone className="mr-2 text-blue-500" /> Call to Book
                    </label>
                  </div>
                </div>
                {paymentMethod === 'online' && (
                  <div className="mt-2 p-2 bg-yellow-50 text-yellow-700 text-sm rounded-md">
                    Online payment is coming soon. Please use WhatsApp payment for now or call to book.
                  </div>
                )}
                {paymentMethod === 'call' && (
                  <div className="mt-2 p-2 bg-blue-50 text-blue-700 text-sm rounded-md">
                    We'll create your booking inquiry and you can call us at <a href="tel:0708414577" className="font-medium underline">0708414577</a> to complete payment.
                  </div>
                )}
              </div>

              {paymentMethod === 'whatsapp' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    WhatsApp Number
                    <span className="text-xs text-gray-500 ml-1">
                      (Include country code, e.g., +254712345678)
                    </span>
                  </label>
                  <input
                    type="tel"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required={paymentMethod === 'whatsapp'}
                    placeholder="+254708414577"
                    pattern="^\+[1-9]\d{7,14}$"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Special Requests (Optional)
                </label>
                <textarea
                title='request'
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows={3}
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Price per person:</span>
                  <span className="font-medium">${pricePerPerson.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Travelers:</span>
                  <span className="font-medium">{travelers}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{tourDuration} days</span>
                </div>
                <div className="border-t border-gray-200 my-2"></div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md">
                  {error}
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#8B6B3D] text-white rounded-md hover:bg-[#6B4F2D] disabled:opacity-50"
                  disabled={isSubmitting || !date}
                >
                  {isSubmitting ? 'Processing...' : 'Confirm Booking'}
                </button>
              </div>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};