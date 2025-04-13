import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FaStar, FaRegStar, FaSearch, FaFilter } from "react-icons/fa";
import api from "../api/axios";
import  BookingExperienceModal  from "../components/BookingExperienceModal";
import { motion } from 'framer-motion';


interface Experience {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  price: number;
  discount_price?: number;
  duration: number;
  difficulty: string;
  rating?: number;
  rating_quantity?: number;
  cover_image: string;
  category_name: string;
  min_group_size: number;
  max_group_size?: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  image_path: string;
}

const ExperiencePage = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedExperience, setSelectedExperience] = useState<{
    id: string;
    title: string;
    price: number;
    duration: number;
  } | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  

  // Fetch experiences and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get all categories first
        const categoriesRes = await api.get('/experiences/categories');
        setCategories(categoriesRes.data.data.categories || []);

        // Get experiences with filters
        const categoryId = searchParams.get('category_id');
        const page = searchParams.get('page') || '1';
        const search = searchParams.get('search') || '';

        const experiencesRes = await api.get(
          `/experiences?page=${page}&limit=9${
            categoryId ? `&category_id=${categoryId}` : ''
          }${search ? `&search=${search}` : ''}`
        );

        setExperiences(experiencesRes.data.data.experiences || []);
      } catch (err) {
        setError("Failed to load experiences. Please try again later.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

  const handleBookNow = (experience: Experience) => {
    setSelectedExperience({
      id: experience.id,
      title: experience.title,
      price: experience.discount_price || experience.price,
      duration: experience.duration,
    });
    setIsBookingModalOpen(true);
  };

  const handleCategoryClick = (categoryId: string | null) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (categoryId) {
      newSearchParams.set('category_id', categoryId);
    } else {
      newSearchParams.delete('category_id');
    }
    newSearchParams.set('page', '1');
    setSearchParams(newSearchParams);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const newSearchParams = new URLSearchParams(searchParams);
    if (searchTerm) {
      newSearchParams.set('search', searchTerm);
    } else {
      newSearchParams.delete('search');
    }
    newSearchParams.set('page', '1');
    setSearchParams(newSearchParams);
  };

  const renderRatingStars = (rating: number = 0) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }

    return stars;
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-red-500 mb-4">Error Loading Experiences</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#8B6B3D] hover:bg-[#6B4F2D] text-white px-4 py-2 rounded transition duration-300"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div  className="relative h-[70vh] overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-[url('/nairobi-national-park.webp')] bg-cover bg-center"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center px-4 max-w-4xl">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-bold text-white font-serif mb-6"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#F8D17B] to-[#E9B949]">
              Unique Kenyan Experiences
              </span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-xl text-white mb-8"
            >
             Immerse yourself in authentic cultural, wildlife, and adventure experiences
            </motion.p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Search and Filter */}
        <div className="mb-12">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search experiences..."
                className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B6B3D] focus:border-[#8B6B3D]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="bg-[#8B6B3D] hover:bg-[#6B4F2D] text-white px-6 py-3 rounded-lg transition duration-300 flex items-center justify-center gap-2"
            >
              <FaSearch />
              Search
            </button>
          </form>

          {/* Categories */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaFilter className="text-[#8B6B3D]" />
              Filter by Category
            </h2>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleCategoryClick(null)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                  !searchParams.get('category_id')
                    ? "bg-[#8B6B3D] text-white border-[#8B6B3D]"
                    : "bg-white text-gray-700 border-gray-300 hover:border-[#8B6B3D] hover:text-[#8B6B3D]"
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                    searchParams.get('category_id') === category.id
                      ? "bg-[#8B6B3D] text-white border-[#8B6B3D]"
                      : "bg-white text-gray-700 border-gray-300 hover:border-[#8B6B3D] hover:text-[#8B6B3D]"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Experiences Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : experiences.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-600">
              No experiences found matching your criteria
            </h3>
            <button
              onClick={() => {
                setSearchParams({});
                setSearchTerm("");
              }}
              className="mt-4 text-[#8B6B3D] hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {experiences.map((experience) => (
              <div key={experience.id} className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={experience.cover_image || "https://via.placeholder.com/400x300?text=Experience+Image"}
                    alt={experience.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-white bg-[#8B6B3D] px-2 py-1 rounded">
                        {experience.duration} {experience.duration === 1 ? "day" : "days"}
                      </span>
                      <span className="text-sm text-white bg-black/50 px-2 py-1 rounded capitalize">
                        {experience.difficulty}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 font-serif mb-2">
                    {experience.title}
                  </h3>
                  
                  <div className="flex items-center mb-3">
                    <div className="flex mr-2">
                      {renderRatingStars(experience.rating)}
                    </div>
                    <span className="text-sm text-gray-600">
                      ({experience.rating_quantity || 0} reviews)
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {experience.short_description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold text-[#8B6B3D]">
                      ${experience.discount_price ? experience.discount_price.toLocaleString() : experience.price.toLocaleString()}
                      <span className="text-sm font-normal text-gray-600 ml-1">/person</span>
                    </span>
                    <span className="text-sm text-gray-600">
                      {experience.min_group_size}{experience.max_group_size ? `-${experience.max_group_size}` : '+'} people
                    </span>
                  </div>

                  <div className="flex space-x-3">
                    <Link
                      to={`/experience/${experience.slug}`}
                      className="flex-1 text-center text-[#8B6B3D] border border-[#8B6B3D] hover:bg-[#8B6B3D] hover:text-white py-2 px-4 rounded-lg transition duration-300 font-medium"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleBookNow(experience)}
                      className="flex-1 text-center bg-[#8B6B3D] hover:bg-[#6B4F2D] text-white py-2 px-4 rounded-lg transition duration-300 font-medium"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {selectedExperience && (
        <BookingExperienceModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          experienceId={selectedExperience.id}
          experienceTitle={selectedExperience.title}
          pricePerPerson={selectedExperience.price}
          experienceDuration={selectedExperience.duration}
        />
      )}
    </div>
  );
};

export default ExperiencePage;