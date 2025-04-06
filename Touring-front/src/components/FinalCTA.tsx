import { Link } from "react-router-dom";

const FinalCTA = () => {
  return (
    <div className="py-20 bg-[#8B6B3D] text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-6 font-serif">Ready for Your Kenyan Adventure?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Contact our safari experts today to start planning your dream vacation
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <Link 
            to="/contact" 
            className="bg-white text-[#8B6B3D] hover:bg-gray-100 px-8 py-4 rounded-lg font-medium transition duration-300 text-lg"
          >
            Get in Touch
          </Link>
          <Link 
            to="/tours" 
            className="bg-transparent border-2 border-white hover:bg-white hover:text-[#8B6B3D] px-8 py-4 rounded-lg font-medium transition duration-300 text-lg"
          >
            Browse All Tours
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FinalCTA;