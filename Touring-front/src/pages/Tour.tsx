/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FaStar, FaRegStar, FaSearch, FaFilter } from "react-icons/fa";
import { GiElephant, GiLion, GiMountainRoad, GiIsland } from "react-icons/gi";
import api from "../api/axios";

import WishlistIcon from "../components/WishlistIcon";
import { BookingModal } from "../components/BookingModal";

interface Tour {
  id: string;
  title: string;
  slug: string;
  summary: string;
  price_per_guest: string;
  duration: number;
  difficulty: string;
  rating?: number;
  rating_quantity?: number;
  cover_image: string;
  images?: Array<{
    id: string;
    image_path: string;
    is_cover: boolean;
  }>;
  reviews?: Array<{
    id: string;
    rating: number;
    review: string;
    username: string;
  }>;
}

// Skeleton Loader Component
const TourSkeleton = () => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden">
    <div className="relative h-48 bg-gray-200 animate-pulse"></div>
    <div className="p-6">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4 animate-pulse"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-6 animate-pulse"></div>
      <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
    </div>
  </div>
);

const Tour = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTour, setSelectedTour] = useState<{
    id: string;
    title: string;
    price: number;
    duration: number;
  } | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([
    { name: "All", icon: <GiElephant />, active: true },
    { name: "Wildlife", icon: <GiLion />, active: false },
    { name: "Adventure", icon: <GiMountainRoad />, active: false },
    { name: "Beach", icon: <GiIsland />, active: false },
  ]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 1,
  });
  const [searchTerm, setSearchTerm] = useState("");

  // Function to ensure image URLs are absolute
  const getFullImageUrl = (path: string) => {
    // If the path is already a full URL, return it
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    // Otherwise, construct the full URL using your API domain
    return `https://api.olosuashi.com${path.startsWith('/') ? path : `/${path}`}`;
  };

  // Fetch tours from API
  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        const type = searchParams.get("type") || "";
        const page = parseInt(searchParams.get("page") || "1");
        const search = searchParams.get("search") || "";

        const response = await api.get(
          `/tours?page=${page}&limit=${pagination.limit}${
            type ? `&type=${type}` : ""
          }${search ? `&search=${search}` : ""}`
        );

        // Handle different API response structures
        const responseData = response.data.data || response.data;
        const toursData = responseData.tours || responseData.data || [];
        
        // Process tours to set cover image with full URLs
        const processedTours = toursData.map((tour: any) => {
          // Find the cover image from the images array
          const coverImage = tour.images?.find((img: any) => img.is_cover)?.image_path || 
                           (tour.images?.length > 0 ? tour.images[0].image_path : null);
          return {
            ...tour,
            cover_image: coverImage ? getFullImageUrl(coverImage) : "https://via.placeholder.com/400x300?text=Tour+Image",
            images: tour.images?.map((image: any) => ({
              ...image,
              image_path: getFullImageUrl(image.image_path)
            })) || []
          };
        });

        const paginationData = responseData.pagination || {
          page,
          limit: pagination.limit,
          total: toursData.length,
          totalPages: Math.ceil((toursData.length || 0) / pagination.limit),
        };

        setTours(processedTours);
        setPagination(paginationData);
        setLoading(false);
      } catch (err) {
        setError("Failed to load tours. Please try again later.");
        setLoading(false);
        console.error("Error fetching tours:", err);
      }
    };

    fetchTours();
  }, [searchParams, pagination.limit]);

  const handleBookNow = (tour: Tour) => {
    setSelectedTour({
      id: tour.id,
      title: tour.title,
      price: parseFloat(tour.price_per_guest),
      duration: tour.duration,
    });
    setIsBookingModalOpen(true);
  };

  const handleCategoryClick = (categoryName: string) => {
    setCategories(
      categories.map((cat) => ({
        ...cat,
        active: cat.name === categoryName,
      }))
    );

    const newSearchParams = new URLSearchParams(searchParams);
    if (categoryName === "All") {
      newSearchParams.delete("type");
    } else {
      newSearchParams.set("type", categoryName.toLowerCase());
    }
    newSearchParams.set("page", "1");
    setSearchParams(newSearchParams);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const newSearchParams = new URLSearchParams(searchParams);
    if (searchTerm) {
      newSearchParams.set("search", searchTerm);
    } else {
      newSearchParams.delete("search");
    }
    newSearchParams.set("page", "1");
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
          <h2 className="text-xl font-bold text-red-500 mb-4">Error Loading Tours</h2>
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
      {/* Parallax Hero Section */}
      <div className="relative h-[70vh] overflow-hidden">
        {/* Background image with parallax effect */}
        <div 
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523805009345-7448845a9e53?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center bg-no-repeat"
          style={{
            transform: 'translate3d(0, 0, 0)',
            willChange: 'transform',
            backgroundAttachment: 'fixed'
          }}
        ></div>
        
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-serif">
            Discover Kenya's Wonders
          </h1>
          <p className="text-xl md:text-2xl text-white max-w-3xl mb-8">
            Experience breathtaking safaris, pristine beaches, and unforgettable adventures
          </p>
          <div className="flex gap-4">
            <Link 
              to="#tours" 
              className="bg-[#8B6B3D] hover:bg-[#6B4F2D] text-white px-6 py-3 rounded-lg transition duration-300 font-medium"
            >
              Explore Tours
            </Link>
            <Link 
              to="/contact" 
              className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg transition duration-300 font-medium border border-white"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div id="tours" className="container mx-auto px-4 py-12">
        {/* Search and Filter */}
        <div className="mb-12">
          <form
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row gap-4 mb-8"
          >
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search tours..."
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
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => handleCategoryClick(category.name)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                    category.active
                      ? "bg-[#8B6B3D] text-white border-[#8B6B3D]"
                      : "bg-white text-gray-700 border-gray-300 hover:border-[#8B6B3D] hover:text-[#8B6B3D]"
                  }`}
                >
                  <span className="text-lg">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tours Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <TourSkeleton key={index} />
            ))}
          </div>
        ) : tours.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-600">
              No tours found matching your criteria
            </h3>
            <button
              onClick={() => {
                setSearchParams({});
                setSearchTerm("");
                setCategories(
                  categories.map((cat) => ({
                    ...cat,
                    active: cat.name === "All",
                  }))
                );
              }}
              className="mt-4 text-[#8B6B3D] hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {tours.map((tour) => (
                <div
                  key={tour.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={tour.cover_image}
                      alt={tour.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://via.placeholder.com/400x300?text=Tour+Image";
                      }}
                    />
                    <WishlistIcon
                      tourId={tour.id}
                      size={20}
                      position="top-right"
                      className="shadow-md"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-white bg-[#8B6B3D] px-2 py-1 rounded">
                          {tour.duration} days
                        </span>
                        <span className="text-sm text-white bg-black/50 px-2 py-1 rounded capitalize">
                          {tour.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-gray-800 font-serif">
                        {tour.title}
                      </h3>
                      <div className="flex items-center bg-[#8B6B3D] text-white px-3 py-1 rounded-lg">
                        <span className="text-sm font-medium">
                          ${parseFloat(tour.price_per_guest).toLocaleString()}
                        </span>
                        <span className="text-xs ml-1">/person</span>
                      </div>
                    </div>

                    <div className="flex items-center mb-3">
                      <div className="flex mr-2">
                        {renderRatingStars(tour.rating)}
                      </div>
                      <span className="text-sm text-gray-600">
                        ({tour.rating_quantity || 0} reviews)
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {tour.summary}
                    </p>

                    <div className="flex space-x-3">
                      <Link
                        to={`/tours/${tour.slug}`}
                        className="flex-1 text-center text-[#8B6B3D] border border-[#8B6B3D] hover:bg-[#8B6B3D] hover:text-white py-2 px-4 rounded-lg transition duration-300 font-medium"
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => handleBookNow(tour)}
                        className="flex-1 text-center bg-[#8B6B3D] hover:bg-[#6B4F2D] text-white py-2 px-4 rounded-lg transition duration-300 font-medium"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => {
                        const newSearchParams = new URLSearchParams(searchParams);
                        newSearchParams.set("page", pageNum.toString());
                        setSearchParams(newSearchParams);
                      }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        pagination.page === pageNum
                          ? "bg-[#8B6B3D] text-white"
                          : "bg-white text-gray-700 border border-gray-300 hover:border-[#8B6B3D] hover:text-[#8B6B3D]"
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Booking Modal */}
      {selectedTour && (
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          tourId={selectedTour.id}
          tourTitle={selectedTour.title}
          pricePerPerson={selectedTour.price}
          tourDuration={selectedTour.duration}
        />
      )}
    </div>
  );
};

export default Tour;