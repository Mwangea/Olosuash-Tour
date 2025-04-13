import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaStar, FaRegStar, FaUsers } from "react-icons/fa";
import { GiPathDistance } from "react-icons/gi";
import { IoMdTime } from "react-icons/io";
import api from "../api/axios";
;
import { BookingModal } from "../components/BookingModal";

interface Experience {
  id: string;
  title: string;
  slug: string;
  description: string;
  short_description: string;
  duration: number;
  difficulty: string;
  price: number;
  discount_price?: number;
  min_group_size: number;
  max_group_size?: number;
  rating?: number;
  rating_quantity?: number;
  cover_image?: string;
  images?: Array<{
    id: string;
    image_path: string;
    is_cover: boolean;
  }>;
  sections?: Array<{
    id: string;
    title: string;
    description: string;
    image_path?: string;
    order: number;
  }>;
  included_items?: Array<{
    name: string;
    description: string;
  }>;
  excluded_items?: Array<{
    name: string;
    description: string;
  }>;
  reviews?: Array<{
    id: string;
    username: string;
    rating: number;
    review: string;
    created_at: string;
  }>;
  category_name: string;
  category_slug: string;
}

const ExperienceSlugPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<{
    id: string;
    title: string;
    price: number;
    duration: number;
  } | null>(null);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/experiences/slug/${slug}`);
        setExperience(response.data.data.experience);
      } catch (err) {
        setError("Failed to load experience details");
        console.error("Error fetching experience:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, [slug]);

  const handleBookNow = () => {
    if (!experience) return;
    
    setSelectedExperience({
      id: experience.id,
      title: experience.title,
      price: experience.discount_price || experience.price,
      duration: experience.duration,
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

  if (loading) {
    return (
      <div className="py-12 bg-gradient-to-b from-[#F8F4EA] to-[#E9F5FF]">
        <div className="container mx-auto px-4">
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded mb-8"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 bg-gradient-to-b from-[#F8F4EA] to-[#E9F5FF]">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-white p-8 rounded-xl shadow-sm max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-[#8B6B3D] mb-4">Error Loading Experience</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link
              to="/experiences"
              className="inline-block bg-[#8B6B3D] hover:bg-[#6B4F2D] text-white font-medium py-2 px-6 rounded-lg transition duration-300"
            >
              Back to Experiences
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="py-16 bg-gradient-to-b from-[#F8F4EA] to-[#E9F5FF]">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-white p-8 rounded-xl shadow-sm max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-[#8B6B3D] mb-4">Experience Not Found</h2>
            <p className="text-gray-600 mb-6">The experience you're looking for doesn't exist or may have been removed.</p>
            <Link
              to="/experiences"
              className="inline-block bg-[#8B6B3D] hover:bg-[#6B4F2D] text-white font-medium py-2 px-6 rounded-lg transition duration-300"
            >
              Explore Our Experiences
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gradient-to-b from-[#F8F4EA] to-[#E9F5FF]">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Hero Section */}
          <div className="relative h-96 overflow-hidden">
            <img
              src={experience.cover_image || "https://via.placeholder.com/1200x500?text=Experience+Image"}
              alt={experience.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-8">
              <div>
                <h1 className="text-3xl font-bold text-white font-serif">{experience.title}</h1>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-white bg-[#8B6B3D] px-2 py-1 rounded mr-2">
                    {experience.category_name}
                  </span>
                  <div className="flex items-center text-white">
                    {renderRatingStars(experience.rating)}
                    <span className="ml-1 text-sm">({experience.rating_quantity || 0})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                {/* Highlights */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center">
                    <IoMdTime className="text-[#8B6B3D] mr-2 text-xl" />
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="font-medium">{experience.duration} {experience.duration === 1 ? "day" : "days"}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <GiPathDistance className="text-[#8B6B3D] mr-2 text-xl" />
                    <div>
                      <p className="text-sm text-gray-500">Difficulty</p>
                      <p className="font-medium capitalize">{experience.difficulty}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FaUsers className="text-[#8B6B3D] mr-2 text-xl" />
                    <div>
                      <p className="text-sm text-gray-500">Group Size</p>
                      <p className="font-medium">
                        {experience.min_group_size}{experience.max_group_size ? `-${experience.max_group_size}` : '+'} people
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="prose max-w-none mb-8">
                  <h2 className="text-2xl font-bold text-[#8B6B3D] mb-4">Overview</h2>
                  <p className="mb-4">{experience.short_description}</p>
                  {experience.description.split('\n').map((paragraph, i) => (
                    <p key={i} className="mb-4">{paragraph}</p>
                  ))}
                </div>

                {/* Sections */}
                {experience.sections && experience.sections.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-[#8B6B3D] mb-4">Experience Details</h2>
                    <div className="space-y-6">
                      {experience.sections.map((section) => (
                        <div key={section.id} className="border-l-4 border-[#8B6B3D] pl-4">
                          <h3 className="text-xl font-bold mb-2">{section.title}</h3>
                          <p className="text-gray-600">{section.description}</p>
                          {section.image_path && (
                            <img 
                              src={section.image_path} 
                              alt={section.title}
                              className="mt-4 rounded-lg max-w-full h-auto"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Booking Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-[#F8F4EA] p-6 rounded-lg sticky top-4">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-[#8B6B3D] mb-2">Price</h3>
                    <div className="flex items-end">
                      <span className="text-3xl font-bold">
                        ${experience.discount_price ? experience.discount_price.toLocaleString() : experience.price.toLocaleString()}
                      </span>
                      <span className="text-gray-600 ml-1">/ person</span>
                      {experience.discount_price && (
                        <span className="ml-2 text-gray-500 line-through">
                          ${experience.price.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      For {experience.min_group_size}{experience.max_group_size ? `-${experience.max_group_size}` : '+'} people
                    </p>
                  </div>

                  <button
                    onClick={handleBookNow}
                    className="w-full bg-[#8B6B3D] hover:bg-[#6B4F2D] text-white py-3 px-6 rounded-lg transition duration-300 font-medium"
                  >
                    Book Now
                  </button>

                  {/* Included/Excluded */}
                  {(experience.included_items || experience.excluded_items) && (
                    <div className="mt-6">
                      <h3 className="text-lg font-bold text-[#8B6B3D] mb-2">What's Included</h3>
                      <ul className="space-y-2">
                        {experience.included_items?.map((item, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-[#8B6B3D] mr-2">✓</span>
                            <span>{item.name}</span>
                          </li>
                        ))}
                      </ul>

                      {experience.excluded_items && experience.excluded_items.length > 0 && (
                        <>
                          <h3 className="text-lg font-bold text-[#8B6B3D] mt-4 mb-2">Not Included</h3>
                          <ul className="space-y-2">
                            {experience.excluded_items.map((item, i) => (
                              <li key={i} className="flex items-start">
                                <span className="text-gray-400 mr-2">✗</span>
                                <span>{item.name}</span>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Reviews */}
            {experience.reviews && experience.reviews.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-[#8B6B3D] mb-6">Customer Reviews</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {experience.reviews.map((review) => (
                    <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center mb-3">
                        <div className="bg-[#8B6B3D]/10 text-[#8B6B3D] rounded-full w-10 h-10 flex items-center justify-center mr-3">
                          {review.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-medium">{review.username}</h4>
                          <div className="flex items-center">
                            {renderRatingStars(review.rating)}
                            <span className="text-xs text-gray-500 ml-2">
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
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {selectedExperience && (
        <BookingModal
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

export default ExperienceSlugPage;