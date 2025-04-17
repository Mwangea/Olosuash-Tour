// src/pages/ExperienceBookingsComingSoon.tsx
import { FaCalendarAlt, FaHourglassHalf, FaEnvelope, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const ExperienceBookings = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F5F0] to-[#E6F0F9] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:shadow-xl">
        {/* Header with subtle animation */}
        <div className="bg-gradient-to-r from-[#8B6B3D] to-[#B08D57] p-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full filter blur-xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full filter blur-xl translate-x-1/2 translate-y-1/2"></div>
          </div>
          <div className="relative">
            <div className="flex justify-center mb-4 animate-pulse">
              <FaCalendarAlt className="text-white text-4xl" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-md">
              Experience Bookings Coming Soon
            </h1>
            <p className="text-white/90 mt-2">
              We're crafting an exceptional booking experience for your adventures
            </p>
          </div>
        </div>

        {/* Content with subtle entrance animation */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex items-start group">
            <div className="flex-shrink-0 mt-1 p-2 bg-[#F5EEE4] rounded-full group-hover:bg-[#8B6B3D] transition-colors duration-300">
              <FaHourglassHalf className="text-[#8B6B3D] text-xl group-hover:text-white transition-colors duration-300" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Currently Under Development
              </h2>
              <p className="text-gray-600 mt-1">
                Our team is building a seamless booking platform tailored for your adventure needs.
              </p>
            </div>
          </div>

          <div className="flex items-start group">
            <div className="flex-shrink-0 mt-1 p-2 bg-[#F5EEE4] rounded-full group-hover:bg-[#8B6B3D] transition-colors duration-300">
              <FaEnvelope className="text-[#8B6B3D] text-xl group-hover:text-white transition-colors duration-300" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Get Early Access
              </h2>
              <form className="mt-3 space-y-3 sm:space-y-0 sm:flex sm:space-x-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B6B3D]/50 focus:border-[#8B6B3D] transition"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#8B6B3D] text-white rounded-lg hover:bg-[#6B4F2D] transition flex items-center justify-center space-x-2"
                >
                  <span>Notify Me</span>
                  <FaArrowRight className="text-sm" />
                </button>
              </form>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200 mt-8">
            <p className="text-center text-gray-600">
              Explore our{" "}
              <Link
                to="/experience"
                className="text-[#8B6B3D] hover:text-[#6B4F2D] font-medium transition-colors inline-flex items-center"
              >
                experiences <FaArrowRight className="ml-1 text-sm" />
              </Link>{" "}
              or check our{" "}
              <Link
                to="/tours"
                className="text-[#8B6B3D] hover:text-[#6B4F2D] font-medium transition-colors inline-flex items-center"
              >
                available tours <FaArrowRight className="ml-1 text-sm" />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceBookings;