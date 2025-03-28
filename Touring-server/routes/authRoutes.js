const express = require('express');
const passport = require('passport');
const authController = require('../controllers/authController');
const { 
  validateSignUp, 
  validateLogin, 
  validateForgotPassword, 
  validateResetPassword 
} = require('../middleware/validation');
const { 
  isAuthenticated, 
  isNotAuthenticated,
  checkLoginAttempts 
} = require('../middleware/auth');
const { clientRedirectMiddleware } = require('../middleware/clientRedirectMiddleware');

const router = express.Router();

// Register new user
router.post('/signup', isNotAuthenticated, validateSignUp, authController.signup);

// Login user
router.post('/login', isNotAuthenticated, validateLogin, checkLoginAttempts, authController.login);

// Google OAuth
router.get('/google', 
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback', authController.googleCallback);

// Facebook OAuth
router.get('/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);

router.get('/facebook/callback', authController.facebookCallback);

// Email verification
// Email verification with JSON response
router.get('/verify-email/:token', 
  authController.verifyEmail,
  clientRedirectMiddleware()
);

// Password reset
router.post('/forgot-password', validateForgotPassword, authController.forgotPassword);
router.post('/reset-password/:token', validateResetPassword, authController.resetPassword);

// Get current user
router.get('/me', isAuthenticated, authController.getCurrentUser);

module.exports = router;