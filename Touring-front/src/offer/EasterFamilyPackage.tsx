import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

const EasterFamilyPackage = () => {
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
                src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Easter Family Package"
              />
            </div>
            <div className="p-8 md:w-1/2">
              <div className="uppercase tracking-wide text-sm text-[#8B6B3D] font-semibold mb-1">
                Special Offer
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2 font-serif">
                Easter Family Package
              </h2>
              <p className="mt-2 text-gray-600 mb-6">
                Special rates for families this Easter holiday. Enjoy spacious accommodations, 
                kid-friendly activities, and special Easter events for the whole family.
              </p>

              <div className="mt-6">
                <div className="text-3xl font-bold text-[#8B6B3D] mb-2">
                  From $1,200
                </div>
                <p className="text-sm text-gray-500 mb-6">
                  Price for a family of 4 (2 adults + 2 children under 12)
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
                  <span>4 days/3 nights in family suite</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#8B6B3D] mr-2">✓</span>
                  <span>Daily breakfast and Easter Sunday brunch</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#8B6B3D] mr-2">✓</span>
                  <span>2 game drives per day (shared vehicle)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#8B6B3D] mr-2">✓</span>
                  <span>Kids' Easter egg hunt and activities</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#8B6B3D] mr-2">✓</span>
                  <span>Complimentary airport transfers</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Schedule:</h4>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-[#8B6B3D] mr-2">•</span>
                  <span><strong>Day 1:</strong> Arrival, evening game drive</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#8B6B3D] mr-2">•</span>
                  <span><strong>Day 2:</strong> Morning drive, Easter activities</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#8B6B3D] mr-2">•</span>
                  <span><strong>Day 3:</strong> Full day safari experience</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#8B6B3D] mr-2">•</span>
                  <span><strong>Day 4:</strong> Departure after breakfast</span>
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
              <p className="text-gray-600 mb-4">Maasai Mara National Reserve, Kenya</p>
              <h4 className="font-semibold text-gray-800 mb-2">Accommodation:</h4>
              <p className="text-gray-600">Family tent with 1 double bed and 2 single beds</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Age Requirements:</h4>
              <p className="text-gray-600 mb-4">Children 5-12 years (special rates apply)</p>
              <h4 className="font-semibold text-gray-800 mb-2">What to Bring:</h4>
              <p className="text-gray-600">Comfortable clothing, binoculars, camera</p>
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
              <span>Valid for travel between April 1-30, 2025</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#8B6B3D] mr-2">•</span>
              <span>30% deposit required at time of booking</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#8B6B3D] mr-2">•</span>
              <span>Cancellation policy: 50% refund if cancelled 30+ days prior</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#8B6B3D] mr-2">•</span>
              <span>Prices subject to change without notice</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#8B6B3D] mr-2">•</span>
              <span>Travel insurance recommended</span>
            </li>
          </ul>
        </div>

        {/* Final CTA */}
        <div className="text-center mt-8">
          <Link
            to="/contact"
            className="bg-[#8B6B3D] hover:bg-[#6B4F2D] text-white font-medium py-3 px-8 rounded-lg transition duration-300 inline-block"
          >
            Book Your Family Easter Safari Now
          </Link>
          <p className="mt-4 text-gray-600">
            Have questions? <a href="tel:+254 708 414 577" className="text-[#8B6B3D] font-medium">Call our safari specialists</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EasterFamilyPackage;