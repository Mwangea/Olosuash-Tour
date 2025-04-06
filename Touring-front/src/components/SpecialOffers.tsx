import { Link } from "react-router-dom";

const SpecialOffers = () => {
  return (
    <div className="py-16 bg-[#8B6B3D] text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2 font-serif">Easter Safari Specials</h2>
          <p className="text-lg opacity-90">Limited time offers for your Easter getaway</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Offer 1 */}
          <div className="bg-white text-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="relative h-60">
              <img 
                src="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e" 
                alt="Family Safari"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                25% OFF
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">Easter Family Package</h3>
              <p className="text-gray-600 mb-4">Special rates for families this Easter holiday</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-[#8B6B3D]">From $1,200</span>
                <Link to="/offers/easter-family" className="bg-[#8B6B3D] hover:bg-[#6B4F2D] text-white px-4 py-2 rounded-lg transition duration-300">
                  Book Now
                </Link>
              </div>
            </div>
          </div>
          
          {/* Offer 2 */}
          <div className="bg-white text-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="relative h-60">
              <img 
                src="https://images.unsplash.com/photo-1506929562872-bb421503ef21" 
                alt="Couples Retreat"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                FREE NIGHT
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">Easter Couples Retreat</h3>
              <p className="text-gray-600 mb-4">Get 1 free night when you book 4 nights</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-[#8B6B3D]">From $1,500</span>
                <Link to="/offers/easter-couples" className="bg-[#8B6B3D] hover:bg-[#6B4F2D] text-white px-4 py-2 rounded-lg transition duration-300">
                  Book Now
                </Link>
              </div>
            </div>
          </div>
          
          {/* Offer 3 */}
          <div className="bg-white text-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="relative h-60">
              <img 
                src="https://images.unsplash.com/photo-1464037866556-6812c9d1c72e" 
                alt="Group Safari"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                GROUP DEAL
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">Easter Group Safari</h3>
              <p className="text-gray-600 mb-4">15% off for groups of 6+ people</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-[#8B6B3D]">From $800</span>
                <Link to="/offers/easter-group" className="bg-[#8B6B3D] hover:bg-[#6B4F2D] text-white px-4 py-2 rounded-lg transition duration-300">
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialOffers;