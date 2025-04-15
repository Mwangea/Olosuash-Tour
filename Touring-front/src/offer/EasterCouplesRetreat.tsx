import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

const EasterCouplesRetreat = () => {
  return (
    <div className="py-12 bg-gradient-to-b from-[#F8F4EA] to-[#E9F5FF] min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back to Home */}
        <div className="mb-6">
          <Link 
            to="/" 
            className="flex items-center text-[#8B6B3D] hover:text-[#6B4F2D] transition"
          >
            <FiArrowLeft className="mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#8B6B3D] mb-4 font-serif">
            Easter Safari Specials
          </h1>
          <p className="text-lg text-gray-600">
            Limited time offers for your Easter getaway
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <span className="bg-[#8B6B3D]/10 text-[#8B6B3D] px-3 py-1 rounded-full text-sm font-medium">
              23x OFF
            </span>
            <span className="bg-[#8B6B3D]/10 text-[#8B6B3D] px-3 py-1 rounded-full text-sm font-medium">
              FAST NIGHT
            </span>
            <span className="bg-[#8B6B3D]/10 text-[#8B6B3D] px-3 py-1 rounded-full text-sm font-medium">
              GROUP DEAL
            </span>
          </div>
        </div>

        {/* Package Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 mb-12">
          <div className="md:flex">
            <div className="md:flex-shrink-0 md:w-1/2">
              <img
                className="h-full w-full object-cover"
                src="https://images.unsplash.com/photo-1531058020387-3be344556be6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Easter Couples Retreat"
              />
            </div>
            <div className="p-8 md:w-1/2">
              <div className="uppercase tracking-wide text-sm text-[#8B6B3D] font-semibold mb-1">
                Special Offer
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2 font-serif">
                Easter Couples Retreat
              </h2>
              <p className="mt-2 text-gray-600 mb-6">
                Get 1 free night when you book 4 nights. Romantic getaway package 
                with private dinners, spa treatments, and exclusive game drives.
              </p>

              <div className="mt-6">
                <div className="text-3xl font-bold text-[#8B6B3D] mb-2">
                  From $1,500
                </div>
                <p className="text-sm text-gray-500 mb-6">
                  Price for 5 nights (pay for 4, get 1 free)
                </p>
              </div>

              <div className="mt-8">
                <Link
                  to="/contact"
                  className="bg-[#8B6B3D] hover:bg-[#6B4F2D] text-white font-medium py-3 px-8 rounded-lg transition duration-300 inline-block w-full text-center"
                >
                  Book Now
                </Link>
                <div className="mt-4 text-center">
                  <a href="tel:+254 708 414 577" className="text-[#8B6B3D] hover:text-[#6B4F2D] font-medium">
                    Or call: +254 708 414 577
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Package Details */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h3 className="text-xl font-bold text-[#8B6B3D] mb-4 font-serif">
            Package Details
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Inclusions:</h4>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-[#8B6B3D] mr-2">✓</span>
                  <span>5 nights in luxury tented suite (pay for 4)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#8B6B3D] mr-2">✓</span>
                  <span>Daily breakfast and 3-course dinners</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#8B6B3D] mr-2">✓</span>
                  <span>Private sunset game drives</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#8B6B3D] mr-2">✓</span>
                  <span>Couples massage at our spa</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#8B6B3D] mr-2">✓</span>
                  <span>Romantic Easter dinner under the stars</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Romantic Extras:</h4>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-[#8B6B3D] mr-2">•</span>
                  <span>Private butler service</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#8B6B3D] mr-2">•</span>
                  <span>Bubble bath setup with rose petals</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#8B6B3D] mr-2">•</span>
                  <span>Complimentary champagne on arrival</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#8B6B3D] mr-2">•</span>
                  <span>Personalized safari journal</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h3 className="text-xl font-bold text-[#8B6B3D] mb-4 font-serif">
            Additional Information
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Location:</h4>
              <p className="text-gray-600 mb-4">Private conservancy near Amboseli National Park</p>
              <h4 className="font-semibold text-gray-800 mb-2">Accommodation:</h4>
              <p className="text-gray-600">Luxury tent with king bed and private deck</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Best For:</h4>
              <p className="text-gray-600 mb-4">Couples celebrating anniversaries or honeymoons</p>
              <h4 className="font-semibold text-gray-800 mb-2">What to Bring:</h4>
              <p className="text-gray-600">Smart casual wear for dinners, camera, sunscreen</p>
            </div>
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h3 className="text-xl font-bold text-[#8B6B3D] mb-4 font-serif">
            Terms & Conditions
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="text-[#8B6B3D] mr-2">•</span>
              <span>Valid for bookings made before March 15, 2025</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#8B6B3D] mr-2">•</span>
              <span>40% deposit required to secure booking</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#8B6B3D] mr-2">•</span>
              <span>Free night applies to standard luxury tents only</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#8B6B3D] mr-2">•</span>
              <span>No refunds for early departures</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#8B6B3D] mr-2">•</span>
              <span>Special requests subject to availability</span>
            </li>
          </ul>
        </div>

        {/* Final CTA */}
        <div className="text-center mt-8">
          <Link
            to="/contact"
            className="bg-[#8B6B3D] hover:bg-[#6B4F2D] text-white font-medium py-3 px-8 rounded-lg transition duration-300 inline-block"
          >
            Reserve Your Romantic Retreat
          </Link>
          <p className="mt-4 text-gray-600">
            For special requests, <a href="tel: +254 708 414 577" className="text-[#8B6B3D] font-medium">call our concierge</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EasterCouplesRetreat;