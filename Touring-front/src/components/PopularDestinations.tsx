import { Link } from "react-router-dom";

const PopularDestinations = () => {
  const destinations = [
    {
      name: "Masai Mara",
      image: "/wildbeest.jpg",
      description: "World-famous for the Great Migration",
      link: "/tours?destination=masai-mara"
    },
    {
      name: "Amboseli",
      image: "/amboseli.jpg",
      description: "Stunning views of Kilimanjaro",
      link: "/tours?destination=amboseli"
    },
    {
      name: "Tsavo",
      image: "/Tsavo.jpg",
      description: "Kenya's largest national park",
      link: "/tours?destination=tsavo"
    },
    {
      name: "Diani Beach",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
      description: "Pristine white sand beaches",
      link: "/tours?destination=diani"
    }
  ];

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 font-serif">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8B6B3D] to-[#5E4B2B]">
            Popular Destinations
          </span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((destination, index) => (
            <Link 
              to={destination.link} 
              key={index} 
              className="relative h-80 rounded-xl overflow-hidden group"
            >
              <img 
                src={destination.image} 
                alt={destination.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-bold mb-1">{destination.name}</h3>
                  <p className="text-sm opacity-90">{destination.description}</p>
                  <button className="mt-3 text-sm font-medium bg-[#8B6B3D] hover:bg-[#6B4F2D] text-white px-4 py-2 rounded-lg transition duration-300">
                    Explore Tours
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularDestinations;