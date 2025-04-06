import { FaAward, FaMapMarkerAlt, FaLeaf, FaHeadset } from "react-icons/fa";

const WhyChooseUs = () => {
  const features = [
    {
      title: "20+ Years Experience",
      description: "We've been creating unforgettable safaris since 2003",
      icon: <FaAward className="text-2xl" />
    },
    {
      title: "Local Experts",
      description: "Our guides are born and raised in Kenya",
      icon: <FaMapMarkerAlt className="text-2xl" />
    },
    {
      title: "Eco-Conscious",
      description: "Sustainable tourism is at our core",
      icon: <FaLeaf className="text-2xl" />
    },
    {
      title: "24/7 Support",
      description: "We're with you every step of your journey",
      icon: <FaHeadset className="text-2xl" />
    }
  ];

  return (
    <div className="py-16 bg-gradient-to-b from-[#F8F4EA] to-[#E9F5FF]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 font-serif">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8B6B3D] to-[#5E4B2B]">
            Why Choose Olosuashi Safaris?
          </span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-[#8B6B3D]/30 text-center"
            >
              <div className="text-[#8B6B3D] mb-6 flex justify-center">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;