const Experience = require('../models/experienceModel');
const { AppError } = require('../middleware/errorHandler');
const fs = require('fs');
const path = require('path');
const emailService = require('../services/emailExService');

/**
 * Format experience response with calculated prices
 */
const formatExperienceResponse = (experience, groupSize = null) => {
    // Ensure numeric fields are numbers
    const price = Number(experience.price);
    const discount_price = experience.discount_price ? Number(experience.discount_price) : null;
    const calculatedGroupSize = groupSize || experience.min_group_size || 1;
    
    const totalPrice = price * calculatedGroupSize;
    const discountPrice = discount_price ? 
      discount_price * calculatedGroupSize : 
      null;
  
    return {
      ...experience,
      price: price,
      discount_price: discount_price,
      totalPrice,
      discountPrice,
      priceDisplay: `$${totalPrice.toFixed(2)}`,
      discountPriceDisplay: discountPrice ? 
        `$${discountPrice.toFixed(2)}` : 
        null,
      calculatedForGroupSize: calculatedGroupSize
    };
  };

// Category Controllers
const createCategory = async (req, res, next) => {
    try {
      if (!req.file) {
        throw new AppError('Category image is required', 400);
      }
  
      const categoryData = {
        name: req.body.name,
        description: req.body.description,
        is_active: req.body.is_active === 'true',
        image_path: `/uploads/category-images/${req.file.filename}`
      };
  
      const category = await Experience.createCategory(categoryData); // Changed from Category to Experience
      
      res.status(201).json({
        status: 'success',
        data: {
          category
        }
      });
    } catch (error) {
      next(error);
    }
  };

const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Experience.getAllCategories();
    res.status(200).json({
      status: 'success',
      data: {
        categories
      }
    });
  } catch (error) {
    next(error);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const category = await Experience.getCategoryById(req.params.id);
    if (!category) {
      return next(new AppError('Category not found', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        category
      }
    });
  } catch (error) {
    next(error);
  }
};

const getCategoryBySlug = async (req, res, next) => {
  try {
    const category = await Experience.getCategoryBySlug(req.params.slug);
    if (!category) {
      return next(new AppError('Category not found', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        category
      }
    });
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
    try {
      const updateData = {
        name: req.body.name,
        description: req.body.description,
        is_active: req.body.is_active === 'true'
      };
  
      // Only update image if a new file was uploaded
      if (req.file) {
        updateData.image_path = `/uploads/category-images/${req.file.filename}`;
        
        // Optionally delete the old image file
        if (req.category && req.category.image_path) {
          const oldImagePath = path.join(__dirname, '..', req.category.image_path);
          fs.unlink(oldImagePath, (err) => {
            if (err) console.error('Error deleting old image:', err);
          });
        }
      }
  
      const category = await Experience.updateCategory(req.params.id, updateData);
  
      res.status(200).json({
        status: 'success',
        data: {
          category
        }
      });
    } catch (error) {
      next(error);
    }
  };

const deleteCategory = async (req, res, next) => {
  try {
    const success = await Experience.deleteCategory(req.params.id);
    if (!success) {
      return next(new AppError('Category not found', 404));
    }
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

// Experience Controllers
const createExperience = async (req, res, next) => {
    try {
      if (!req.files?.images || req.files.images.length === 0) {
        throw new AppError('At least one image is required', 400);
      }
  
      // Process cover image index
      const coverImageIndex = parseInt(req.body.cover_image_index) || 0;
      if (coverImageIndex >= req.files.images.length) {
        throw new AppError('Invalid cover image index', 400);
      }
  
      // Prepare images data
      const images = req.files.images.map((file, index) => ({
        image_path: `/uploads/experience-images/${file.filename}`,
        is_cover: index === coverImageIndex
      }));
  
      // Prepare sections data
      const sections = [];
      for (let i = 1; i <= 5; i++) {
        const sectionImage = req.files[`section_image_${i}`]?.[0];
        
        if (req.body[`section_title_${i}`] || req.body[`section_description_${i}`]) {
          sections.push({
            title: req.body[`section_title_${i}`],
            description: req.body[`section_description_${i}`],
            image_path: sectionImage ? `/uploads/experience-images/${sectionImage.filename}` : null,
            order: i
          });
        }
      }
  
      // Create experience with all data
      const experience = await Experience.createExperience({
        ...req.body,
        images,
        sections
      });
      
      res.status(201).json({
        status: 'success',
        data: { experience }
      });
    } catch (error) {
      // Clean up uploaded files if error occurs
      if (req.files) {
        Object.values(req.files).forEach(files => {
          if (Array.isArray(files)) {
            files.forEach(file => {
              fs.unlink(file.path, err => {
                if (err) console.error('Error deleting file:', err);
              });
            });
          }
        });
      }
      next(error);
    }
  };

const getAllExperiences = async (req, res, next) => {
  try {
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      category_id: req.query.category_id,
      featured: req.query.featured,
      min_price: req.query.min_price,
      max_price: req.query.max_price,
      difficulty: req.query.difficulty,
      search: req.query.search,
      is_active: req.user?.role === 'admin' ? undefined : true // Only show active to non-admins
    };
    
    const result = await Experience.getAllExperiences(options);
    
    res.status(200).json({
      status: 'success',
      results: result.experiences.length,
      pagination: result.pagination,
      data: {
        experiences: result.experiences.map(exp => formatExperienceResponse(exp))
      }
    });
  } catch (error) {
    next(error);
  }
};

const getExperienceById = async (req, res, next) => {
    try {
      const experience = await Experience.getExperienceById(req.params.id);
      if (!experience) {
        return next(new AppError('Experience not found', 404));
      }
  
      // Check if experience is active (for non-admin users)
      if (!experience.is_active && (!req.user || req.user.role !== 'admin')) {
        return next(new AppError('Experience not found', 404));
      }
  
      // Calculate price based on group size if provided
      const groupSize = req.query.groupSize ? parseInt(req.query.groupSize) : experience.min_group_size || 1;
      
      res.status(200).json({
        status: 'success',
        data: {
          experience: formatExperienceResponse(experience, groupSize)
        }
      });
    } catch (error) {
      next(error);
    }
  };

const getExperienceBySlug = async (req, res, next) => {
    try {
      const experience = await Experience.getExperienceBySlug(req.params.slug);
      if (!experience) {
        return next(new AppError('Experience not found', 404));
      }
  
      // Check if experience is active (for non-admin users)
      if (!experience.is_active && (!req.user || req.user.role !== 'admin')) {
        return next(new AppError('Experience not found', 404));
      }
  
      const groupSize = req.query.groupSize ? parseInt(req.query.groupSize) : experience.min_group_size || 1;
      
      res.status(200).json({
        status: 'success',
        data: {
          experience: formatExperienceResponse(experience, groupSize)
        }
      });
    } catch (error) {
      next(error);
    }
  };

const updateExperience = async (req, res, next) => {
    try {
      const experienceId = req.params.id;
      const formData = req.body;
      
      // Convert form data to proper format
      const experienceData = {
        title: formData.title,
        category_id: formData.category_id,
        short_description: formData.short_description,
        description: formData.description,
        duration: formData.duration,
        price: formData.price,
        discount_price: formData.discount_price || null,
        min_group_size: formData.min_group_size,
        max_group_size: formData.max_group_size,
        difficulty: formData.difficulty,
        is_featured: formData.is_featured === 'true',
        is_active: formData.is_active === 'true'
      };
  
      // First update the basic experience info
      let experience = await Experience.updateExperience(experienceId, experienceData);
      
      // Handle images if any were uploaded
      if (req.files?.images) {
        // Add new images
        const images = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
        
        for (const [index, file] of images.entries()) {
          const isCover = index === (parseInt(formData.cover_image_index) || 0);
          await Experience.addExperienceImage(
            experienceId,
            `/uploads/experience-images/${file.filename}`,
            isCover
          );
        }
      }
  
      // Handle cover image from existing images if specified
      if (formData.cover_image_id) {
        await Experience.setExperienceImageAsCover(experienceId, formData.cover_image_id);
      }
  
      // Handle sections if any were provided
      if (formData.sections) {
        // First, get existing sections to know which to delete
        const existingSections = await Experience.getExperienceSections(experienceId);
        const existingSectionIds = existingSections.map(s => s.id);
        const incomingSectionIds = [];
        
        // Process each section
        for (const [index, section] of Object.entries(formData.sections)) {
          const sectionData = {
            title: section.title,
            description: section.description,
            order: section.order || index,
            image_path: null
          };
  
          // Handle section image
          if (req.files?.[`section_images[${index}]`]) {
            const file = req.files[`section_images[${index}]`][0];
            sectionData.image_path = `/uploads/experience-images/${file.filename}`;
          } else if (section.existing_image) {
            sectionData.image_path = section.existing_image;
          }
  
          // Update or insert section
          if (section.id && section.id.startsWith('existing-')) {
            const sectionId = section.id.replace('existing-', '');
            incomingSectionIds.push(sectionId);
            await Experience.updateExperienceSection(
              sectionId,
              sectionData.title,
              sectionData.description,
              sectionData.image_path,
              sectionData.order
            );
          } else {
            // New section
            await Experience.addExperienceSection(
              experienceId,
              sectionData.title,
              sectionData.description,
              sectionData.image_path,
              sectionData.order
            );
          }
        }
  
        // Delete sections that were removed
        const sectionsToDelete = existingSectionIds.filter(id => !incomingSectionIds.includes(id));
        if (sectionsToDelete.length > 0) {
          await Experience.deleteExperienceSections(sectionsToDelete);
        }
      }
  
      // Get the updated experience with all relations
      experience = await Experience.getExperienceById(experienceId);
      
      res.status(200).json({
        status: 'success',
        data: {
          experience: formatExperienceResponse(experience)
        }
      });
    } catch (error) {
      // Clean up uploaded files if error occurs
      if (req.files) {
        Object.values(req.files).forEach(files => {
          if (Array.isArray(files)) {
            files.forEach(file => {
              fs.unlink(file.path, err => {
                if (err) console.error('Error deleting file:', err);
              });
            });
          }
        });
      }
      next(error);
    }
  };

const deleteExperience = async (req, res, next) => {
  try {
    const success = await Experience.deleteExperience(req.params.id);
    if (!success) {
      return next(new AppError('Experience not found', 404));
    }
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

const addExperienceImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new AppError('No image uploaded', 400));
    }
    
    const imagePath = `/uploads/experience-images/${req.file.filename}`;
    const isCover = req.body.is_cover === 'true';
    
    const imageId = await Experience.addExperienceImage(
      req.params.id,
      imagePath,
      isCover
    );
    
    const experience = await Experience.getExperienceById(req.params.id);
    
    res.status(200).json({
      status: 'success',
      data: {
        experience: formatExperienceResponse(experience)
      }
    });
  } catch (error) {
    // Clean up uploaded file if there was an error
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
    next(error);
  }
};

