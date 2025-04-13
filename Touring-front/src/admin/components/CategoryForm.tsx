import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../api/axios';
import AdminLayout from '../Adminlayout';

const CategoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_path: '',
    is_active: true
  });

  useEffect(() => {
    if (id) {
      const fetchCategory = async () => {
        try {
          setLoading(true);
          const response = await api.get(`/experiences/categories/${id}`);
          setFormData(response.data.data.category);
          setImagePreview(response.data.data.category.image_path || null);
        } catch (error) {
          toast.error('Failed to fetch category');
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      fetchCategory();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Only image files are allowed!');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('is_active', formData.is_active.toString());
      
      // Only append image if a new file is selected
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }
  
      if (id) {
        await api.patch(`/experiences/categories/${id}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success('Category updated successfully');
      } else {
        await api.post('/experiences/categories', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success('Category created successfully');
      }
      
      navigate('/admin/categories/');
    } catch (error) {
      toast.error(`Failed to ${id ? 'update' : 'create'} category`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-[#8B6B3D] mb-6">
          {id ? 'Edit Category' : 'Create New Category'}
        </h1>
        
        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Category Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#8B6B3D] focus:border-[#8B6B3D] sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#8B6B3D] focus:border-[#8B6B3D] sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category Image
              </label>
              <div className="mt-1 flex items-center">
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="Category preview"
                      className="h-16 w-16 object-cover rounded-md"
                    />
                    <label className="ml-4 cursor-pointer">
                      <span className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B6B3D]">
                        Change
                        <input
                          type="file"
                          className="sr-only"
                          onChange={handleFileChange}
                          accept="image/*"
                        />
                      </span>
                    </label>
                  </>
                ) : (
                  <label className="cursor-pointer">
                    <span className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B6B3D]">
                      Upload Image
                      <input
                        type="file"
                        className="sr-only"
                        onChange={handleFileChange}
                        accept="image/*"
                      />
                    </span>
                  </label>
                )}
              </div>
            </div>

            <div>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                  className="h-4 w-4 text-[#8B6B3D] focus:ring-[#8B6B3D] border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Active Category</span>
              </label>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/admin/categories')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B6B3D]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#8B6B3D] hover:bg-[#6B4F2D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B6B3D] disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Category'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default CategoryForm;