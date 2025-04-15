import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

const EasterGroupSafari = () => {
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
                src="https://images.unsplash.com/photo-1509316785289-025f5b846b35?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Easter Group Safari"
              />
            </div>
            <div className="p-8 md:w-1/2">
              <div className="uppercase tracking-wide text-sm text-[#8B6B3D] font-semibold mb-1">
                Special Offer
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2 font-serif">
                Easter Group Safari
              </h2>
              <p className="mt-2 text-gray-600 mb-6">
                15% off for groups of 6+ people. Perfect for friends or extended 
                family looking for an adventurous Easter holiday together.
              </p>

              <div className="mt-6">
                <div className="text-3xl font-bold text-[#8B6B3D] mb-2">
                  From $800
                </div>
                <p className="text-sm text-gray-500 mb-6">
                  Per person for 3 nights (15% discount applied)
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
                  <span>3 nights in group lodge (shared rooms)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#8B6B3D] mr-2">✓</span>
                  <span>All meals included (breakfast, lunch, dinner)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#8B6B3D] mr-2">✓</span>
                  <span>2 game drives per day with private guide</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#8B6B3D] mr-2">✓</span>
                  <span>Easter Sunday bush breakfast</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#8B6B3D] mr-2">✓</span>
                  <span>Group discounts on additional activities</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Group Benefits:</h4>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-[#8B6B3D] mr-2">•</span>
                  <span>Private vehicle for your group</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#8B6B3D] mr-2">•</span>
                  <span>Dedicated safari guide</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#8B6B3D] mr-2">•</span>
                  <span>Flexible itinerary for your group</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#8B6B3D] mr-2">•</span>
                  <span>Group photo package included</span>
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
              <p className="text-gray-600 mb-4">Samburu National Reserve, Kenya</p>
              <h4 className="font-semibold text-gray-800 mb-2">Accommodation:</h4>
              <p className="text-gray-600">Shared rooms (2-4 people per room)</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Group Size:</h4>
              <p className="text-gray-600 mb-4">6-12 people for discount</p>
              <h4 className="font-semibold text-gray-800 mb-2">What to Bring:</h4>
              <p className="text-gray-600">Comfortable walking shoes, binoculars, camera</p>
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
              <span>Minimum 6 people required for discount</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#8B6B3D] mr-2">•</span>
              <span>25% deposit required to confirm booking</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#8B6B3D] mr-2">•</span>
              <span>Full payment due 30 days before travel</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#8B6B3D] mr-2">•</span>
              <span>Discount applies to base package only</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#8B6B3D] mr-2">•</span>
              <span>Single supplements available for private rooms</span>
            </li>
          </ul>
        </div>

        {/* Final CTA */}
        <div className="text-center mt-8">
          <Link
            to="/contact"
            className="bg-[#8B6B3D] hover:bg-[#6B4F2D] text-white font-medium py-3 px-8 rounded-lg transition duration-300 inline-block"
          >
            Organize Your Group Safari
          </Link>
          <p className="mt-4 text-gray-600">
            For large group inquiries, <a href="tel:+1234567890" className="text-[#8B6B3D] font-medium">call our group specialist</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EasterGroupSafari;