const removeExperienceImage = async (req, res, next) => {
  try {
    const success = await Experience.removeExperienceImage(req.params.imageId);
    if (!success) {
      return next(new AppError('Image not found', 404));
    }
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

const setImageAsCover = async (req, res, next) => {
  try {
    const success = await Experience.setExperienceImageAsCover(
      req.params.experienceId,
      req.params.imageId
    );
    if (!success) {
      return next(new AppError('Experience or image not found', 404));
    }
    
    const experience = await Experience.getExperienceById(req.params.experienceId);
    
    res.status(200).json({
      status: 'success',
      data: {
        experience: formatExperienceResponse(experience)
      }
    });
  } catch (error) {
    next(error);
  }
};

const getFeaturedExperiences = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 4;
    const experiences = await Experience.getFeaturedExperiences(limit);
    
    res.status(200).json({
      status: 'success',
      results: experiences.length,
      data: {
        experiences: experiences.map(exp => formatExperienceResponse(exp))
      }
    });
  } catch (error) {
    next(error);
  }
};

const getExperiencesByCategory = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 4;
    const experiences = await Experience.getExperiencesByCategory(
      req.params.categoryId,
      limit
    );
    
    res.status(200).json({
      status: 'success',
      results: experiences.length,
      data: {
        experiences: experiences.map(exp => formatExperienceResponse(exp))
      }
    });
  } catch (error) {
    next(error);
  }
};

