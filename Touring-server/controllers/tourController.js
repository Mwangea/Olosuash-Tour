const Tour = require('../models/tourModel');
const { AppError } = require('../middleware/errorHandler');
const fs = require('fs');
const path = require('path');

/**
 * @desc    Create a new tour
 * @route   POST /api/tours
 * @access  Admin
 */
const createTour = async (req, res, next) => {
  try {
    // Process uploaded files
    const images = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        images.push({
          image_path: `/uploads/tour-images/${file.filename}`,
          is_cover: false
        });
      });
      // Set first image as cover
      if (images.length > 0) images[0].is_cover = true;
    }

    // Calculate price per guest if not provided
    if (!req.body.pricePerGuest) {
      req.body.pricePerGuest = req.body.price / (req.body.minGroupSize || 1);
    }

    const tour = await Tour.create({
      ...req.body,
      images
    });
    
    res.status(201).json({
      status: 'success',
      data: {
        tour: formatTourResponse(tour)
      }
    });
  } catch (error) {
    // Clean up uploaded files if there was an error
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        fs.unlink(file.path, (err) => {
          if (err) console.error('Error deleting file:', err);
        });
      });
    }
    next(error);
  }
};

/**
 * Format tour response with calculated prices and proper structure
 */
const formatTourResponse = (tour, groupSize = null) => {
  const calculatedGroupSize = groupSize || tour.minGroupSize || 1;
  const totalPrice = tour.pricePerGuest * calculatedGroupSize;
  const discountPrice = tour.discount_price ? 
    (tour.discount_price / (tour.minGroupSize || 1)) * calculatedGroupSize : 
    null;

  return {
    ...tour,
    price: tour.price, // Original total price for default group size
    pricePerGuest: tour.pricePerGuest,
    totalPrice,
    discountPrice,
    priceDisplay: `Total Cost for ${calculatedGroupSize} Guests: $${totalPrice.toLocaleString()}`,
    discountPriceDisplay: discountPrice ? 
      `Discounted Price for ${calculatedGroupSize} Guests: $${discountPrice.toLocaleString()}` : 
      null,
    calculatedForGroupSize: calculatedGroupSize
  };
};

/**
 * @desc    Get all tours
 * @route   GET /api/tours
 * @access  Public
 */
