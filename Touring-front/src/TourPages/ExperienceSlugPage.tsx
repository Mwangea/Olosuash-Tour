import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaStar, FaRegStar, FaUser } from "react-icons/fa";
import { GiPathDistance } from "react-icons/gi";
import { IoMdTime } from "react-icons/io";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import api from "../api/axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import BookingExperienceModal from "../components/BookingExperienceModal";

interface Experience {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  duration: number;
  difficulty: string;
  price: number;
  discount_price?: number;
  min_group_size: number;
  max_group_size: number;
  rating?: number;
  rating_quantity?: number;
  is_featured: boolean;
  category_id: string;
  category_name: string;
  category_slug: string;
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
    image_path: string;
    order: number;
  }>;
  reviews?: Array<{
    id: string;
    username: string;
    rating: number;
    review: string;
    created_at: string;
  }>;
}

const ExperienceSlugPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<{
    id: string;
    title: string;
    price: number;
  } | null>(null);
  const [showAllImages, setShowAllImages] = useState(false);
  const [numberOfGuests, setNumberOfGuests] = useState(1);

  // Function to ensure image URLs are absolute
  const getFullImageUrl = (path: string) => {
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }

    // In development, use the proxy path (/uploads)
    if (process.env.NODE_ENV === "development") {
      return path.startsWith("/") ? path : `/${path}`;
    }

    // In production, use the full API domain
    return `https://api.olosuashi.com${
      path.startsWith("/") ? path : `/${path}`
    }`;
  };

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/experiences/slug/${slug}`);

        // Process the experience data to ensure full image URLs
        const processedExperience = {
          ...response.data.data.experience,
          images:
            response.data.data.experience.images?.map(
              (image: { image_path: string }) => ({
                ...image,
                image_path: getFullImageUrl(image.image_path),
              })
            ) || [],
          sections:
            response.data.data.experience.sections?.map(
              (section: { image_path: string }) => ({
                ...section,
                image_path: section.image_path
                  ? getFullImageUrl(section.image_path)
                  : null,
              })
            ) || [],
        };

        setExperience(processedExperience);
        setNumberOfGuests(processedExperience.min_group_size || 1);
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
    if (!experience?.images) return;
    setCurrentImageIndex(
      (prev) => (prev + 1) % (experience.images?.length || 1)
    );
  };

  const prevImage = () => {
    if (!experience?.images) return;
    setCurrentImageIndex(
      (prev) =>
        (prev - 1 + (experience.images?.length || 1)) %
        (experience.images?.length || 1)
    );
  };

  const handleGuestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    const clampedValue = Math.max(
      experience?.min_group_size || 1,
      Math.min(value, experience?.max_group_size || 10)
    );
    setNumberOfGuests(clampedValue);
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  if (!experience) {
    return <ExperienceNotFound />;
  }

  const displayedImages = showAllImages
    ? experience.images
    : experience.images?.slice(0, 5) || [];

  const coverImage =
    experience.images?.find((img) => img.is_cover)?.image_path ||
    experience.images?.[0]?.image_path ||
    experience.cover_image;

  const totalPrice =
    (experience.discount_price || experience.price) * numberOfGuests;
  const originalTotalPrice = experience.price * numberOfGuests;

  const parseSectionDescription = (description: string) => {
    // Split by lines that start with a word followed by "–" or "-"
    const parts = description
      .split(/\n\s*([A-Za-z].*?\s*[–-]\s*)/)
      .filter((part) => part.trim());

    if (parts.length <= 1) {
      // No subheadings found, return as single paragraph
      return <p className="text-gray-600">{description}</p>;
    }

    return (
      <div className="space-y-6">
        {parts.map((part, i) => {
          if (i % 2 === 1) {
            // This is a heading part (odd indices after split)
            const [heading, ...content] = part.split("\n");
            return (
              <div key={i} className="pt-4 first:pt-0">
                <h4 className="text-lg font-semibold text-[#8B6B3D] mb-2">
                  {heading.replace(/[–-]\s*$/, "")} {/* Remove trailing dash */}
                </h4>
                {content.length > 0 && (
                  <p className="text-gray-600">{content.join("\n").trim()}</p>
                )}
              </div>
            );
          } else if (part.trim()) {
            // This is content between headings (even indices)
            return (
              <p key={i} className="text-gray-600">
                {part.trim()}
              </p>
            );
          }
          return null;
        })}
      </div>
    );
  };

  return (
    <div className="py-12 bg-gradient-to-b from-[#F8F4EA] to-[#E9F5FF]">
      <div className="container mx-auto px-4">
        {/* Experience Hero Section */}
        <div className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div className="relative">
              <div className="rounded-xl overflow-hidden bg-gray-100 aspect-[4/3] relative">
                {coverImage ? (
                  <>
                    <img
                      src={
                        experience.images?.[currentImageIndex]?.image_path ||
                        coverImage
                      }
                      alt={experience.title}
                      className="w-full h-full object-cover"
                    />
                    {experience.images && experience.images.length > 1 && (
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
                    <div className="text-4xl text-gray-400">🏞️</div>
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
                        className={`rounded-md overflow-hidden aspect-square ${
                          currentImageIndex === index
                            ? "ring-2 ring-[#8B6B3D]"
                            : ""
                        }`}
                      >
                        <img
                          src={image.image_path}
                          alt={`${experience.title} - ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                  {experience.images &&
                    experience.images.length > 5 &&
                    !showAllImages && (
                      <button
                        onClick={() => setShowAllImages(true)}
                        className="mt-2 text-sm text-[#8B6B3D] hover:text-[#6B4F2D] font-medium"
                      >
                        Show all {experience.images.length} images
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

            {/* Experience Info */}
            <div>
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-bold text-gray-800 font-serif">
                  {experience.title}
                </h1>
              </div>

              {/* Category */}
              <div className="flex items-center mb-4">
                <Link
                  to={`/experiences/category/${experience.category_slug}`}
                  className="text-sm bg-[#8B6B3D]/10 text-[#8B6B3D] px-2 py-1 rounded hover:bg-[#8B6B3D]/20 transition"
                >
                  {experience.category_name}
                </Link>
              </div>

              {/* Rating */}
              {experience.rating && (
                <div className="flex items-center mb-4">
                  <div className="flex mr-2">
                    {renderRatingStars(experience.rating || 5)}
                  </div>
                  <span className="text-sm text-gray-600">
                    ({experience.rating_quantity || 45} reviews)
                  </span>
                </div>
              )}

              {/* Short Description */}
              <p className="text-gray-600 mb-6">
                {experience.short_description}
              </p>

              {/* Price */}
              <div className="bg-[#8B6B3D]/10 p-4 rounded-lg mb-6">
                <div className="flex justify-between mb-2">
                  <span>Price per person:</span>
                  <span className="font-medium">
                    {experience.discount_price ? (
                      <>
                        <span className="line-through text-gray-500 mr-2">
                          ${experience.price.toLocaleString()}
                        </span>
                        <span className="text-[#8B6B3D]">
                          ${experience.discount_price.toLocaleString()}
                        </span>
                      </>
                    ) : (
                      <span>${experience.price.toLocaleString()}</span>
                    )}
                  </span>
                </div>

                {/* Group Size Selector */}
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Guests ({experience.min_group_size}-
                    {experience.max_group_size})
                  </label>
                  <input
                    title="number"
                    type="number"
                    min={experience.min_group_size}
                    max={experience.max_group_size}
                    value={numberOfGuests}
                    onChange={handleGuestChange}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#8B6B3D] focus:border-[#8B6B3D]"
                  />
                </div>

                {/* Total Price */}
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-[#8B6B3D]/20">
                  <span>Total:</span>
                  <span className="text-[#8B6B3D]">
                    {experience.discount_price ? (
                      <>
                        <span className="line-through text-gray-500 mr-2">
                          ${originalTotalPrice.toLocaleString()}
                        </span>
                        ${totalPrice.toLocaleString()}
                      </>
                    ) : (
                      <>${totalPrice.toLocaleString()}</>
                    )}
                  </span>
                </div>
              </div>

              {/* Highlights */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <IoMdTime className="text-[#8B6B3D] mr-2" />
                  <span className="text-gray-700">{experience.duration} </span>
                </div>
                <div className="flex items-center">
                  <GiPathDistance className="text-[#8B6B3D] mr-2" />
                  <span className="text-gray-700 capitalize">
                    {experience.difficulty}
                  </span>
                </div>
                <div className="flex items-center">
                  <FaUser className="text-[#8B6B3D] mr-2" />
                  <span className="text-gray-700">
                    {experience.min_group_size}-{experience.max_group_size}{" "}
                    people
                  </span>
                </div>
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
                  to="/experience"
                  className="flex-1 text-center text-[#8B6B3D] border border-[#8B6B3D] hover:bg-[#8B6B3D] hover:text-white py-3 px-6 rounded-lg transition duration-300 font-medium"
                >
                  Explore More Experiences
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="mb-12 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 font-serif">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8B6B3D] to-[#5E4B2B]">
              About This Experience
            </span>
          </h2>
          <div className="prose text-gray-600">
            {experience.description.split("\n").map((paragraph, i) => (
              <p key={i} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Experience Sections */}
        {experience.sections && experience.sections.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 font-serif">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8B6B3D] to-[#5E4B2B]">
                Experience Highlights
              </span>
            </h2>

            <div className="space-y-12">
              {experience.sections.map((section, index) => (
                <div
                  key={section.id}
                  className={`grid grid-cols-1 ${
                    section.image_path ? "md:grid-cols-2" : ""
                  } gap-6 items-start`}
                >
                  <div
                    className={`${
                      index % 2 === 0 || !section.image_path
                        ? "order-1"
                        : "order-2"
                    }`}
                  >
                    <h3 className="text-xl font-bold text-[#8B6B3D] mb-3">
                      {section.title}
                    </h3>
                    {parseSectionDescription(section.description)}
                  </div>

                  {section.image_path && (
                    <div
                      className={`${index % 2 === 0 ? "order-2" : "order-1"}`}
                    >
                      <img
                        src={section.image_path}
                        alt={section.title}
                        className="w-full h-auto rounded-lg shadow-md"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Section */}
        {experience.reviews && experience.reviews.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 font-serif">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8B6B3D] to-[#5E4B2B]">
                Customer Reviews
              </span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {experience.reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
                >
                  <div className="flex items-center mb-3">
                    <div className="bg-[#8B6B3D]/10 text-[#8B6B3D] rounded-full w-10 h-10 flex items-center justify-center mr-3">
                      {review.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">
                        {review.username}
                      </h4>
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
          <h3 className="text-2xl font-bold text-gray-800 mb-4 font-serif">
            Ready for an Unforgettable Experience?
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Book your {experience.title} today and create memories that will
            last a lifetime.
          </p>
          <button
            onClick={handleBookNow}
            className="bg-[#8B6B3D] hover:bg-[#6B4F2D] text-white font-medium py-3 px-8 rounded-lg transition duration-300 inline-flex items-center mx-auto"
          >
            Book Now
          </button>
        </div>
      </div>

      {/* Booking Modal */}
      {selectedExperience && (
        <BookingExperienceModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          experienceId={selectedExperience.id}
          experienceTitle={selectedExperience.title}
          pricePerPerson={selectedExperience.price}
          experienceDuration={experience.duration}
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

      {/* Sections Skeleton */}
      <div className="mb-12">
        <Skeleton height={32} width="30%" className="mb-6" />
        <div className="space-y-8">
          {[1, 2].map((item) => (
            <div key={item} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Skeleton height={28} width="40%" className="mb-4" />
                <Skeleton height={20} count={3} />
              </div>
              <Skeleton height={200} />
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
        <h2 className="text-2xl font-bold text-[#8B6B3D] mb-4">
          Error Loading Experience
        </h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <Link
          to="/experience"
          className="inline-block bg-[#8B6B3D] hover:bg-[#6B4F2D] text-white font-medium py-2 px-6 rounded-lg transition duration-300"
        >
          Back to Experiences
        </Link>
      </div>
    </div>
  </div>
);

const ExperienceNotFound = () => (
  <div className="py-16 bg-gradient-to-b from-[#F8F4EA] to-[#E9F5FF]">
    <div className="container mx-auto px-4 text-center">
      <div className="bg-white p-8 rounded-xl shadow-sm max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-[#8B6B3D] mb-4">
          Experience Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          The experience you're looking for doesn't exist or may have been
          removed.
        </p>
        <Link
          to="/experience"
          className="inline-block bg-[#8B6B3D] hover:bg-[#6B4F2D] text-white font-medium py-2 px-6 rounded-lg transition duration-300"
        >
          Explore Our Experiences
        </Link>
      </div>
    </div>
  </div>
);

export default ExperienceSlugPage;
