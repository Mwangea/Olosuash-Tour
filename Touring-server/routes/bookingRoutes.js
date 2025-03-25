const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { isAuthenticated, restrictTo } = require('../middleware/auth');

// User routes (all require authentication)
router.post('/', 
  isAuthenticated, 
  bookingController.createBooking
);

router.get('/my-bookings', 
  isAuthenticated, 
  bookingController.getBookings
);

router.get('/:id', 
  isAuthenticated, 
  bookingController.getBooking
);

router.delete('/:id', 
  isAuthenticated, 
  bookingController.cancelBooking
);

// Admin-only routes
router.get('/', 
  isAuthenticated, 
  restrictTo('admin'), 
  bookingController.getBookings
);

router.patch('/:id/status', 
  isAuthenticated, 
  restrictTo('admin'), 
  bookingController.updateBookingStatus
);

router.get('/stats/overview', 
  isAuthenticated, 
  restrictTo('admin'), 
  bookingController.getBookingStats
);

module.exports = router;