const getAllTours = async (req, res, next) => {
  try {
    // Extract filter options from query params
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      sort: req.query.sort || 'created_at',
      order: req.query.order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC',
      featured: req.query.featured === 'true' ? 1 : (req.query.featured === 'false' ? 0 : undefined),
      minPrice: req.query.minPrice ? parseFloat(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice) : undefined,
      difficulty: ['easy', 'medium', 'difficult'].includes(req.query.difficulty) ? req.query.difficulty : undefined,
      duration: req.query.duration ? parseInt(req.query.duration) : undefined,
      search: req.query.search || undefined,
      regionId: req.query.regionId || undefined
    };
    
    const result = await Tour.findAll(options);
    
    res.status(200).json({
      status: 'success',
      results: result.tours.length,
      pagination: result.pagination,
      data: {
        tours: result.tours.map(tour => formatTourResponse(tour))
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get featured tours
 * @route   GET /api/tours/featured
 * @access  Public
 */
const getFeaturedTours = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const tours = await Tour.getFeatured(limit);
    
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours: tours.map(tour => formatTourResponse(tour))
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get top rated tours
 * @route   GET /api/tours/top-rated
 * @access  Public
 */
const getTopRatedTours = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const tours = await Tour.getTopRated(limit);
    
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours: tours.map(tour => formatTourResponse(tour))
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get tour by ID
 * @route   GET /api/tours/:id
 * @access  Public
 */
const getTourById = async (req, res, next) => {
  try {
    const tour = await Tour.findById(req.params.id);
    
    if (!tour) {
      return next(new AppError('Tour not found', 404));
    }

    // Calculate price based on group size if provided
    const groupSize = req.query.groupSize ? parseInt(req.query.groupSize) : tour.minGroupSize || 1;
    
    res.status(200).json({
      status: 'success',
      data: {
        tour: formatTourResponse(tour, groupSize)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get tour by slug
 * @route   GET /api/tours/slug/:slug
 * @access  Public
 */
const getTourBySlug = async (req, res, next) => {
  try {
    const tour = await Tour.findBySlug(req.params.slug);
    
    if (!tour) {
      return next(new AppError('Tour not found', 404));
    }

    const groupSize = req.query.groupSize ? parseInt(req.query.groupSize) : tour.minGroupSize || 1;
    
    res.status(200).json({
      status: 'success',
      data: {
        tour: formatTourResponse(tour, groupSize)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update tour
 * @route   PATCH /api/tours/:id
 * @access  Admin
 */
const updateTour = async (req, res, next) => {
  try {
    // First get the existing tour with all its relations
    const existingTour = await Tour.findById(req.params.id);
    
    if (!existingTour) {
      return next(new AppError('Tour not found', 404));
    }

    // Merge existing data with updates (preserve unchanged fields)
    const updatedData = {
      ...existingTour,
      ...req.body,
      // Preserve relations unless explicitly overwritten
      images: req.body.images || existingTour.images,
      regions: req.body.regions || existingTour.regions,
      vehicles: req.body.vehicles || existingTour.vehicles,
      itinerary: req.body.itinerary || existingTour.itinerary,
      locations: req.body.locations || existingTour.locations,
      includedServices: req.body.includedServices || existingTour.includedServices,
      excludedServices: req.body.excludedServices || existingTour.excludedServices,
      availability: req.body.availability || existingTour.availability
    };

    // Process new images if uploaded
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => ({
        image_path: `/uploads/tour-images/${file.filename}`,
        is_cover: false
      }));
      updatedData.images = [...existingTour.images, ...newImages];
    }

    const updatedTour = await Tour.update(req.params.id, updatedData);
    
    res.status(200).json({
      status: 'success',
      data: {
        tour: formatTourResponse(updatedTour)
      }
    });
  } catch (error) {
    // Clean up uploaded files if there was an error
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        fs.unlink(file.path, (err) => {
          if (err) console.error('Error deleting file:', err);
        });
      });
    }
    next(error);
  }
};

/**
 * @desc    Delete tour
 * @route   DELETE /api/tours/:id
 * @access  Admin
 */
const deleteTour = async (req, res, next) => {
  try {
    const success = await Tour.delete(req.params.id);
    
    if (!success) {
      return next(new AppError('Tour not found', 404));
    }
    
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add tour images
 * @route   POST /api/tours/:id/images
 * @access  Admin
 */
const addTourImages = async (req, res, next) => {
  try {
    // Check if tour exists
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      return next(new AppError('Tour not found', 404));
    }
    
    if (!req.files || req.files.length === 0) {
      return next(new AppError('No files uploaded', 400));
    }
    
    const imagePromises = req.files.map(async (file, index) => {
      const imagePath = `/uploads/tour-images/${file.filename}`;
      // Set the first uploaded image as cover if tour has no images
      const isCover = index === 0 && tour.images.length === 0;
      return await Tour.addImage(tour.id, imagePath, isCover);
    });
    
    await Promise.all(imagePromises);
    
    // Get updated tour
    const updatedTour = await Tour.findById(req.params.id);
    
    res.status(200).json({
      status: 'success',
      data: {
        tour: updatedTour
      }
    });
  } catch (error) {
    // Clean up uploaded files if there was an error
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        fs.unlink(file.path, (err) => {
          if (err) console.error('Error deleting file:', err);
        });
      });
    }
    next(error);
  }
};

/**
 * @desc    Remove tour image
 * @route   DELETE /api/tours/images/:id
 * @access  Admin
 */
const removeTourImage = async (req, res, next) => {
  try {
    const success = await Tour.removeImage(req.params.id);
    
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

/**
 * @desc    Set image as cover
 * @route   PATCH /api/tours/:tourId/images/:imageId/cover
 * @access  Admin
 */
const setImageAsCover = async (req, res, next) => {
  try {
    const { tourId, imageId } = req.params;
    
    const success = await Tour.updateImageCover(tourId, imageId);
    
    if (!success) {
      return next(new AppError('Tour or image not found', 404));
    }
    
    // Get updated tour
    const updatedTour = await Tour.findById(tourId);
    
    res.status(200).json({
      status: 'success',
      data: {
        tour: updatedTour
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add tour review
 * @route   POST /api/tours/:id/reviews
 * @access  Authenticated
 */
const addReview = async (req, res, next) => {
  try {
    const { rating, review } = req.body;
    const { id: tourId } = req.params;
    const userId = req.user.id;
    
    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return next(new AppError('Rating must be between 1 and 5', 400));
    }
    
    // Check if tour exists
    const tour = await Tour.findById(tourId);
    if (!tour) {
      return next(new AppError('Tour not found', 404));
    }
    
    await Tour.addReview(tourId, userId, rating, review);
    
    res.status(200).json({
      status: 'success',
      data: {
        message: 'Review added successfully'
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add tour to wishlist
 * @route   POST /api/tours/:id/wishlist
 * @access  Authenticated
 */
const addToWishlist = async (req, res, next) => {
  try {
    const { id: tourId } = req.params;
    const userId = req.user.id;
    
    // Check if tour exists
    const tour = await Tour.findById(tourId);
    if (!tour) {
      return next(new AppError('Tour not found', 404));
    }
    
    await Tour.addToWishlist(userId, tourId);
    
    res.status(200).json({
      status: 'success',
      data: {
        message: 'Tour added to wishlist'
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Remove tour from wishlist
 * @route   DELETE /api/tours/:id/wishlist
 * @access  Authenticated
 */
const removeFromWishlist = async (req, res, next) => {
  try {
    const { id: tourId } = req.params;
    const userId = req.user.id;
    
    const success = await Tour.removeFromWishlist(userId, tourId);
    
    if (!success) {
      return next(new AppError('Tour not in wishlist', 404));
    }
    
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user's wishlist
 * @route   GET /api/tours/wishlist
 * @access  Authenticated
 */
const getWishlist = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const tours = await Tour.getWishlist(userId);
    
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Check if tour is in user's wishlist (now public)
 * @route   GET /api/tours/:id/wishlist/check
 * @access  Public
 */
const checkWishlist = async (req, res, next) => {
  try {
    const { id: tourId } = req.params;
    const userId = req.user?.id; // Optional user ID
    
    // Check if tour exists
    const tour = await Tour.findById(tourId);
    if (!tour) {
      return next(new AppError('Tour not found', 404));
    }
    
    // If user is logged in, check their wishlist status
    const isInWishlist = userId ? await Tour.isInWishlist(userId, tourId) : false;
    
    res.status(200).json({
      status: 'success',
      data: {
        isInWishlist,
        isAuthenticated: !!userId // Indicate if user is authenticated
      }
    });
  } catch (error) {
    next(error);
  }
};
/**
 * @desc    Get tour statistics
 * @route   GET /api/tours/stats
 * @access  Public
 */
const getTourStats = async (req, res, next) => {
  try {
    const stats = await Tour.getStats();
    
    res.status(200).json({
      status: 'success',
      data: {
        stats
      }
    });
  } catch (error) {
    console.error('Error in getTourStats:', error);
    next(new AppError('Failed to load tour statistics', 500));
  }
};

// Get regions
const getRegions = async (req, res, next) => {
  try {
    const regions = await Tour.getRegions();
    res.json({ status: 'success', data: { regions } });
  } catch (error) {
    next(error);
  }
};

// Get vehicle types 
const getVehicleTypes = async (req, res, next) => {
  try {
    const vehicleTypes = await Tour.getVehicleTypes();
    res.json({ status: 'success', data: { vehicleTypes } });
  } catch (error) {
    next(error);
  }
};

// Get service categories
const getServiceCategories = async (req, res, next) => {
  try {
    const categories = await Tour.getServiceCategories();
    res.json({ status: 'success', data: { categories } });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTour,
  getAllTours,
  getFeaturedTours,
  getTopRatedTours,
  getTourById,
  getTourBySlug,
  updateTour,
  deleteTour,
  addTourImages,
  removeTourImage,
  setImageAsCover,
  addReview,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  checkWishlist,
  getTourStats,
  getRegions,
  getVehicleTypes,
  getServiceCategories
};