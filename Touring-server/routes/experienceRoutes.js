const express = require('express');
const router = express.Router();
const experienceController = require('../controllers/experienceController');
const {  restrictTo, isAuthenticated } = require('../middleware/auth');
const { uploadCategory, uploadExperienceArray, uploadExperienceSingle } = require('../middleware/multer');
//const upload = require('../middleware/uploadMiddleware');

// Category Routes
router.post(
  '/categories',
  isAuthenticated,
  restrictTo('admin'),
  uploadCategory,
  experienceController.createCategory
);
router.get('/categories', experienceController.getAllCategories);
router.get('/categories/:id', experienceController.getCategoryById);
router.get('/categories/slug/:slug', experienceController.getCategoryBySlug);
router.patch(
  '/categories/:id',
  isAuthenticated,
  restrictTo('admin'),
  uploadCategory,
  experienceController.updateCategory
);
router.delete(
  '/categories/:id',
  isAuthenticated,
  restrictTo('admin'),
  experienceController.deleteCategory
);


const experienceUpload = uploadExperienceArray([
  { name: 'images', maxCount: 10 },
  { name: 'section_image_1', maxCount: 1 },
  { name: 'section_image_2', maxCount: 1 },
  { name: 'section_image_3', maxCount: 1 },
  { name: 'section_image_4', maxCount: 1 },
  { name: 'section_image_5', maxCount: 1 }
]);

// Booking Routes
router.post(
  '/bookings',
  experienceController.createBooking
);
router.get(
  '/bookings',
  experienceController.getAllBookings
);
router.get(
  '/bookings/:id',
  experienceController.getBookingById
);
router.patch(
  '/bookings/:id/status',
  isAuthenticated,
  restrictTo('admin'),
  experienceController.updateBookingStatus
);

// Experience Routes
router.post(
  '/',
  isAuthenticated,
  restrictTo('admin'),
  experienceUpload,
  experienceController.createExperience
);
  
router.get('/', experienceController.getAllExperiences);
router.get('/featured', experienceController.getFeaturedExperiences);
router.get('/category/:categoryId', experienceController.getExperiencesByCategory);
router.get('/:id', experienceController.getExperienceById);
router.get('/slug/:slug', experienceController.getExperienceBySlug);

router.patch(
  '/:id',
  isAuthenticated,
  restrictTo('admin'),
  experienceUpload, 
  experienceController.updateExperience
);

router.delete(
  '/:id',
  isAuthenticated,
  restrictTo('admin'),
  experienceController.deleteExperience
);

// Experience Image Routes
router.post(
  '/:id/images',
  isAuthenticated,
  restrictTo('admin'),
  uploadExperienceSingle('image'),
  experienceController.addExperienceImage
);
router.delete(
  '/images/:imageId',
  isAuthenticated,
  restrictTo('admin'),
  experienceController.removeExperienceImage
);
router.patch(
  '/:experienceId/images/:imageId/cover',
  isAuthenticated,
  restrictTo('admin'),
  experienceController.setImageAsCover
);



module.exports = router;