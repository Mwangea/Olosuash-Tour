import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { GiLion, GiElephant, GiMountainRoad, GiIsland } from "react-icons/gi";

const TourCategories = () => {
  const categories = [
    {
      name: "Wildlife Safaris",
      icon: <GiLion className="text-3xl" />,
      description: "Track the Big Five through Kenya's legendary national parks",
      link: "/tours?type=wildlife",
      accent: "bg-[#8B6B3D]"
    },
    {
      name: "Adventure Tours",
      icon: <GiMountainRoad className="text-3xl" />,
      description: "Hiking, biking and adrenaline-packed wilderness experiences",
      link: "/tours?type=adventure",
      accent: "bg-[#3A5A78]"
    },
    {
      name: "Cultural Journeys",
      icon: <GiElephant className="text-3xl" />,
      description: "Authentic interactions with Kenya's diverse communities",
      link: "/tours?type=cultural",
      accent: "bg-[#7D5C3E]"
    },
    {
      name: "Coastal Retreats",
      icon: <GiIsland className="text-3xl" />,
      description: "Pristine beaches and island escapes along the Indian Ocean",
      link: "/tours?type=beach",
      accent: "bg-[#2C5E73]"
    }
  ];

  return (
    <div className="py-16 bg-gray-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-40 h-40 rounded-full bg-[#8B6B3D]/10"></div>
        <div className="absolute bottom-1/3 -right-20 w-60 h-60 rounded-full bg-[#3A5A78]/10"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-4xl font-bold text-center mb-4 text-gray-800 font-serif">
          <span className="relative inline-block">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8B6B3D] to-[#5E4B2B]">
              Your Safari Awaits
            </span>
           
          </span>
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Choose your ideal Kenyan experience from our curated collection
        </p>
        
        {/* Interactive panel design */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((category, index) => (
              <Link 
                to={category.link} 
                key={index}
                className="group relative overflow-hidden rounded-xl p-8 transition-all duration-500 hover:shadow-lg"
              >
                {/* Accent bar */}
                <div className={`absolute top-0 left-0 w-2 h-full ${category.accent} transition-all duration-500 group-hover:w-3`}></div>
                
                <div className="pl-10">
                  <div className="flex items-start space-x-6">
                    <div className={`p-4 rounded-lg ${category.accent} text-white transition-all duration-500 group-hover:rotate-6`}>
                      {category.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{category.name}</h3>
                      <p className="text-gray-600 mb-4">{category.description}</p>
                      <div className="flex items-center text-[#8B6B3D] font-medium group-hover:underline">
                        <span>Discover options</span>
                        <FaArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <Link 
            to="/experience" 
            className="inline-flex items-center px-6 py-3 border-2 border-[#8B6B3D] text-[#8B6B3D] hover:bg-[#8B6B3D] hover:text-white rounded-lg font-medium transition duration-300 group"
          >
            <span>Explore All Safari Experiences</span>
            <FaArrowRight className="ml-3 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TourCategories;