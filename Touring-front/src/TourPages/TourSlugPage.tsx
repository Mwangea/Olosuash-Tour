import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaStar, FaRegStar, FaMapMarkerAlt, FaHotel, FaCar, FaHome } from "react-icons/fa";
import { GiPathDistance, GiElephant } from "react-icons/gi";
import { IoMdTime } from "react-icons/io";
import api from "../api/axios";


import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import WishlistIcon from "../components/WishlistIcon";
import { BookingModal } from "../components/BookingModal";

interface Tour {
  id: string;
  title: string;
  slug: string;
  description: string;
  summary: string;
  duration: number;
  difficulty: string;
  price: number;
  price_per_guest: string;
  discount_price?: number;
  rating?: number;
  rating_quantity?: number;
  cover_image?: string;
  accommodation_details?: string;
  images?: Array<{
    id: string;
    image_path: string;
    is_cover: boolean;
  }>;
  itinerary?: Array<{
    day: number;
    title: string;
    description: string;
  }>;
  includedServices?: Array<{
    name: string;
    description: string;
    details?: string;
  }>;
  excludedServices?: Array<{
    name: string;
    description: string;
    details?: string;
  }>;
  reviews?: Array<{
    id: string;
    username: string;
    rating: number;
    review: string;
    created_at: string;
  }>;
  regions?: Array<{
    id: string;
    name: string;
  }>;
  locations?: Array<{
    name: string;
    description?: string;
    latitude: number;
    longitude: number;
    day?: number;
  }>;
  vehicles?: Array<{
    vehicle_type: string;
    capacity: number;
    is_primary: boolean;
  }>;
}

const TourSlugPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState<{
    id: string;
    title: string;
    price: number;
    duration: number;
  } | null>(null);
  const [showAllImages, setShowAllImages] = useState(false);

  // Function to ensure image URLs are absolute
  const getFullImageUrl = (path: string) => {
    if (!path) return ''; // handle empty paths
    
    // If it's already a full URL, return as-is
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }
  
    // Remove any leading slashes and "uploads/" prefix to avoid duplication
    let cleanPath = path.startsWith('/') ? path.substring(1) : path;
    // Remove 'uploads/' prefix if it exists to prevent duplication
    cleanPath = cleanPath.startsWith('uploads/') ? cleanPath.substring(8) : cleanPath;
  
    // Always use the production API for images
    return `https://api.olosuashi.com/uploads/${cleanPath}`;
  };


  useEffect(() => {
    const fetchTour = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/tours/slug/${slug}`);
        
        // Process the tour data to ensure full image URLs
        const processedTour = {
          ...response.data.data.tour,
          cover_image: response.data.data.tour.cover_image 
            ? getFullImageUrl(response.data.data.tour.cover_image)
            : undefined,
          images: response.data.data.tour.images?.map((image: { image_path: string }) => ({
            ...image,
            image_path: getFullImageUrl(image.image_path)
          })) || []
        };

        setTour(processedTour);
      } catch (err) {
        setError("Failed to load tour details");
        console.error("Error fetching tour:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [slug]);

  const handleBookNow = () => {
    if (!tour) return;
    
    setSelectedTour({
      id: tour.id,
      title: tour.title,
      price: parseFloat(tour.price_per_guest),
      duration: tour.duration,
    });
    setIsBookingModalOpen(true);
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

  const nextImage = () => {
    if (!tour?.images) return;
    setCurrentImageIndex((prev) => (prev + 1) % (tour.images?.length || 1));
  };

  const prevImage = () => {
    if (!tour?.images) return;
    setCurrentImageIndex((prev) => (prev - 1 + (tour.images?.length || 1)) % (tour.images?.length || 1));
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  if (!tour) {
    return <TourNotFound />;
  }

  const displayedImages = showAllImages 
    ? tour.images 
    : tour.images?.slice(0, 5) || [];
  
  const coverImage = tour.images?.find(img => img.is_cover)?.image_path || 
                    tour.images?.[0]?.image_path || 
                    tour.cover_image;

  return (
    <div className="py-12 bg-gradient-to-b from-[#F8F4EA] to-[#E9F5FF]">
      <div className="container mx-auto px-4">
        <Link 
          to="/" 
          className="flex items-center text-[#8B6B3D] hover:text-[#6B4F2D] transition-colors duration-200 mb-4 lg:mb-6"
        >
          <FaHome className="mr-2" />
          <span className="font-medium">Back to Home</span>
        </Link>
      </div>
      <div className="container mx-auto px-4">
        {/* Tour Hero Section */}
        <div className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div className="relative">
              <div className="rounded-xl overflow-hidden bg-gray-100 aspect-[4/3] relative">
                {coverImage ? (
                  <>
                    <img
                      src={tour.images?.[currentImageIndex]?.image_path || coverImage}
                      alt={tour.title}
                      className="w-full h-full object-cover"
                    />
                    {tour.images && tour.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition z-10"
                        >
                          <FiChevronLeft className="text-xl" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition z-10"
                        >
                          <FiChevronRight className="text-xl" />
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <GiElephant className="text-4xl text-gray-400" />
                  </div>
                )}
              </div>
              
              {/* Additional Images Thumbnails */}
              {displayedImages && displayedImages.length > 0 && (
                <div className="mt-4">
                  <div className="grid grid-cols-5 gap-2">
                    {displayedImages.map((image, index) => (
                      <button
                        key={image.id}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`rounded-md overflow-hidden aspect-square ${currentImageIndex === index ? 'ring-2 ring-[#8B6B3D]' : ''}`}
                      >
                        <img
                          src={image.image_path}
                          alt={`${tour.title} - ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                  {tour.images && tour.images.length > 5 && !showAllImages && (
                    <button
                      onClick={() => setShowAllImages(true)}
                      className="mt-2 text-sm text-[#8B6B3D] hover:text-[#6B4F2D] font-medium"
                    >
                      Show all {tour.images.length} images
                    </button>
                  )}
                  {showAllImages && (
                    <button
                      onClick={() => setShowAllImages(false)}
                      className="mt-2 text-sm text-[#8B6B3D] hover:text-[#6B4F2D] font-medium"
                    >
                      Show fewer images
                    </button>
                  )}
                </div>
              )}
            </div>
            
            {/* Tour Info */}
            <div>
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-bold text-gray-800 font-serif">{tour.title}</h1>
                <WishlistIcon 
                  tourId={tour.id} 
                  size={24} 
                  position="top-right" 
                  className="text-[#8B6B3D] hover:text-[#6B4F2D] transition" 
                />
              </div>
              
              {/* Regions */}
              {tour.regions && tour.regions.length > 0 && (
                <div className="flex items-center mb-4">
                  <FaMapMarkerAlt className="text-[#8B6B3D] mr-2" />
                  <div className="flex flex-wrap gap-2">
                    {tour.regions.map((region) => (
                      <span key={region.id} className="text-sm bg-[#8B6B3D]/10 text-[#8B6B3D] px-2 py-1 rounded">
                        {region.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex mr-2">
                  {renderRatingStars(tour.rating || 0)}
                </div>
                <span className="text-sm text-gray-600">
                  ({tour.rating_quantity || 0} reviews)
                </span>
              </div>
              
              {/* Price */}
              <div className="bg-[#8B6B3D]/10 p-4 rounded-lg mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-[#8B6B3D]">
                      ${parseFloat(tour.price_per_guest).toLocaleString()}
                    </span>
                    <span className="text-gray-600 ml-1">/ person</span>
                  </div>
                  {tour.discount_price && (
                    <div className="text-sm line-through text-gray-500">
                      ${tour.discount_price.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Highlights */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <IoMdTime className="text-[#8B6B3D] mr-2" />
                  <span className="text-gray-700">{tour.duration} days</span>
                </div>
                <div className="flex items-center">
                  <GiPathDistance className="text-[#8B6B3D] mr-2" />
                  <span className="text-gray-700 capitalize">{tour.difficulty}</span>
                </div>
                {tour.vehicles && tour.vehicles.length > 0 && (
                  <div className="flex items-center">
                    <FaCar className="text-[#8B6B3D] mr-2" />
                    <span className="text-gray-700">
                      {tour.vehicles.find(v => v.is_primary)?.vehicle_type || tour.vehicles[0].vehicle_type}
                    </span>
                  </div>
                )}
                {tour.accommodation_details && (
                  <div className="flex items-center">
                    <FaHotel className="text-[#8B6B3D] mr-2" />
                    <span className="text-gray-700">Lodging included</span>
                  </div>
                )}
              </div>
              
              {/* Description */}
              <div className="prose max-w-none text-gray-600 mb-8">
                {tour.description.split('\n').map((paragraph, i) => (
                  <p key={i} className="mb-4">{paragraph}</p>
                ))}
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleBookNow}
                  className="flex-1 bg-[#8B6B3D] hover:bg-[#6B4F2D] text-white py-3 px-6 rounded-lg transition duration-300 font-medium text-center"
                >
                  Book Now
                </button>
                <Link
                  to="/tours"
                  className="flex-1 text-center text-[#8B6B3D] border border-[#8B6B3D] hover:bg-[#8B6B3D] hover:text-white py-3 px-6 rounded-lg transition duration-300 font-medium"
                >
                  Explore More Tours
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Accommodation Details */}
        {tour.accommodation_details && (
          <div className="mb-12 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 font-serif">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8B6B3D] to-[#5E4B2B]">
                Accommodation Details
              </span>
            </h2>
            <div className="prose text-gray-600">
              {tour.accommodation_details.split('\n').map((paragraph, i) => (
                <p key={i} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </div>
        )}
        
        {/* Itinerary Section */}
        {tour.itinerary && tour.itinerary.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 font-serif">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8B6B3D] to-[#5E4B2B]">
                Tour Itinerary
              </span>
            </h2>
            
            <div className="space-y-4">
              {tour.itinerary.map((day, index) => (
                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-[#8B6B3D]/10 p-4 flex items-center">
                    <div className="bg-[#8B6B3D] text-white rounded-full w-8 h-8 flex items-center justify-center mr-4">
                      {day.day}
                    </div>
                    <h3 className="text-lg font-medium text-gray-800">{day.title}</h3>
                  </div>
                  <div className="p-4 bg-white">
                    <p className="text-gray-600">{day.description}</p>
                    
                    {/* Show locations for this day if available */}
                    {tour.locations && tour.locations.filter(l => l.day === day.day).length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium text-gray-700 mb-2">Locations:</h4>
                        <ul className="space-y-2">
                          {tour.locations
                            .filter(location => location.day === day.day)
                            .map((location, locIndex) => (
                              <li key={locIndex} className="flex items-start">
                                <FaMapMarkerAlt className="text-[#8B6B3D] mt-1 mr-2 flex-shrink-0" />
                                <div>
                                  <p className="font-medium text-gray-800">{location.name}</p>
                                  {location.description && (
                                    <p className="text-gray-600 text-sm">{location.description}</p>
                                  )}
                                </div>
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Vehicle Information */}
        {tour.vehicles && tour.vehicles.length > 0 && (
          <div className="mb-12 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 font-serif">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8B6B3D] to-[#5E4B2B]">
                Transportation
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tour.vehicles.map((vehicle, index) => (
                <div key={index} className="flex items-start">
                  <div className="bg-[#8B6B3D]/10 text-[#8B6B3D] p-3 rounded-lg mr-4">
                    <FaCar className="text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">
                      {vehicle.vehicle_type} {vehicle.is_primary && "(Primary)"}
                    </h3>
                    <p className="text-gray-600">Capacity: {vehicle.capacity} people</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Included/Excluded Services */}
        {(tour.includedServices || tour.excludedServices) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Included Services */}
            {tour.includedServices && tour.includedServices.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4 font-serif">What's Included</h3>
                <ul className="space-y-3">
                  {tour.includedServices.map((service, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-[#8B6B3D] mr-2 mt-1">✓</span>
                      <div>
                        <span className="font-medium text-gray-800">{service.name}</span>
                        {(service.description || service.details) && (
                          <p className="text-gray-600 text-sm mt-1">
                            {service.details || service.description}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Excluded Services */}
            {tour.excludedServices && tour.excludedServices.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4 font-serif">What's Not Included</h3>
                <ul className="space-y-3">
                  {tour.excludedServices.map((service, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-gray-400 mr-2 mt-1">✗</span>
                      <div>
                        <span className="font-medium text-gray-800">{service.name}</span>
                        {(service.description || service.details) && (
                          <p className="text-gray-600 text-sm mt-1">
                            {service.details || service.description}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        
        {/* Reviews Section */}
        {tour.reviews && tour.reviews.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 font-serif">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8B6B3D] to-[#5E4B2B]">
                Customer Reviews
              </span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tour.reviews.map((review) => (
                <div key={review.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center mb-3">
                    <div className="bg-[#8B6B3D]/10 text-[#8B6B3D] rounded-full w-10 h-10 flex items-center justify-center mr-3">
                      {review.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{review.username}</h4>
                      <div className="flex items-center">
                        <div className="flex mr-1">
                          {renderRatingStars(review.rating)}
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">"{review.review}"</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Booking CTA */}
        <div className="bg-[#8B6B3D]/10 p-8 rounded-xl text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 font-serif">Ready for an Adventure?</h3>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Book your {tour.title} experience today and create memories that will last a lifetime.
          </p>
          <button
            onClick={handleBookNow}
            className="bg-[#8B6B3D] hover:bg-[#6B4F2D] text-white font-medium py-3 px-8 rounded-lg transition duration-300 inline-flex items-center"
          >
            Book Now
          </button>
        </div>
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

// Helper Components
const LoadingSkeleton = () => (
  <div className="py-12 bg-gradient-to-b from-[#F8F4EA] to-[#E9F5FF]">
    <div className="container mx-auto px-4">
      {/* Hero Skeleton */}
      <div className="mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-96 bg-gray-200 rounded-xl"></div>
          <div>
            <Skeleton height={40} width="70%" className="mb-4" />
            <Skeleton height={24} width="50%" className="mb-6" />
            <div className="flex space-x-4 mb-6">
              <Skeleton height={20} width={100} />
              <Skeleton height={20} width={100} />
              <Skeleton height={20} width={100} />
            </div>
            <Skeleton count={4} className="mb-2" />
            <div className="flex space-x-4 mt-8">
              <Skeleton height={48} width={150} />
              <Skeleton height={48} width={150} />
            </div>
          </div>
        </div>
      </div>

      {/* Itinerary Skeleton */}
      <div className="mb-12">
        <Skeleton height={32} width="30%" className="mb-6" />
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="p-4 border border-gray-200 rounded-lg">
              <Skeleton height={24} width="40%" className="mb-2" />
              <Skeleton height={20} width="80%" />
              <Skeleton height={16} count={2} className="mt-2" />
            </div>
          ))}
        </div>
      </div>

      {/* Reviews Skeleton */}
      <div>
        <Skeleton height={32} width="30%" className="mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((item) => (
            <div key={item} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center mb-3">
                <Skeleton circle height={40} width={40} className="mr-3" />
                <Skeleton height={20} width="40%" />
              </div>
              <div className="flex mb-2">
                <Skeleton height={16} width={120} />
              </div>
              <Skeleton height={16} count={2} className="mt-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const ErrorDisplay = ({ error }: { error: string }) => (
  <div className="py-16 bg-gradient-to-b from-[#F8F4EA] to-[#E9F5FF]">
    <div className="container mx-auto px-4 text-center">
      <div className="bg-white p-8 rounded-xl shadow-sm max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-[#8B6B3D] mb-4">Error Loading Tour</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <Link
          to="/tours"
          className="inline-block bg-[#8B6B3D] hover:bg-[#6B4F2D] text-white font-medium py-2 px-6 rounded-lg transition duration-300"
        >
          Back to Tours
        </Link>
      </div>
    </div>
  </div>
);

const TourNotFound = () => (
  <div className="py-16 bg-gradient-to-b from-[#F8F4EA] to-[#E9F5FF]">
    <div className="container mx-auto px-4 text-center">
      <div className="bg-white p-8 rounded-xl shadow-sm max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-[#8B6B3D] mb-4">Tour Not Found</h2>
        <p className="text-gray-600 mb-6">The tour you're looking for doesn't exist or may have been removed.</p>
        <Link
          to="/tours"
          className="inline-block bg-[#8B6B3D] hover:bg-[#6B4F2D] text-white font-medium py-2 px-6 rounded-lg transition duration-300"
        >
          Explore Our Tours
        </Link>
      </div>
    </div>
  </div>
);

export default TourSlugPage;