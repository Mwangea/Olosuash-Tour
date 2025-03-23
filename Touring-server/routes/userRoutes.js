const express = require('express');
const userController = require('../controllers/userController');
const { isAuthenticated, isVerified } = require('../middleware/auth');
const { uploadProfilePicture } = require('../middleware/multer');

const router = express.Router();

// All routes require authentication
router.use(isAuthenticated);

// User profile routes
router.get('/profile', userController.getProfile);
router.patch('/profile', uploadProfilePicture, userController.updateProfile);

module.exports = router;