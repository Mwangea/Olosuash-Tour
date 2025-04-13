import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiImage, FiUpload, FiTrash2, FiPlus, FiMinus } from "react-icons/fi";
import { toast } from "react-hot-toast";
import api from "../../api/axios";
import AdminLayout from "../Adminlayout";

interface Category {
  id: string;
  name: string;
}

interface ImagePreview {
  id: string;
  file: File;
  preview: string;
  isCover: boolean;
}

interface Section {
  id: string;
  title: string;
  description: string;
  image?: File | null;
  imagePreview?: string | null;
}

const CreateExperience = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
  const [coverImageId, setCoverImageId] = useState<string | null>(null);
  const [sections, setSections] = useState<Section[]>([
    { id: "1", title: "", description: "", image: null, imagePreview: null },
  ]);

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

  const fetchCategories = async () => {
    try {
      const response = await api.get("/experiences/categories");
      setCategories(response.data.data.categories);
      if (response.data.data.categories.length > 0) {
        setFormData((prev) => ({
          ...prev,
          category_id: response.data.data.categories[0].id,
        }));
      }
    } catch (error) {
      toast.error("Failed to fetch categories");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

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
    const newPreviews = files.map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      preview: URL.createObjectURL(file),
      isCover: false,
    }));

    // If no cover image is set yet, set the first one as cover
    if (imagePreviews.length === 0 && newPreviews.length > 0) {
      newPreviews[0].isCover = true;
      setCoverImageId(newPreviews[0].id);
    }

    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (id: string) => {
    setImagePreviews((prev) => {
      const newPreviews = prev.filter((img) => img.id !== id);

      // If we're removing the cover image, set a new cover if available
      if (id === coverImageId && newPreviews.length > 0) {
        newPreviews[0].isCover = true;
        setCoverImageId(newPreviews[0].id);
      } else if (newPreviews.length === 0) {
        setCoverImageId(null);
      }

      return newPreviews;
    });
  };

  const setAsCover = (id: string) => {
    setImagePreviews((prev) =>
      prev.map((img) => ({
        ...img,
        isCover: img.id === id,
      }))
    );
    setCoverImageId(id);
  };

  const handleSectionChange = (
    id: string,
    field: keyof Section,
    value: string
  ) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === id ? { ...section, [field]: value } : section
      )
    );
  };

  const handleSectionImageUpload = (
    id: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];

    setSections((prev) =>
      prev.map((section) =>
        section.id === id
          ? {
              ...section,
              image: file,
              imagePreview: URL.createObjectURL(file),
            }
          : section
      )
    );
  };

  const removeSectionImage = (id: string) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === id
          ? { ...section, image: null, imagePreview: null }
          : section
      )
    );
  };

  const addSection = () => {
    if (sections.length >= 5) {
      toast.error("Maximum of 5 sections allowed");
      return;
    }
    setSections((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2, 9),
        title: "",
        description: "",
        image: null,
        imagePreview: null,
      },
    ]);
  };

  const removeSection = (id: string) => {
    if (sections.length <= 1) {
      toast.error("At least one section is required");
      return;
    }
    setSections((prev) => prev.filter((section) => section.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const formDataToSend = new FormData();
  
      // Append all form data
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formDataToSend.append(key, value.toString());
        }
      });
  
      // Append images
      imagePreviews.forEach((img) => {
        formDataToSend.append('images', img.file);
      });
  
      // Set cover image index
      const coverIndex = imagePreviews.findIndex(img => img.isCover);
      if (coverIndex >= 0) {
        formDataToSend.append('cover_image_index', coverIndex.toString());
      }
  
      // Append sections
      sections.forEach((section, index) => {
        formDataToSend.append(`section_title_${index + 1}`, section.title);
        formDataToSend.append(`section_description_${index + 1}`, section.description);
        if (section.image) {
          formDataToSend.append(`section_image_${index + 1}`, section.image);
        }
      });
  
      await api.post("/experiences", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      toast.success("Experience created successfully!");
      navigate("/admin/experience");
    } catch (error: unknown) {
      console.error("Full error:", error);
      
      interface ApiError {
        response?: {
          data?: {
            message?: string;
          };
        };
      }
      
      const apiError = error as ApiError;
      console.error("Error response:", apiError.response?.data);
      toast.error(
        apiError.response?.data?.message ||
        (error instanceof Error ? error.message : undefined) ||
        "Failed to create experience"
      );
    } finally {
      setLoading(false);
    }
  };

  // Clean up object URLs
  useEffect(() => {
    return () => {
      imagePreviews.forEach((img) => URL.revokeObjectURL(img.preview));
      sections.forEach((section) => {
        if (section.imagePreview) {
          URL.revokeObjectURL(section.imagePreview);
        }
      });
    };
  }, [imagePreviews, sections]);

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-[#8B6B3D]">
            Create New Experience
          </h1>
          <button
            onClick={() => navigate("/admin/experience")}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Back to Experiences
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
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
                Upload Images *
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

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {imagePreviews.map((img) => (
                  <div key={img.id} className="relative group">
                    <div className="h-32 w-full rounded-md overflow-hidden">
                      <img
                        src={img.preview}
                        alt="Preview"
                        className={`h-full w-full object-cover ${
                          img.isCover ? "border-2 border-[#8B6B3D]" : ""
                        }`}
                        onLoad={() => URL.revokeObjectURL(img.preview)}
                      />
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center rounded-md transition-all duration-200">
                      <div className="opacity-0 group-hover:opacity-100 flex space-x-2">
                        {!img.isCover && (
                          <button
                            type="button"
                            onClick={() => setAsCover(img.id)}
                            className="p-1 bg-white rounded-full text-[#8B6B3D] hover:bg-[#8B6B3D] hover:text-white"
                            title="Set as cover"
                          >
                            <FiUpload className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(img.id)}
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
                      <FiMinus />
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
                    {section.imagePreview ? (
                      <div className="relative group">
                        <div className="h-32 w-full rounded-md overflow-hidden">
                          <img
                            src={section.imagePreview}
                            alt="Section preview"
                            className="h-full w-full object-cover"
                            onLoad={() =>
                              section.imagePreview &&
                              URL.revokeObjectURL(section.imagePreview)
                            }
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeSectionImage(section.id)}
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
                              htmlFor={`section-image-${section.id}`}
                              className="relative cursor-pointer bg-white rounded-md font-medium text-[#8B6B3D] hover:text-[#6B4F2D] focus-within:outline-none"
                            >
                              <span>Upload image</span>
                              <input
                                id={`section-image-${section.id}`}
                                name={`section-image-${section.id}`}
                                type="file"
                                className="sr-only"
                                accept="image/*"
                                onChange={(e) =>
                                  handleSectionImageUpload(section.id, e)
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
              disabled={loading || imagePreviews.length === 0}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#8B6B3D] hover:bg-[#6B4F2D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B6B3D] ${
                loading || imagePreviews.length === 0
                  ? "opacity-70 cursor-not-allowed"
                  : ""
              }`}
            >
              {loading ? "Creating..." : "Create Experience"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default CreateExperience;