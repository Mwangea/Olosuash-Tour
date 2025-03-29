import React, { useState, useEffect } from 'react';
import { Trash2, Edit, Plus, X, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import adminApi, { HeroSlide } from '../../api/adminApi';
import AdminLayout from '../Adminlayout';

const AdminHero: React.FC = () => {
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [slideToDelete, setSlideToDelete] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState<Partial<HeroSlide>>({
    title: '',
    description: '',
    is_active: true,
    display_order: 0
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleAddNewSlide = () => {
    setCurrentSlide({
      title: '',
      description: '',
      is_active: true,
      display_order: 0
    });
    setImageFile(null);
    setImagePreview(null);
    setIsDialogOpen(true);
  };

  // Fetch hero slides
  const fetchHeroSlides = async () => {
    try {
      setIsLoading(true);
      const slides = await adminApi.getAllHeroSlides();
      setHeroSlides(slides);
      toast.success('Hero slides loaded successfully');
    } catch (error) {
      console.error('Failed to fetch hero slides', error);
      toast.error('Failed to load hero slides');
    } finally {
      setIsLoading(false);
    }
  };

  // Image change handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Validate file type
      const allowedTypes = [
        'image/jpeg', 
        'image/png', 
        'image/webp', 
        'image/gif', 
        'image/avif', 
        'image/tiff'
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Invalid file type. Allowed types: JPEG, PNG, WebP, GIF, AVIF, TIFF');
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }

      setImageFile(file);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // Create hero slide
  const createHeroSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imageFile) {
      toast.error('Please select an image');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', currentSlide.title || '');
      formData.append('description', currentSlide.description || '');
      formData.append('is_active', (currentSlide.is_active || true).toString());
      formData.append('display_order', (currentSlide.display_order || 0).toString());
      formData.append('hero_image', imageFile);

      const newSlide = await adminApi.createHeroSlide(formData);
      
      setHeroSlides(prev => [...prev, newSlide]);
      setIsDialogOpen(false);
      setImageFile(null);
      setImagePreview(null);
      toast.success('Hero slide created successfully');
    } catch (error) {
      console.error('Error creating hero slide', error);
      toast.error('Failed to create hero slide');
    }
  };

  // Prepare slide for editing
  const prepareEditSlide = (slide: HeroSlide) => {
    setCurrentSlide({
      id: slide.id,
      title: slide.title,
      description: slide.description,
      is_active: slide.is_active,
      display_order: slide.display_order
    });
    setImageFile(null);
    setImagePreview(slide.image_path || null);
    setIsDialogOpen(true);
  };

  // Edit hero slide
  const editHeroSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentSlide.id) {
      toast.error('No slide selected for editing');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', currentSlide.title || '');
      formData.append('description', currentSlide.description || '');
      formData.append('is_active', (currentSlide.is_active || true).toString());
      formData.append('display_order', (currentSlide.display_order || 0).toString());
      
      // Only append image if a new file is selected
      if (imageFile) {
        formData.append('hero_image', imageFile);
      }

      const updatedSlide = await adminApi.updateHeroSlide(currentSlide.id, formData);
      
      setHeroSlides(prev => 
        prev.map(slide => 
          slide.id === updatedSlide.id ? updatedSlide : slide
        )
      );
      setIsDialogOpen(false);
      setImageFile(null);
      setImagePreview(null);
      toast.success('Hero slide updated successfully');
    } catch (error) {
      console.error('Error updating hero slide', error);
      toast.error('Failed to update hero slide');
    }
  };

  // Delete hero slide
  const deleteHeroSlide = async () => {
    if (!slideToDelete) return;

    try {
      await adminApi.deleteHeroSlide(slideToDelete);
      setHeroSlides(prev => prev.filter(slide => slide.id !== slideToDelete));
      toast.success('Hero slide deleted successfully');
      setSlideToDelete(null);
    } catch (error) {
      console.error('Failed to delete hero slide', error);
      toast.error('Failed to delete hero slide');
      setSlideToDelete(null);
    }
  };

  // Fetch slides on component mount
  useEffect(() => {
    fetchHeroSlides();

    // Cleanup preview URL
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, []);

  return (
    <AdminLayout>
      <div className="bg-[#F5F5F5] min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <div className="md:flex md:items-center md:justify-between mb-8">
            <div className="min-w-0 flex-1">
              <h2 className="text-3xl font-bold leading-9 text-[#2D2B2A]">
                Olosaushi Tours Hero Section
              </h2>
            </div>
            <div className="mt-4 flex md:ml-4 md:mt-0">
              <button 
                onClick={handleAddNewSlide} 
                className="inline-flex items-center rounded-lg bg-[#8B4513] px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-[#6B3E23] transition-colors duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B4513]"
              >
                <Plus className="mr-2 h-5 w-5" /> Add New Slide
              </button>
            </div>
          </div>

          {/* Hero Slides List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <p className="col-span-full text-center text-[#2D2B2A] animate-pulse">
                Loading hero slides...
              </p>
            ) : heroSlides.length === 0 ? (
              <p className="col-span-full text-center text-[#2D2B2A] opacity-70">
                No hero slides found. Add your first slide!
              </p>
            ) : (
              heroSlides.map(slide => (
                <div 
                  key={slide.id} 
                  className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  <div className="px-5 py-4 flex items-center justify-between border-b border-[#2D2B2A]/10">
                    <h3 className="text-xl font-semibold text-[#2D2B2A]">{slide.title}</h3>
                    <div className="flex space-x-2">
                      <button
                      title='edit' 
                        onClick={() => prepareEditSlide(slide)}
                        className="text-[#2D2B2A] hover:text-[#8B4513] p-1.5 rounded-full hover:bg-[#8B4513]/10 transition-colors duration-200"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button 
                      title='delete'
                        onClick={() => slide.id && setSlideToDelete(slide.id)}
                        className="text-red-500 hover:text-red-700 p-1.5 rounded-full hover:bg-red-500/10 transition-colors duration-200"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <img 
                    src={slide.image_path} 
                    alt={slide.title} 
                    className="w-full h-56 object-cover transition-transform duration-300 hover:scale-110"
                  />
                  <div className="p-5">
                    <p className="text-sm text-[#2D2B2A]/80 line-clamp-2 mb-3">{slide.description}</p>
                    <div className="text-sm text-[#2D2B2A]/70 flex justify-between items-center">
                      <div>
                        <span className="font-medium">Display Order:</span> {slide.display_order}
                      </div>
                      <span 
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          slide.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {slide.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Delete Confirmation Modal */}
          {slideToDelete && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto transform transition-all duration-300 scale-100">
                <div className="bg-red-500 text-white px-6 py-4 rounded-t-xl flex items-center">
                  <AlertTriangle className="mr-3 h-6 w-6" />
                  <h2 className="text-xl font-semibold">Confirm Deletion</h2>
                </div>
                <div className="p-6 space-y-4">
                  <p className="text-[#2D2B2A]">
                    Are you sure you want to delete this hero slide? 
                    This action cannot be undone.
                  </p>
                  <div className="flex justify-end space-x-4 pt-2">
                    <button 
                      onClick={() => setSlideToDelete(null)}
                      className="px-4 py-2 text-sm font-medium text-[#2D2B2A] bg-[#F5F5F5] border border-[#2D2B2A]/30 rounded-md hover:bg-[#E0E0E0] transition-colors duration-300"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={deleteHeroSlide}
                      className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Delete Slide
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Add/Edit Slide Dialog */}
          {isDialogOpen && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto transform transition-all duration-300 scale-100">
                <div className="bg-[#8B4513] text-white px-6 py-4 rounded-t-xl flex justify-between items-center">
                  <h2 className="text-xl font-semibold">
                    {currentSlide.id ? 'Edit Hero Slide' : 'Add New Hero Slide'}
                  </h2>
                  <button 
                  title='open'
                    onClick={() => setIsDialogOpen(false)}
                    className="text-white hover:bg-[#6B3E23] p-2 rounded-full transition-colors duration-200"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <form 
                  onSubmit={currentSlide.id ? editHeroSlide : createHeroSlide} 
                  className="p-6 space-y-4"
                >
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-[#2D2B2A] mb-1">
                      Title
                    </label>
                    <input 
                      id="title"
                      type="text"
                      value={currentSlide.title || ''}
                      onChange={(e) => setCurrentSlide(prev => ({...prev, title: e.target.value}))}
                      className="w-full px-3 py-2 border border-[#2D2B2A]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B4513] focus:border-transparent"
                      required 
                    />
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-[#2D2B2A] mb-1">
                      Description
                    </label>
                    <textarea 
                      id="description"
                      value={currentSlide.description || ''}
                      onChange={(e) => setCurrentSlide(prev => ({...prev, description: e.target.value}))}
                      className="w-full px-3 py-2 border border-[#2D2B2A]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B4513] focus:border-transparent"
                      required 
                    />
                  </div>
                  <div>
                    <label htmlFor="image" className="block text-sm font-medium text-[#2D2B2A] mb-1">
                      Image {!currentSlide.id && <span className="text-red-500">*</span>}
                    </label>
                    <input 
                      id="image"
                      type="file"
                      onChange={handleImageChange}
                      className="w-full px-3 py-2 border border-[#2D2B2A]/30 rounded-md file:mr-4 file:rounded-md file:border-0 file:bg-[#8B4513] file:text-white file:px-4 file:py-2 hover:file:bg-[#6B3E23]"
                      accept="image/jpeg,image/png,image/webp"
                      {...(currentSlide.id ? {} : { required: true })}
                    />
                  </div>
                  {imagePreview && (
                    <div className="mt-2">
                      <button 
                        type="button" 
                        onClick={() => setImagePreview(null)}
                        className="text-sm text-[#8B4513] hover:underline mb-1"
                      >
                        View Image Preview
                      </button>
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-32 object-contain border border-[#2D2B2A]/20 rounded-md"
                      />
                    </div>
                  )}
                  <div>
                    <label htmlFor="displayOrder" className="block text-sm font-medium text-[#2D2B2A] mb-1">
                      Display Order
                    </label>
                    <input 
                      id="displayOrder"
                      type="number"
                      value={currentSlide.display_order || 0}
                      onChange={(e) => setCurrentSlide(prev => ({...prev, display_order: Number(e.target.value)}))}
                      className="w-full px-3 py-2 border border-[#2D2B2A]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B4513] focus:border-transparent"
                      min="0"
                    />
                  </div>
                  <div className="flex items-center">
                    <input 
                      id="isActive"
                      type="checkbox"
                      checked={currentSlide.is_active || false}
                      onChange={(e) => setCurrentSlide(prev => ({...prev, is_active: e.target.checked}))}
                      className="h-4 w-4 text-[#8B4513] focus:ring-[#8B4513] border-[#2D2B2A]/30 rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 block text-sm text-[#2D2B2A]">
                      Active
                    </label>
                  </div>
                  <div className="flex justify-end space-x-4 pt-2">
                    <button 
                      type="button"
                      onClick={() => setIsDialogOpen(false)}
                      className="px-4 py-2 text-sm font-medium text-[#2D2B2A] bg-[#F5F5F5] border border-[#2D2B2A]/30 rounded-md hover:bg-[#E0E0E0] transition-colors duration-300"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-[#8B4513] rounded-md hover:bg-[#6B3E23] transition-colors duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B4513]"
                    >
                      {currentSlide.id ? 'Update Slide' : 'Create Slide'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminHero;