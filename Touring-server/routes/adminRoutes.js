const express = require('express');
const adminController = require('../controllers/adminController');
const { validateSignUp } = require('../middleware/validation');
const { isAuthenticated, restrictTo } = require('../middleware/auth');
const { uploadProfilePicture } = require('../middleware/multer');



const router = express.Router();

// All routes require authentication and admin role
router.use(isAuthenticated);
router.use(restrictTo('admin'));

//create admin route
router.post('/create', validateSignUp, adminController.createAdmin);

// User management routes
router.get('/users', adminController.getAllUsers);
router.get('/users/stats', adminController.getUserStats);
router.get('/users/:id', adminController.getUserById);
router.patch('/users/:id', uploadProfilePicture, adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

module.exports = router;