// Booking Controllers
const createBooking = async (req, res, next) => {
  try {
    // Get experience to calculate total price
    const experience = await Experience.getExperienceById(req.body.experience_id);
    if (!experience) {
      return next(new AppError('Experience not found', 404));
    }
    
    const numberOfGuests = req.body.number_of_guests || 1;
    const totalPrice = experience.discount_price 
      ? experience.discount_price * numberOfGuests
      : experience.price * numberOfGuests;
    
    const bookingData = {
      ...req.body,
      user_id: req.user?.id || null,
      total_price: totalPrice
    };
    
    const booking = await Experience.createBooking(bookingData);
    
   // Send confirmation email to user
   await emailService.sendBookingConfirmationEmail({
    ...booking,
    experience_title: experience.title,
    experience_duration: experience.duration
  });
  
  // Send notification to admin
  await emailService.sendAdminBookingNotificationEmail({
    ...booking,
    experience_title: experience.title,
    experience_duration: experience.duration
  });
  
  res.status(201).json({
    status: 'success',
    data: {
      booking
    }
  });
} catch (error) {
  next(error);
}
};

const getBookingById = async (req, res, next) => {
  try {
    const booking = await Experience.getBookingById(req.params.id);
    if (!booking) {
      return next(new AppError('Booking not found', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        booking
      }
    });
  } catch (error) {
    next(error);
  }
};

const updateBookingStatus = async (req, res, next) => {
  try {
    const { status, payment_status, admin_notes } = req.body;
    const success = await Experience.updateBookingStatus(
      req.params.id,
      status,
      payment_status,
      admin_notes
    );
    if (!success) {
      return next(new AppError('Booking not found', 404));
    }
    
    const booking = await Experience.getBookingById(req.params.id);
    
    // Send status update email to user if status changed
    if (req.body.status && req.body.status !== booking.status) {
      await emailService.sendBookingStatusUpdateEmail({
        ...booking,
        ...req.body
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        booking
      }
    });
  } catch (error) {
    next(error);
  }
};

const getAllBookings = async (req, res, next) => {
  try {
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      status: req.query.status,
      payment_status: req.query.payment_status,
      experience_id: req.query.experience_id,
      user_id: req.user?.role === 'admin' ? req.query.user_id : req.user?.id,
      search: req.query.search
    };
    
    const result = await Experience.getAllBookings(options);
    
    res.status(200).json({
      status: 'success',
      results: result.bookings.length,
      pagination: result.pagination,
      data: {
        bookings: result.bookings
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  // Category controllers
  createCategory,
  getAllCategories,
  getCategoryById,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
  
  // Experience controllers
  createExperience,
  getAllExperiences,
  getExperienceById,
  getExperienceBySlug,
  updateExperience,
  deleteExperience,
  addExperienceImage,
  removeExperienceImage,
  setImageAsCover,
  getFeaturedExperiences,
  getExperiencesByCategory,
  
  // Booking controllers
  createBooking,
  getBookingById,
  updateBookingStatus,
  getAllBookings
};