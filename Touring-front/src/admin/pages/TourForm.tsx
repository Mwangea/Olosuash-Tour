/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiPlus,
  FiTrash2,
  FiImage,
  FiCheck,
  FiStar,
  FiMapPin,
  FiCalendar,
  FiUsers,
  FiDollarSign,
  FiEdit2,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import api from "../../api/axios";
import AdminLayout from "../Adminlayout";

// Types that match your backend interface
interface Image {
  id?: string;
  image_path: string;
  is_cover: boolean;
  file?: File;
}

interface Region {
  id: string;
  name: string;
}

interface VehicleType {
  id: string;
  name: string;
}

interface Vehicle {
  vehicleTypeId: string;
  capacity: number;
  isPrimary: boolean;
}

interface ItineraryItem {
  day: number;
  title: string;
  description: string;
}

interface Location {
  name: string;
  description: string | null;
  latitude: number;
  longitude: number;
  day: number | null;
}

interface Service {
  serviceId: string;
  details: string | null;
}

interface Availability {
  startDate: string;
  endDate: string;
  availableSpots: number;
}

interface TourFormData {
  title: string;
  description: string;
  summary: string;
  duration: number;
  maxGroupSize: number;
  minGroupSize: number;
  difficulty: string;
  price: number;
  pricePerGuest?: number;
  discountPrice: number | null;
  featured: boolean;
  accommodation_details: string;
  regions: string[];
  vehicles: Vehicle[];
  itinerary: ItineraryItem[];
  locations: Location[];
  includedServices: Service[];
  excludedServices: Service[];
  availability: Availability[];
  images: Image[];
}

interface ServiceCategory {
  id: string;
  name: string;
  services: {
    id: string;
    name: string;
    description: string;
  }[];
}

const TourForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [regions, setRegions] = useState<Region[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>(
    []
  );
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    basicInfo: true,
    pricing: true,
    images: true,
    regions: true,
    vehicles: true,
    itinerary: true,
    locations: true,
    services: true,
    availability: true,
  });

  const [formData, setFormData] = useState<TourFormData>({
    title: "",
    description: "",
    summary: "",
    duration: 1,
    maxGroupSize: 20,
    minGroupSize: 1,
    difficulty: "medium",
    price: 0,
    discountPrice: null,
    featured: false,
    accommodation_details: "",
    regions: [],
    vehicles: [],
    itinerary: [],
    locations: [],
    includedServices: [],
    excludedServices: [],
    availability: [],
    images: [],
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const fetchTourData = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch regions, vehicle types, and service categories in parallel
      const [regionsRes, vehicleTypesRes, serviceCategoriesRes] =
        await Promise.all([
          api.get("/tours/regions"),
          api.get("/tours/vehicle-types"),
          api.get("/tours/service-categories"),
        ]);

      setRegions(regionsRes.data.data.regions);
      setVehicleTypes(vehicleTypesRes.data.data.vehicleTypes);
      setServiceCategories(serviceCategoriesRes.data.data.categories);

      // If editing, fetch the tour data
      if (id) {
        const tourRes = await api.get(`/tours/${id}`);
        const tour = tourRes.data.data.tour;

        setFormData({
          title: tour.title,
          description: tour.description,
          summary: tour.summary,
          duration: tour.duration,
          maxGroupSize: tour.max_group_size || tour.maxGroupSize,
          minGroupSize: tour.min_group_size || tour.minGroupSize,
          difficulty: tour.difficulty,
          price: tour.price,
          discountPrice: tour.discountPrice,
          featured: tour.featured,
          accommodation_details: tour.accommodation_details,
          regions: tour.regions.map((r: any) => r.id),
          vehicles: tour.vehicles.map((v: any) => ({
            vehicleTypeId: v.vehicle_type_id || v.vehicleTypeId,
            capacity: v.capacity,
            isPrimary: v.is_primary || v.isPrimary,
          })),
          itinerary: tour.itinerary.map((i: any) => ({
            day: i.day,
            title: i.title,
            description: i.description,
          })),
          locations: tour.locations.map((l: any) => ({
            name: l.name,
            description: l.description,
            latitude: l.latitude,
            longitude: l.longitude,
            day: l.day,
          })),
          includedServices: tour.includedServices.map((s: any) => ({
            serviceId: s.id,
            details: s.details,
          })),
          excludedServices: tour.excludedServices.map((s: any) => ({
            serviceId: s.id,
            details: s.details,
          })),
          availability: tour.availability.map((a: any) => ({
            startDate: a.startDate.split("T")[0],
            endDate: a.endDate.split("T")[0],
            availableSpots: a.availableSpots,
          })),
          images: tour.images.map((img: any) => ({
            id: img.id,
            image_path: img.image_path, // Changed from imagePath to image_path
            is_cover: img.is_cover, // Changed from isCover to is_cover
          })),
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch tour data");
      toast.error(err.response?.data?.message || "Failed to fetch tour data");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTourData();
  }, [fetchTourData]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const handleRegionChange = (regionId: string) => {
    setFormData((prev) => {
      const newRegions = prev.regions.includes(regionId)
        ? prev.regions.filter((id) => id !== regionId)
        : [...prev.regions, regionId];
      return { ...prev, regions: newRegions };
    });
  };

  const handleVehicleChange = (index: number, field: string, value: any) => {
    setFormData((prev) => {
      const newVehicles = [...prev.vehicles];
      newVehicles[index] = {
        ...newVehicles[index],
        [field]: value,
      };
      return { ...prev, vehicles: newVehicles };
    });
  };

  const addVehicle = () => {
    if (vehicleTypes.length === 0) return;

    setFormData((prev) => ({
      ...prev,
      vehicles: [
        ...prev.vehicles,
        {
          vehicleTypeId: vehicleTypes[0].id,
          capacity: 4,
          isPrimary: prev.vehicles.length === 0,
        },
      ],
    }));
  };

  const removeVehicle = (index: number) => {
    setFormData((prev) => {
      const newVehicles = [...prev.vehicles];
      newVehicles.splice(index, 1);

      // If we removed the primary vehicle and there are others left, make the first one primary
      if (newVehicles.length > 0 && !newVehicles.some((v) => v.isPrimary)) {
        newVehicles[0].isPrimary = true;
      }

      return { ...prev, vehicles: newVehicles };
    });
  };

  const handleItineraryChange = (
    index: number,
    field: string,
    value: string
  ) => {
    setFormData((prev) => {
      const newItinerary = [...prev.itinerary];
      newItinerary[index] = { ...newItinerary[index], [field]: value };
      return { ...prev, itinerary: newItinerary };
    });
  };

  const addItineraryItem = () => {
    setFormData((prev) => ({
      ...prev,
      itinerary: [
        ...prev.itinerary,
        {
          day:
            prev.itinerary.length > 0
              ? Math.max(...prev.itinerary.map((i) => i.day)) + 1
              : 1,
          title: "",
          description: "",
        },
      ],
    }));
  };

  const removeItineraryItem = (index: number) => {
    setFormData((prev) => {
      const newItinerary = [...prev.itinerary];
      newItinerary.splice(index, 1);
      return { ...prev, itinerary: newItinerary };
    });
  };

  const handleLocationChange = (
    index: number,
    field: string,
    value: string | number | null
  ) => {
    setFormData((prev) => {
      const newLocations = [...prev.locations];
      newLocations[index] = { ...newLocations[index], [field]: value };
      return { ...prev, locations: newLocations };
    });
  };

  const addLocation = () => {
    setFormData((prev) => ({
      ...prev,
      locations: [
        ...prev.locations,
        {
          name: "",
          description: null,
          latitude: 0,
          longitude: 0,
          day: null,
        },
      ],
    }));
  };

  const removeLocation = (index: number) => {
    setFormData((prev) => {
      const newLocations = [...prev.locations];
      newLocations.splice(index, 1);
      return { ...prev, locations: newLocations };
    });
  };

  const handleServiceChange = (
    type: "includedServices" | "excludedServices",
    index: number,
    field: string,
    value: string | null
  ) => {
    setFormData((prev) => {
      const newServices = [...prev[type]];
      newServices[index] = { ...newServices[index], [field]: value };
      return { ...prev, [type]: newServices };
    });
  };

  const addService = (type: "includedServices" | "excludedServices") => {
    if (
      serviceCategories.length === 0 ||
      serviceCategories[0].services.length === 0
    )
      return;

    setFormData((prev) => ({
      ...prev,
      [type]: [
        ...prev[type],
        {
          serviceId: serviceCategories[0].services[0].id,
          details: null,
        },
      ],
    }));
  };

  const removeService = (
    type: "includedServices" | "excludedServices",
    index: number
  ) => {
    setFormData((prev) => {
      const newServices = [...prev[type]];
      newServices.splice(index, 1);
      return { ...prev, [type]: newServices };
    });
  };

  const handleAvailabilityChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    setFormData((prev) => {
      const newAvailability = [...prev.availability];
      newAvailability[index] = { ...newAvailability[index], [field]: value };
      return { ...prev, availability: newAvailability };
    });
  };

  const addAvailability = () => {
    const today = new Date().toISOString().split("T")[0];
    setFormData((prev) => ({
      ...prev,
      availability: [
        ...prev.availability,
        {
          startDate: today,
          endDate: today,
          availableSpots: 10,
        },
      ],
    }));
  };

  const removeAvailability = (index: number) => {
    setFormData((prev) => {
      const newAvailability = [...prev.availability];
      newAvailability.splice(index, 1);
      return { ...prev, availability: newAvailability };
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      image_path: URL.createObjectURL(file),
      is_cover: formData.images.length === 0, // First image is cover by default
    }));

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));
  };

  const removeImage = async (index: number) => {
    const image = formData.images[index];

    // If this is an existing image (has ID), we need to delete it from the server
    if (image.id && id) {
      try {
        await api.delete(`/tours/images/${image.id}`);
      } catch (err) {
        toast.error("Failed to delete image from server");
        return;
      }
    }

    setFormData((prev) => {
      const newImages = [...prev.images];
      newImages.splice(index, 1);

      // If we removed the cover image and there are other images left, make the first one cover
      if (image.is_cover && newImages.length > 0) {
        newImages[0].is_cover = true;
      }

      return { ...prev, images: newImages };
    });
  };

  const setCoverImage = (index: number) => {
    setFormData((prev) => {
      const newImages = prev.images.map((img, i) => ({
        ...img,
        is_cover: i === index,
      }));
      return { ...prev, images: newImages };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Calculate price per guest if not provided
      const pricePerGuest = formData.price / (formData.minGroupSize || 1);

      const tourData = {
        title: formData.title,
        description: formData.description,
        summary: formData.summary,
        duration: formData.duration,
        maxGroupSize: formData.maxGroupSize,
        minGroupSize: formData.minGroupSize,
        difficulty: formData.difficulty,
        price: formData.price,
        pricePerGuest,
        discountPrice: formData.discountPrice,
        featured: formData.featured,
        accommodation_details: formData.accommodation_details,
        regions: formData.regions,
        vehicles: formData.vehicles,
        itinerary: formData.itinerary,
        locations: formData.locations,
        includedServices: formData.includedServices,
        excludedServices: formData.excludedServices,
        availability: formData.availability,
      };

      let tourId = id;

      // Create or update the tour
      if (id) {
        await api.patch(`/tours/${id}`, tourData);
        toast.success("Tour updated successfully");
      } else {
        const response = await api.post("/tours", tourData);
        tourId = response.data.data.tour.id;
        toast.success("Tour created successfully");
      }

      // Upload new images if there are any
      if (tourId) {
        const newImages = formData.images.filter((img) => img.file);
        if (newImages.length > 0) {
          const formDataImages = new FormData();
          newImages.forEach((img) => {
            if (img.file) {
              formDataImages.append("images", img.file);
            }
          });

          await api.post(`/tours/${tourId}/images`, formDataImages, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        }

        // Set cover image if needed
        const coverImage = formData.images.find((img) => img.is_cover);
        if (coverImage && coverImage.id) {
          await api.patch(`/tours/${tourId}/images/${coverImage.id}/cover`);
        }
      }

      navigate("/admin/tours");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save tour");
      toast.error(err.response?.data?.message || "Failed to save tour");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse bg-white rounded-lg shadow p-6">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
              ))}
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#8B6B3D]">
            {id ? "Edit Tour" : "Create New Tour"}
          </h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 text-red-700 rounded">
            <p>{error}</p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow rounded-lg overflow-hidden"
        >
          {/* Basic Information Section */}
          <div className="border-b border-gray-200">
            <button
              type="button"
              className="flex items-center justify-between w-full px-6 py-4 text-left font-medium text-gray-700 focus:outline-none"
              onClick={() => toggleSection("basicInfo")}
            >
              <span className="flex items-center">
                <FiEdit2 className="mr-2" />
                Basic Information
              </span>
              {expandedSections.basicInfo ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            {expandedSections.basicInfo && (
              <div className="px-6 py-4 space-y-4">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Tour Title*
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#8B6B3D] focus:border-[#8B6B3D]"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="summary"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Short Summary*
                  </label>
                  <textarea
                    id="summary"
                    name="summary"
                    value={formData.summary}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#8B6B3D] focus:border-[#8B6B3D]"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Detailed Description*
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#8B6B3D] focus:border-[#8B6B3D]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor="duration"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Duration (days)*
                    </label>
                    <input
                      type="number"
                      id="duration"
                      name="duration"
                      min="1"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#8B6B3D] focus:border-[#8B6B3D]"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="maxGroupSize"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Max Group Size*
                    </label>
                    <input
                      type="number"
                      id="maxGroupSize"
                      name="maxGroupSize"
                      min="1"
                      value={formData.maxGroupSize}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#8B6B3D] focus:border-[#8B6B3D]"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="minGroupSize"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Min Group Size*
                    </label>
                    <input
                      type="number"
                      id="minGroupSize"
                      name="minGroupSize"
                      min="1"
                      value={formData.minGroupSize}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#8B6B3D] focus:border-[#8B6B3D]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="difficulty"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Difficulty Level*
                  </label>
                  <select
                    id="difficulty"
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#8B6B3D] focus:border-[#8B6B3D]"
                    required
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="difficult">Difficult</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="accommodationDetails"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Accommodation Details
                  </label>
                  <textarea
                    title="Accommodation"
                    id="accommodation_details"
                    name="accommodation_details" // This should match the state property
                    value={formData.accommodation_details}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#8B6B3D] focus:border-[#8B6B3D]"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-[#8B6B3D] focus:ring-[#8B6B3D] border-gray-300 rounded"
                  />
                  <label
                    htmlFor="featured"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Featured Tour
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Pricing Section */}
          <div className="border-b border-gray-200">
            <button
              type="button"
              className="flex items-center justify-between w-full px-6 py-4 text-left font-medium text-gray-700 focus:outline-none"
              onClick={() => toggleSection("pricing")}
            >
              <span className="flex items-center">
                <FiDollarSign className="mr-2" />
                Pricing
              </span>
              {expandedSections.pricing ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            {expandedSections.pricing && (
              <div className="px-6 py-4 space-y-4">
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Base Price (USD)*
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#8B6B3D] focus:border-[#8B6B3D]"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="discountPrice"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Discount Price (USD) - Optional
                  </label>
                  <input
                    type="number"
                    id="discountPrice"
                    name="discountPrice"
                    min="0"
                    step="0.01"
                    value={formData.discountPrice || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#8B6B3D] focus:border-[#8B6B3D]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Images Section */}
          <div className="border-b border-gray-200">
            <button
              type="button"
              className="flex items-center justify-between w-full px-6 py-4 text-left font-medium text-gray-700 focus:outline-none"
              onClick={() => toggleSection("images")}
            >
              <span className="flex items-center">
                <FiImage className="mr-2" />
                Images
              </span>
              {expandedSections.images ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            {expandedSections.images && (
              <div className="px-6 py-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Images (Max 10)
                  </label>
                  <input
                    title="file"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#8B6B3D] file:text-white hover:file:bg-[#6B4F2D]"
                    disabled={formData.images.length >= 10}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    {formData.images.length} of 10 images uploaded
                  </p>
                </div>

                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image.image_path} // Changed from image.imagePath
                          alt={`Tour image ${index + 1}`}
                          className="w-full h-32 object-cover rounded-md"
                        />
                        {image.is_cover && ( // Changed from image.isCover
                          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                            <FiStar className="mr-1" /> Cover
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center space-x-2 transition-opacity rounded-md">
                          {!image.is_cover && (
                            <button
                              type="button"
                              onClick={() => setCoverImage(index)}
                              className="p-2 bg-white bg-opacity-80 rounded-full text-green-600 hover:bg-opacity-100"
                              title="Set as cover"
                            >
                              <FiStar />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="p-2 bg-white bg-opacity-80 rounded-full text-red-600 hover:bg-opacity-100"
                            title="Remove image"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Regions Section */}
          <div className="border-b border-gray-200">
            <button
              type="button"
              className="flex items-center justify-between w-full px-6 py-4 text-left font-medium text-gray-700 focus:outline-none"
              onClick={() => toggleSection("regions")}
            >
              <span className="flex items-center">
                <FiMapPin className="mr-2" />
                Regions
              </span>
              {expandedSections.regions ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            {expandedSections.regions && (
              <div className="px-6 py-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Regions*
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {regions.map((region) => (
                      <div key={region.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`region-${region.id}`}
                          checked={formData.regions.includes(region.id)}
                          onChange={() => handleRegionChange(region.id)}
                          className="h-4 w-4 text-[#8B6B3D] focus:ring-[#8B6B3D] border-gray-300 rounded"
                        />
                        <label
                          htmlFor={`region-${region.id}`}
                          className="ml-2 block text-sm text-gray-700"
                        >
                          {region.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Vehicles Section */}
          <div className="border-b border-gray-200">
            <button
              type="button"
              className="flex items-center justify-between w-full px-6 py-4 text-left font-medium text-gray-700 focus:outline-none"
              onClick={() => toggleSection("vehicles")}
            >
              <span className="flex items-center">
                <FiUsers className="mr-2" />
                Vehicles
              </span>
              {expandedSections.vehicles ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            {expandedSections.vehicles && (
              <div className="px-6 py-4 space-y-4">
                {formData.vehicles.map((vehicle, index) => (
                  <div key={index} className="border rounded-md p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Vehicle Type*
                        </label>
                        <select
                          title="vehicle"
                          value={vehicle.vehicleTypeId}
                          onChange={(e) =>
                            handleVehicleChange(
                              index,
                              "vehicleTypeId",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#8B6B3D] focus:border-[#8B6B3D]"
                          required
                        >
                          {vehicleTypes.map((vt) => (
                            <option key={vt.id} value={vt.id}>
                              {vt.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Capacity*
                        </label>
                        <input
                          title="number"
                          type="number"
                          min="1"
                          value={vehicle.capacity}
                          onChange={(e) =>
                            handleVehicleChange(
                              index,
                              "capacity",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#8B6B3D] focus:border-[#8B6B3D]"
                          required
                        />
                      </div>

                      <div className="flex items-end">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={`primary-${index}`}
                            checked={vehicle.isPrimary}
                            onChange={(e) =>
                              handleVehicleChange(
                                index,
                                "isPrimary",
                                e.target.checked
                              )
                            }
                            className="h-4 w-4 text-[#8B6B3D] focus:ring-[#8B6B3D] border-gray-300 rounded"
                          />
                          <label
                            htmlFor={`primary-${index}`}
                            className="ml-2 block text-sm text-gray-700"
                          >
                            Primary Vehicle
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeVehicle(index)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Remove Vehicle
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addVehicle}
                  className="flex items-center text-[#8B6B3D] hover:text-[#6B4F2D] text-sm font-medium"
                >
                  <FiPlus className="mr-1" /> Add Vehicle
                </button>
              </div>
            )}
          </div>

          {/* Itinerary Section */}
          <div className="border-b border-gray-200">
            <button
              type="button"
              className="flex items-center justify-between w-full px-6 py-4 text-left font-medium text-gray-700 focus:outline-none"
              onClick={() => toggleSection("itinerary")}
            >
              <span className="flex items-center">
                <FiCalendar className="mr-2" />
                Itinerary
              </span>
              {expandedSections.itinerary ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            {expandedSections.itinerary && (
              <div className="px-6 py-4 space-y-4">
                {formData.itinerary.map((item, index) => (
                  <div key={index} className="border rounded-md p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Day*
                        </label>
                        <input
                          title="number"
                          type="number"
                          min="1"
                          value={item.day}
                          onChange={(e) =>
                            handleItineraryChange(index, "day", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#8B6B3D] focus:border-[#8B6B3D]"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Title*
                        </label>
                        <input
                          title="text"
                          type="text"
                          value={item.title}
                          onChange={(e) =>
                            handleItineraryChange(
                              index,
                              "title",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#8B6B3D] focus:border-[#8B6B3D]"
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description*
                      </label>
                      <textarea
                        title="description"
                        value={item.description}
                        onChange={(e) =>
                          handleItineraryChange(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#8B6B3D] focus:border-[#8B6B3D]"
                        required
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeItineraryItem(index)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Remove Day
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addItineraryItem}
                  className="flex items-center text-[#8B6B3D] hover:text-[#6B4F2D] text-sm font-medium"
                >
                  <FiPlus className="mr-1" /> Add Itinerary Day
                </button>
              </div>
            )}
          </div>

          {/* Locations Section */}
          <div className="border-b border-gray-200">
            <button
              type="button"
              className="flex items-center justify-between w-full px-6 py-4 text-left font-medium text-gray-700 focus:outline-none"
              onClick={() => toggleSection("locations")}
            >
              <span className="flex items-center">
                <FiMapPin className="mr-2" />
                Locations
              </span>
              {expandedSections.locations ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            {expandedSections.locations && (
              <div className="px-6 py-4 space-y-4">
                {formData.locations.map((location, index) => (
                  <div key={index} className="border rounded-md p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Location Name*
                        </label>
                        <input
                          title="text"
                          type="text"
                          value={location.name}
                          onChange={(e) =>
                            handleLocationChange(index, "name", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#8B6B3D] focus:border-[#8B6B3D]"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Day (optional)
                        </label>
                        <input
                          title="number"
                          type="number"
                          min="1"
                          value={location.day || ""}
                          onChange={(e) =>
                            handleLocationChange(
                              index,
                              "day",
                              e.target.value ? parseInt(e.target.value) : null
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#8B6B3D] focus:border-[#8B6B3D]"
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        title="description"
                        value={location.description || ""}
                        onChange={(e) =>
                          handleLocationChange(
                            index,
                            "description",
                            e.target.value || null
                          )
                        }
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#8B6B3D] focus:border-[#8B6B3D]"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Latitude*
                        </label>
                        <input
                          title="number"
                          type="number"
                          step="any"
                          value={location.latitude}
                          onChange={(e) =>
                            handleLocationChange(
                              index,
                              "latitude",
                              parseFloat(e.target.value)
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#8B6B3D] focus:border-[#8B6B3D]"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Longitude*
                        </label>
                        <input
                          title="number"
                          type="number"
                          step="any"
                          value={location.longitude}
                          onChange={(e) =>
                            handleLocationChange(
                              index,
                              "longitude",
                              parseFloat(e.target.value)
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#8B6B3D] focus:border-[#8B6B3D]"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeLocation(index)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Remove Location
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addLocation}
                  className="flex items-center text-[#8B6B3D] hover:text-[#6B4F2D] text-sm font-medium"
                >
                  <FiPlus className="mr-1" /> Add Location
                </button>
              </div>
            )}
          </div>

          {/* Services Section */}
          <div className="border-b border-gray-200">
            <button
              type="button"
              className="flex items-center justify-between w-full px-6 py-4 text-left font-medium text-gray-700 focus:outline-none"
              onClick={() => toggleSection("services")}
            >
              <span className="flex items-center">
                <FiCheck className="mr-2" />
                Services
              </span>
              {expandedSections.services ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            {expandedSections.services && (
              <div className="px-6 py-4 space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Included Services
                  </h3>
                  {formData.includedServices.map((service, index) => (
                    <div key={index} className="border rounded-md p-4 mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Service*
                          </label>
                          <select
                            title="number"
                            value={service.serviceId}
                            onChange={(e) =>
                              handleServiceChange(
                                "includedServices",
                                index,
                                "serviceId",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#8B6B3D] focus:border-[#8B6B3D]"
                            required
                          >
                            {serviceCategories.map((category) => (
                              <optgroup key={category.id} label={category.name}>
                                {category.services.map((s) => (
                                  <option key={s.id} value={s.id}>
                                    {s.name}
                                  </option>
                                ))}
                              </optgroup>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Details (optional)
                          </label>
                          <input
                            title="text"
                            type="text"
                            value={service.details || ""}
                            onChange={(e) =>
                              handleServiceChange(
                                "includedServices",
                                index,
                                "details",
                                e.target.value || null
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#8B6B3D] focus:border-[#8B6B3D]"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() =>
                            removeService("includedServices", index)
                          }
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Remove Service
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => addService("includedServices")}
                    className="flex items-center text-[#8B6B3D] hover:text-[#6B4F2D] text-sm font-medium"
                  >
                    <FiPlus className="mr-1" /> Add Included Service
                  </button>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Excluded Services
                  </h3>
                  {formData.excludedServices.map((service, index) => (
                    <div key={index} className="border rounded-md p-4 mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Service*
                          </label>
                          <select
                            title="service"
                            value={service.serviceId}
                            onChange={(e) =>
                              handleServiceChange(
                                "excludedServices",
                                index,
                                "serviceId",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#8B6B3D] focus:border-[#8B6B3D]"
                            required
                          >
                            {serviceCategories.map((category) => (
                              <optgroup key={category.id} label={category.name}>
                                {category.services.map((s) => (
                                  <option key={s.id} value={s.id}>
                                    {s.name}
                                  </option>
                                ))}
                              </optgroup>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Details (optional)
                          </label>
                          <input
                            title="text"
                            type="text"
                            value={service.details || ""}
                            onChange={(e) =>
                              handleServiceChange(
                                "excludedServices",
                                index,
                                "details",
                                e.target.value || null
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#8B6B3D] focus:border-[#8B6B3D]"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() =>
                            removeService("excludedServices", index)
                          }
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Remove Service
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => addService("excludedServices")}
                    className="flex items-center text-[#8B6B3D] hover:text-[#6B4F2D] text-sm font-medium"
                  >
                    <FiPlus className="mr-1" /> Add Excluded Service
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Availability Section */}
          <div className="border-b border-gray-200">
            <button
              type="button"
              className="flex items-center justify-between w-full px-6 py-4 text-left font-medium text-gray-700 focus:outline-none"
              onClick={() => toggleSection("availability")}
            >
              <span className="flex items-center">
                <FiCalendar className="mr-2" />
                Availability
              </span>
              {expandedSections.availability ? (
                <FiChevronUp />
              ) : (
                <FiChevronDown />
              )}
            </button>
            {expandedSections.availability && (
              <div className="px-6 py-4 space-y-4">
                {formData.availability.map((date, index) => (
                  <div key={index} className="border rounded-md p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Start Date*
                        </label>
                        <input
                          title="date"
                          type="date"
                          value={date.startDate}
                          onChange={(e) =>
                            handleAvailabilityChange(
                              index,
                              "startDate",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#8B6B3D] focus:border-[#8B6B3D]"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          End Date*
                        </label>
                        <input
                          title="date"
                          type="date"
                          value={date.endDate}
                          onChange={(e) =>
                            handleAvailabilityChange(
                              index,
                              "endDate",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#8B6B3D] focus:border-[#8B6B3D]"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Available Spots*
                        </label>
                        <input
                          title="number"
                          type="number"
                          min="1"
                          value={date.availableSpots}
                          onChange={(e) =>
                            handleAvailabilityChange(
                              index,
                              "availableSpots",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#8B6B3D] focus:border-[#8B6B3D]"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeAvailability(index)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Remove Date Range
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addAvailability}
                  className="flex items-center text-[#8B6B3D] hover:text-[#6B4F2D] text-sm font-medium"
                >
                  <FiPlus className="mr-1" /> Add Availability
                </button>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate("/admin/tours")}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B6B3D]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#8B6B3D] hover:bg-[#6B4F2D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B6B3D] disabled:opacity-70"
            >
              {saving ? "Saving..." : "Save Tour"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default TourForm;
