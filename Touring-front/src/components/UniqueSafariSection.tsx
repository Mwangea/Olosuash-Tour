import { FaLeaf, FaBirthdayCake, FaHeart, FaClock, FaCalendarAlt, FaArrowRight } from 'react-icons/fa';
import { GiElephant, GiLion } from 'react-icons/gi';

const UniqueSafariSection = () => {
  return (
    <div className="py-16 bg-gradient-to-b from-[#E9F5FF] to-[#F0F7F0]">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-[#2A2A2A] font-serif">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8B6B3D] to-[#5E4B2B]">
            Let's Plan Your Unique Safari
          </span>
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <p className="text-lg text-gray-700 mb-6">
              There's what we do best - create custom Kenya safari tours from your wish list - whether it's 
              adventuring out on the massive savannah, watching the sunset from your own treehouse, 
              working hands-on at a local school, or diving deep into a community project.
            </p>
            <p className="text-lg text-gray-700 mb-6">
              At Olosuashi, we do things a little differently to deliver you the best safari in Kenya. 
              Immersive. Active. Mix we said... personalized just for you.
            </p>
            <div className="flex items-center text-[#8B6B3D]">
              <FaLeaf className="text-2xl mr-3" />
              <p className="text-lg font-medium">
                We maintain eco-friendly practices with everything we do, protecting Kenya's fragile environment.
              </p>
            </div>
          </div>
          <div className="relative h-96 rounded-xl overflow-hidden shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
              alt="Safari experience"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <GiElephant className="text-4xl mb-2" />
              <h3 className="text-2xl font-bold mb-2">Because there is only one Africa</h3>
              <p className="text-lg">And it is our home</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Guide Card */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-4">
              <GiLion className="text-3xl text-[#8B6B3D] mr-3" />
              <h3 className="text-xl font-bold text-gray-800">Our Guides for African Safaris</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Any African Safari is only as good as the people that give it life. Our guides bring years of 
              experience and their excitement will remind you of your best friend.
            </p>
            <button className="text-[#8B6B3D] font-medium flex items-center">
              Learn More <FaArrowRight className="ml-2" />
            </button>
          </div>

          {/* Celebration Card */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-4">
              <div className="flex">
                <FaBirthdayCake className="text-2xl text-[#8B6B3D] mr-3" />
                <FaHeart className="text-2xl text-[#8B6B3D]" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 ml-2">Celebrate Special Moments</h3>
            </div>
            <p className="text-gray-600 mb-4">
              How do you see yourself celebrating that special life event? Starting on a peak overlooking 
              the vast lands of the Great Migration or perhaps hot-air ballooning over the Masai Mara.
            </p>
            <button className="text-[#8B6B3D] font-medium flex items-center">
              Create Your Celebration <FaArrowRight className="ml-2" />
            </button>
          </div>

          {/* Flexible Tours Card */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-4">
              <div className="flex">
                <FaClock className="text-2xl text-[#8B6B3D] mr-3" />
                <FaCalendarAlt className="text-2xl text-[#8B6B3D]" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 ml-2">Easy & Flexible Safaris</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Want a safari in Kenya where you travel at your pace, on your time? Whether you book months 
              in advance or the day before, we'll make it happen.
            </p>
            <button className="text-[#8B6B3D] font-medium flex items-center">
              Start Planning <FaArrowRight className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniqueSafariSection;