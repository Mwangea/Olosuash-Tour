import { useState, useEffect } from "react";
import { FaUser, FaCalendarAlt, FaPhone, FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Add this import
import api from "../api/axios";
import toast from "react-hot-toast";

interface BookingExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  experienceId: string;
  experienceTitle: string;
  pricePerPerson: number;
  experienceDuration: number;
}

const BookingExperienceModal = ({
  isOpen,
  onClose,
  experienceId,
  experienceTitle,
  pricePerPerson,
}: BookingExperienceModalProps) => {
  const navigate = useNavigate(); // Initialize the navigate function
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    booking_date: "",
    number_of_guests: 1,
    special_requests: "",
  });
  const [loading, setLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(pricePerPerson);

  // Calculate total price when number of guests changes
  useEffect(() => {
    setTotalPrice(pricePerPerson * formData.number_of_guests);
  }, [formData.number_of_guests, pricePerPerson]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseInt(value) || 1,
    });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      booking_date: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create booking payload according to your backend requirements
      const bookingData = {
        experience_id: experienceId,
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        booking_date: formData.booking_date,
        number_of_guests: formData.number_of_guests,
        total_price: totalPrice,
        special_requests: formData.special_requests,
      };
      
      // Make API call to your booking endpoint
      const response = await api.post("/experiences/bookings", bookingData);

      // Show success message
      toast.success("Booking submitted successfully! You'll receive a confirmation email shortly.");

      // Close modal and reset form
      onClose();
      setFormData({
        full_name: "",
        email: "",
        phone: "",
        booking_date: "",
        number_of_guests: 1,
        special_requests: "",
      });

      // Redirect to success page with booking data
      navigate("/booking-experience-success", {
        state: {
          bookingData: response.data, // assuming your API returns the booking data
          experienceTitle,
          pricePerPerson,
          totalPrice,
        },
      });
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Failed to submit booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Calculate minimum booking date (today + 1 day)
  const today = new Date();
  const minDate = new Date(today.setDate(today.getDate() + 1)).toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-[#8B6B3D]">Book {experienceTitle}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
          </div>

          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span>Price per person:</span>
              <span className="font-medium">${pricePerPerson.toLocaleString()}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Number of guests:</span>
              <span className="font-medium">{formData.number_of_guests}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span className="text-[#8B6B3D]">${totalPrice.toLocaleString()}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Full Name */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="full_name"
                  placeholder="Full Name"
                  className="pl-10 w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#8B6B3D] focus:border-[#8B6B3D]"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Email */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  className="pl-10 w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#8B6B3D] focus:border-[#8B6B3D]"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Phone */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaPhone className="text-gray-400" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  className="pl-10 w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#8B6B3D] focus:border-[#8B6B3D]"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Booking Date */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className="text-gray-400" />
                </div>
                <input
                title="date"
                  type="date"
                  name="booking_date"
                  min={minDate}
                  className="pl-10 w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#8B6B3D] focus:border-[#8B6B3D]"
                  value={formData.booking_date}
                  onChange={handleDateChange}
                  required
                />
              </div>

              {/* Number of Guests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Guests
                </label>
                <input
                title="number"
                  type="number"
                  name="number_of_guests"
                  min="1"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#8B6B3D] focus:border-[#8B6B3D]"
                  value={formData.number_of_guests}
                  onChange={handleNumberChange}
                  required
                />
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Special Requests (Optional)
                </label>
                <textarea
                title="special"
                  name="special_requests"
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#8B6B3D] focus:border-[#8B6B3D]"
                  value={formData.special_requests}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-[#8B6B3D] hover:bg-[#6B4F2D] text-white py-3 px-6 rounded-lg transition duration-300 font-medium ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Processing..." : "Confirm Booking"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingExperienceModal;