import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaRegStar, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { IoMdTime } from 'react-icons/io';
import { GiPathDistance } from 'react-icons/gi';
import { Tour } from '../api/tourApi';
import api from '../api/axios';


const FeaturedSection = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchFeaturedTours = async () => {
      try {
        setLoading(true);
        const response = await api.get('/tours/featured?limit=3');
        const toursWithImages = response.data.data.tours.map((tour: Tour) => ({
          ...tour,
          // Ensure images array exists and has at least the cover image
          images: tour.images?.length ? tour.images : [
            {
              id: 'cover',
              image_path: tour.cover_image,
              is_cover: true
            }
          ],
        }));
        
        setTours(toursWithImages);
        
        // Initialize image indexes
        const indexes: Record<string, number> = {};
        toursWithImages.forEach((tour: Tour) => {
          indexes[tour.id] = 0;
        });
        setCurrentImageIndex(indexes);
      } catch (error) {
        console.error('Error fetching featured tours:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedTours();
  }, []);

  useEffect(() => {
    if (tours.length > 0) {
      // Set up automatic image rotation for each tour
      const intervals = tours.map(tour => {
        if (tour.images && tour.images.length > 1) {
          return setInterval(() => {
            setCurrentImageIndex(prev => ({
              ...prev,
              [tour.id]: (prev[tour.id] + 1) % tour.images.length
            }));
          }, 5000);
        }
        return null;
      }).filter(Boolean);

      return () => intervals.forEach(interval => clearInterval(interval as NodeJS.Timeout));
    }
  }, [tours]);

  const nextImage = (tourId: string) => {
    const tour = tours.find(t => t.id === tourId);
    if (!tour || !tour.images || tour.images.length <= 1) return;

    setCurrentImageIndex(prev => ({
      ...prev,
      [tourId]: (prev[tourId] + 1) % tour.images.length
    }));
  };

  const prevImage = (tourId: string) => {
    const tour = tours.find(t => t.id === tourId);
    if (!tour || !tour.images || tour.images.length <= 1) return;

    setCurrentImageIndex(prev => ({
      ...prev,
      [tourId]: (prev[tourId] - 1 + tour.images.length) % tour.images.length
    }));
  };

  const renderRatingStars = (rating: number) => {
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

  if (loading) {
    return (
      <div className="py-16 bg-gradient-to-b from-[#F8F4EA] to-[#E9F5FF]">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-[#2A2A2A] font-serif">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8B6B3D] to-[#5E4B2B]">
              Featured Tours
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-64 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4 mb-6"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-gradient-to-b from-[#F8F4EA] to-[#E9F5FF]">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-[#2A2A2A] font-serif">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8B6B3D] to-[#5E4B2B]">
            Featured Tours
          </span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tours.map((tour) => {
            const currentIndex = currentImageIndex[tour.id] || 0;
            const currentImage = tour.images?.[currentIndex]?.image_path || tour.cover_image;

            return (
              <div key={tour.id} className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                {/* Image Carousel */}
                <div className="relative h-64 overflow-hidden">
                  {currentImage ? (
                    <>
                      <img
                        src={currentImage}
                        alt={tour.title}
                        className="w-full h-full object-cover transition-opacity duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Tour+Image';
                        }}
                      />
                      {/* Navigation Arrows */}
                      {tour.images && tour.images.length > 1 && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              prevImage(tour.id);
                            }}
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition"
                          >
                            <FaArrowLeft />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              nextImage(tour.id);
                            }}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition"
                          >
                            <FaArrowRight />
                          </button>
                        </>
                      )}
                      {/* Image Indicators */}
                      {tour.images && tour.images.length > 1 && (
                        <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2">
                          {tour.images.map((_, index) => (
                            <div
                              key={index}
                              className={`w-2 h-2 rounded-full ${currentIndex === index ? 'bg-white' : 'bg-white bg-opacity-50'}`}
                            />
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <img 
                        src="https://via.placeholder.com/400x300?text=No+Image" 
                        alt="No tour image available" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Tour Info */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-800 font-serif">{tour.title}</h3>
                    <div className="flex items-center bg-[#8B6B3D] text-white px-3 py-1 rounded-lg">
                      <span className="text-sm font-medium">${tour.price_per_guest}</span>
                      <span className="text-xs ml-1">/person</span>
                    </div>
                  </div>

                  <div className="flex items-center mb-3">
                    <div className="flex mr-2">
                      {renderRatingStars(parseFloat(tour.rating || '0'))}
                    </div>
                    <span className="text-sm text-gray-600">
                      ({tour.rating_quantity || 0} reviews)
                    </span>
                  </div>

                  {/* Display first review */}
                  {tour.reviews && tour.reviews.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center mb-1">
                        <div className="flex mr-1">
                          {renderRatingStars(tour.reviews[0].rating)}
                        </div>
                        <span className="text-xs font-medium text-gray-700">{tour.reviews[0].username}</span>
                      </div>
                      <p className="text-gray-600 text-xs italic line-clamp-2">
                        "{tour.reviews[0].review}"
                      </p>
                    </div>
                  )}

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{tour.summary}</p>

                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-6">
                    <div className="flex items-center">
                      <IoMdTime className="mr-1 text-[#8B6B3D]" />
                      <span>{tour.duration} days</span>
                    </div>
                    <div className="flex items-center">
                      <GiPathDistance className="mr-1 text-[#8B6B3D]" />
                      <span className="capitalize">{tour.difficulty}</span>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Link
                      to={`/tours/${tour.slug}`}
                      className="flex-1 text-center text-[#8B6B3D] border border-[#8B6B3D] hover:bg-[#8B6B3D] hover:text-white py-2 px-4 rounded-lg transition duration-300 font-medium"
                    >
                      View Details
                    </Link>
                    <Link
                      to={`/booking?tour=${tour.id}`}
                      className="flex-1 text-center bg-[#8B6B3D] hover:bg-[#6B4F2D] text-white py-2 px-4 rounded-lg transition duration-300 font-medium"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {tours.length > 0 && (
          <div className="text-center mt-12">
            <Link
              to="/tours"
              className="inline-flex items-center text-[#8B6B3D] hover:text-[#6B4F2D] font-medium transition group"
            >
              View All Tours 
              <FaArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedSection;