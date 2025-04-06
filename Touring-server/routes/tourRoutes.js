const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tourController');
const { isAuthenticated, restrictTo } = require('../middleware/auth');

// Configure multer for tour image uploads
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { AppError } = require('../middleware/errorHandler');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '..', 'uploads', 'tour-images');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    const tourId = req.params.id || 'new';
    const timestamp = Date.now();
    const fileExt = path.extname(file.originalname);
    cb(null, `tour-${tourId}-${timestamp}${fileExt}`);
  }
});

// Filter file types
const fileFilter = (req, file, cb) => {
  // Accept image files only
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new AppError('Only image files are allowed!', 400), false);
  }
};

// Create multer upload instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  },
  fileFilter: fileFilter
});

// Stats route
router.get('/stats', tourController.getTourStats);
// Public routes (no authentication required)
router.get('/', tourController.getAllTours);
router.get('/featured', tourController.getFeaturedTours);
router.get('/top-rated', tourController.getTopRatedTours);
router.get('/regions', tourController.getRegions);
router.get('/vehicle-types', tourController.getVehicleTypes);
router.get('/service-categories', tourController.getServiceCategories);
router.get('/slug/:slug', tourController.getTourBySlug);
// Protected routes (authentication required)
router.use(isAuthenticated);

// Wishlist routes
router.get('/wishlist', tourController.getWishlist);
router.get('/:id/wishlist/check', tourController.checkWishlist);
router.post('/:id/wishlist', tourController.addToWishlist);
router.delete('/:id/wishlist', tourController.removeFromWishlist);

router.get('/:id', tourController.getTourById);





// Review route
router.post('/:id/reviews', tourController.addReview);

// Admin only routes
router.use(restrictTo('admin'));

// Tour management routes
router.post('/', upload.array('images', 10), tourController.createTour);
router.patch('/:id', tourController.updateTour);
router.delete('/:id', tourController.deleteTour);

// Tour images routes
router.post('/:id/images', upload.array('images', 10), tourController.addTourImages);
router.delete('/images/:id', tourController.removeTourImage);
router.patch('/:tourId/images/:imageId/cover', tourController.setImageAsCover);



module.exports = router;