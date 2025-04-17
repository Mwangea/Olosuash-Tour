import { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaCheckCircle, FaEnvelope, FaPhoneAlt } from 'react-icons/fa';

export const BookingExperienceSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingData, experienceTitle, pricePerPerson, totalPrice } = location.state || {};

  useEffect(() => {
    if (!bookingData) {
      //navigate('/experiences');
    }
  }, [bookingData, navigate]);

  if (!bookingData) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F4EA] to-[#E9F5FF] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl w-full text-center">
        <div className="flex justify-center text-6xl text-green-500 mb-4">
          <FaCheckCircle />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Booking Confirmed!</h1>
        <h2 className="text-xl text-[#8B6B3D] mb-4">{experienceTitle}</h2>
        
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span>Price per person:</span>
            <span className="font-medium">${pricePerPerson.toLocaleString()}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Number of guests:</span>
            <span className="font-medium">{bookingData.number_of_guests}</span>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span>Total:</span>
            <span className="text-[#8B6B3D]">${totalPrice.toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">What's Next?</h2>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <FaEnvelope className="text-[#8B6B3D] text-lg" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-800">Check Your Email</h3>
                <p className="text-gray-600">
                  We've sent a confirmation to <span className="font-medium">{bookingData.email}</span> with all the details.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <FaPhoneAlt className="text-[#8B6B3D] text-lg" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-800">Need Help?</h3>
                <p className="text-gray-600">
                  Contact our support team at <span className="font-medium">+254 708 414 577</span> if you have any questions.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-4">
          <Link
            to="/profile/experience-bookings"
            className="px-6 py-3 bg-[#8B6B3D] text-white rounded-lg hover:bg-[#6B4F2D] transition flex-1 text-center"
          >
            View My Bookings
          </Link>
          <Link
            to="/experience"
            className="px-6 py-3 border border-[#8B6B3D] text-[#8B6B3D] rounded-lg hover:bg-gray-50 transition flex-1 text-center"
          >
            Browse More Experiences
          </Link>
        </div>
      </div>
    </div>
  );
};