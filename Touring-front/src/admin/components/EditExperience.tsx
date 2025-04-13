/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiImage, FiUpload, FiTrash2, FiX, FiPlus } from "react-icons/fi";
import { toast } from "react-hot-toast";
import api from "../../api/axios";
import AdminLayout from "../Adminlayout";

interface Category {
  id: string;
  name: string;
}

interface Image {
  id: string;
  image_path: string;
  is_cover: boolean;
}

interface Section {
  id: string;
  title: string;
  description: string;
  image_path: string | null;
  order: number;
  existing_image?: string; // Track existing image paths separately
}

const EditExperience = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [existingImages, setExistingImages] = useState<Image[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<
    { url: string; isCover: boolean }[]
  >([]);
  const [coverImageId, setCoverImageId] = useState<string | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [newSectionImages, setNewSectionImages] = useState<{
    [key: number]: File;
  }>({});

  const [formData, setFormData] = useState({
    title: "",
    category_id: "",
    short_description: "",
    description: "",
    duration: "",
    price: "",
    discount_price: "",
    min_group_size: "1",
    max_group_size: "10",
    difficulty: "medium",
    is_featured: false,
    is_active: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const experienceResponse = await api.get(`/experiences/${id}`);
        const experience = experienceResponse.data.data.experience;

        const categoriesResponse = await api.get("/experiences/categories");
        setCategories(categoriesResponse.data.data.categories);

        setFormData({
          title: experience.title,
          category_id: experience.category_id,
          short_description: experience.short_description,
          description: experience.description,
          duration: experience.duration,
          price: experience.price,
          discount_price: experience.discount_price || "",
          min_group_size: experience.min_group_size.toString(),
          max_group_size: experience.max_group_size.toString(),
          difficulty: experience.difficulty,
          is_featured: experience.is_featured,
          is_active: experience.is_active,
        });

        setExistingImages(experience.images);
        const coverImage = experience.images.find((img: any) => img.is_cover);
        if (coverImage) {
          setCoverImageId(coverImage.id);
        }

        // Initialize sections with existing_image for tracking
        setSections(
            experience.sections?.map((section: any) => ({
              ...section,
              id: `existing-${section.id}`, // Prefix existing sections
              existing_image: section.image_path,
            })) || []
          );

        setLoading(false);
      } catch (error) {
        console.error("Error fetching experience:", error);
        toast.error("Failed to load experience data");
        navigate("/admin/experience");
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    setNewImages((prev) => [...prev, ...files]);

    // Create previews
    const newPreviews = files.map((file) => ({
      url: URL.createObjectURL(file),
      isCover: false,
    }));
    setImagePreviews((prev) => [...prev, ...newPreviews]);

    // If no cover image is set yet, set the first one as cover
    if (
      existingImages.length === 0 &&
      imagePreviews.length === 0 &&
      newPreviews.length > 0
    ) {
      setImagePreviews((prev) => {
        const updated = [...prev];
        if (updated.length > 0) updated[0].isCover = true;
        return updated;
      });
    }
  };

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = async (imageId: string) => {
    try {
      await api.delete(`/experiences/images/${imageId}`);
      setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
      if (coverImageId === imageId) {
        setCoverImageId(null);
      }
      toast.success("Image removed successfully");
    } catch (error) {
      console.error("Error removing image:", error);
      toast.error("Failed to remove image");
    }
  };

  const setCoverImage = (id: string) => {
    setCoverImageId(id);
  };

  const handleSectionChange = (
    sectionId: string,
    field: keyof Section,
    value: string
  ) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId ? { ...section, [field]: value } : section
      )
    );
  };

  const handleSectionImageUpload = (
    sectionIndex: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
  
    setNewSectionImages((prev) => ({
      ...prev,
      [sectionIndex]: file,
    }));
  
    const previewUrl = URL.createObjectURL(file);
    setSections((prev) =>
      prev.map((section, idx) =>
        idx === sectionIndex
          ? {
              ...section,
              image_path: previewUrl,
              existing_image: undefined,
            }
          : section
      )
    );
  };

  const removeSectionImage = (sectionIndex: number) => {
    setSections((prev) =>
      prev.map((section, idx) =>
        idx === sectionIndex
          ? {
              ...section,
              image_path: null,
              existing_image: undefined,
            }
          : section
      )
    );

    const updatedNewImages = { ...newSectionImages };
    delete updatedNewImages[sectionIndex];
    setNewSectionImages(updatedNewImages);
  };

  const addSection = () => {
    if (sections.length >= 5) {
      toast.error("Maximum of 5 sections allowed");
      return;
    }
    setSections((prev) => [
      ...prev,
      {
        id: `new-${Date.now()}`,
        title: "",
        description: "",
        image_path: null,
        order: prev.length + 1,
      },
    ]);
  };

  const removeSection = (sectionId: string) => {
    if (sections.length <= 1) {
      toast.error("At least one section is required");
      return;
    }

    // Remove any new image associated with this section
    const sectionIndex = sections.findIndex((s) => s.id === sectionId);
    if (sectionIndex !== -1) {
      const updatedNewImages = { ...newSectionImages };
      delete updatedNewImages[sectionIndex];
      setNewSectionImages(updatedNewImages);
    }

    setSections((prev) => prev.filter((section) => section.id !== sectionId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
  
    try {
      const formDataToSend = new FormData();
  
      // Append all form data
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formDataToSend.append(key, value.toString());
        }
      });
  
      // Append new images
      newImages.forEach((file, index) => {
        formDataToSend.append("images", file);
        if (imagePreviews[index]?.isCover) {
          formDataToSend.append("cover_image_index", index.toString());
        }
      });
  
      // Append existing cover image if no new cover is selected
      if (coverImageId && newImages.length === 0) {
        formDataToSend.append("cover_image_id", coverImageId);
      }
  
      // Append sections data
      sections.forEach((section, index) => {
        formDataToSend.append(`sections[${index}][id]`, section.id);
        formDataToSend.append(`sections[${index}][title]`, section.title);
        formDataToSend.append(`sections[${index}][description]`, section.description);
        formDataToSend.append(`sections[${index}][order]`, section.order.toString());
  
        // Handle section images
        if (newSectionImages[index]) {
          formDataToSend.append(`section_images[${index}]`, newSectionImages[index]);
        } else if (section.existing_image) {
          formDataToSend.append(`sections[${index}][existing_image]`, section.existing_image);
        }
      });
  
      await api.patch(`/experiences/${id}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      toast.success("Experience updated successfully!");
      navigate("/admin/experience");
    } catch (error: any) {
      console.error("Error updating experience:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update experience"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse bg-white shadow rounded-lg p-6">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                {[...Array(5)].map((_, i) => (
                  <div key={i}>
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
              <div className="space-y-6">
                {[...Array(5)].map((_, i) => (
                  <div key={i}>
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-[#8B6B3D]">Edit Experience</h1>
          <button
            onClick={() => navigate("/admin/experience")}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Back to Experiences
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow rounded-lg p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-[#8B6B3D] border-b pb-2">
                Basic Information
              </h2>

              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Experience Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#8B6B3D] focus:border-[#8B6B3D]"
                />
              </div>

              <div>
                <label
                  htmlFor="category_id"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Category *
                </label>
                <select
                  id="category_id"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#8B6B3D] focus:border-[#8B6B3D]"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="short_description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Short Description *
                </label>
                <textarea
                  id="short_description"
                  name="short_description"
                  value={formData.short_description}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#8B6B3D] focus:border-[#8B6B3D]"
                />
                <p className="mt-1 text-xs text-gray-500">
                  This will appear in listings and cards
                </p>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#8B6B3D] focus:border-[#8B6B3D]"
                />
              </div>
            </div>

            {/* Pricing & Details */}
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-[#8B6B3D] border-b pb-2">
                Pricing & Details
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Price (per person) *
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#8B6B3D] focus:border-[#8B6B3D]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="discount_price"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Discount Price (optional)
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      id="discount_price"
                      name="discount_price"
                      value={formData.discount_price}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#8B6B3D] focus:border-[#8B6B3D]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="min_group_size"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Min Group Size *
                  </label>
                  <input
                    type="number"
                    id="min_group_size"
                    name="min_group_size"
                    value={formData.min_group_size}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#8B6B3D] focus:border-[#8B6B3D]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="max_group_size"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Max Group Size *
                  </label>
                  <input
                    type="number"
                    id="max_group_size"
                    name="max_group_size"
                    value={formData.max_group_size}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#8B6B3D] focus:border-[#8B6B3D]"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="duration"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Duration *
                </label>
                <input
                  type="text"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. 2 hours, 1 day"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#8B6B3D] focus:border-[#8B6B3D]"
                />
              </div>

              <div>
                <label
                  htmlFor="difficulty"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Difficulty Level *
                </label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#8B6B3D] focus:border-[#8B6B3D]"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_featured"
                    name="is_featured"
                    checked={formData.is_featured}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-[#8B6B3D] focus:ring-[#8B6B3D] border-gray-300 rounded"
                  />
                  <label
                    htmlFor="is_featured"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Featured Experience
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_active"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-[#8B6B3D] focus:ring-[#8B6B3D] border-gray-300 rounded"
                  />
                  <label
                    htmlFor="is_active"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Active
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-[#8B6B3D] border-b pb-2 mb-4">
              Images
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload New Images
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <FiImage className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-[#8B6B3D] hover:text-[#6B4F2D] focus-within:outline-none"
                    >
                      <span>Upload files</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            </div>

            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Existing Images
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {existingImages.map((img) => (
                    <div key={img.id} className="relative group">
                      <div className="h-32 w-full rounded-md overflow-hidden">
                        <img
                          src={img.image_path}
                          alt="Preview"
                          className={`h-full w-full object-cover ${
                            coverImageId === img.id
                              ? "border-2 border-[#8B6B3D]"
                              : ""
                          }`}
                        />
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center rounded-md transition-all duration-200">
                        <div className="opacity-0 group-hover:opacity-100 flex space-x-2">
                          {coverImageId !== img.id && (
                            <button
                              type="button"
                              onClick={() => setCoverImage(img.id)}
                              className="p-1 bg-white rounded-full text-[#8B6B3D] hover:bg-[#8B6B3D] hover:text-white"
                              title="Set as cover"
                            >
                              <FiUpload className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => removeExistingImage(img.id)}
                            className="p-1 bg-white rounded-full text-red-600 hover:bg-red-600 hover:text-white"
                            title="Remove image"
                          >
                            <FiTrash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      {coverImageId === img.id && (
                        <span className="absolute top-1 left-1 bg-[#8B6B3D] text-white text-xs px-2 py-1 rounded">
                          Cover
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Images */}
            {imagePreviews.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  New Images
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {imagePreviews.map((img, index) => (
                    <div key={index} className="relative group">
                      <div className="h-32 w-full rounded-md overflow-hidden">
                        <img
                          src={img.url}
                          alt="Preview"
                          className={`h-full w-full object-cover ${
                            img.isCover ? "border-2 border-[#8B6B3D]" : ""
                          }`}
                        />
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center rounded-md transition-all duration-200">
                        <div className="opacity-0 group-hover:opacity-100 flex space-x-2">
                          {!img.isCover && (
                            <button
                              type="button"
                              onClick={() => {
                                setImagePreviews((prev) =>
                                  prev.map((item, i) => ({
                                    ...item,
                                    isCover: i === index,
                                  }))
                                );
                              }}
                              className="p-1 bg-white rounded-full text-[#8B6B3D] hover:bg-[#8B6B3D] hover:text-white"
                              title="Set as cover"
                            >
                              <FiUpload className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => removeNewImage(index)}
                            className="p-1 bg-white rounded-full text-red-600 hover:bg-red-600 hover:text-white"
                            title="Remove image"
                          >
                            <FiTrash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      {img.isCover && (
                        <span className="absolute top-1 left-1 bg-[#8B6B3D] text-white text-xs px-2 py-1 rounded">
                          Cover
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Experience Sections */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-[#8B6B3D]">
                Experience Sections
              </h2>
              <button
                type="button"
                onClick={addSection}
                disabled={sections.length >= 5}
                className="flex items-center text-sm text-[#8B6B3D] hover:text-[#6B4F2D] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiPlus className="mr-1" /> Add Section
              </button>
            </div>

            {sections.map((section, index) => (
              <div
                key={section.id}
                className="mb-6 p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium text-gray-700">
                    Section {index + 1}
                  </h3>
                  {sections.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSection(section.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiX />
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor={`section-title-${section.id}`}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Title
                    </label>
                    <input
                      type="text"
                      id={`section-title-${section.id}`}
                      value={section.title}
                      onChange={(e) =>
                        handleSectionChange(section.id, "title", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#8B6B3D] focus:border-[#8B6B3D]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor={`section-description-${section.id}`}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Description
                    </label>
                    <textarea
                      id={`section-description-${section.id}`}
                      value={section.description}
                      onChange={(e) =>
                        handleSectionChange(
                          section.id,
                          "description",
                          e.target.value
                        )
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#8B6B3D] focus:border-[#8B6B3D]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Section Image (Optional)
                    </label>
                    {section.image_path || section.existing_image ? (
                      <div className="relative group">
                        <div className="h-32 w-full rounded-md overflow-hidden">
                          <img
                            src={section.image_path || section.existing_image}
                            alt="Section preview"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeSectionImage(index)}
                          className="absolute top-2 right-2 p-1 bg-white rounded-full text-red-600 hover:bg-red-600 hover:text-white"
                          title="Remove image"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                          <FiImage className="mx-auto h-8 w-8 text-gray-400" />
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor={`section-image-${section.id}-${index}`}
                              className="relative cursor-pointer bg-white rounded-md font-medium text-[#8B6B3D] hover:text-[#6B4F2D] focus-within:outline-none"
                            >
                              <span>Upload image</span>
                              <input
                                id={`section-image-${section.id}-${index}`}
                                name={`section-image-${section.id}-${index}`}
                                type="file"
                                className="sr-only"
                                accept="image/*"
                                onChange={(e) =>
                                  handleSectionImageUpload(index, e)
                                }
                              />
                            </label>
                          </div>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 border-t pt-6">
            <button
              type="button"
              onClick={() => navigate("/admin/experience")}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B6B3D]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#8B6B3D] hover:bg-[#6B4F2D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B6B3D] ${
                saving ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default EditExperience;
