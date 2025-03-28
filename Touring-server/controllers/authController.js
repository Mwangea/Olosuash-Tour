const passport = require('passport');
const authService = require('../services/authService');
const { AppError } = require('../middleware/errorHandler');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/signup
 * @access  Public
 */
const signup = async (req, res, next) => {
  try {
    const result = await authService.signup(req.body);

    res.status(201).json({
      status: 'success',
      message: 'Registration successful! Please check your email to verify your account.',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Log in user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];

    const result = await authService.login(email, password, ipAddress, userAgent);

    res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Log in with Google (callback)
 * @route   GET /api/auth/google/callback
 * @access  Public
 */
const googleCallback = (req, res, next) => {
  passport.authenticate('google', { session: false }, async (err, user) => {
    if (err || !user) {
      return next(new AppError('Failed to authenticate with Google', 401));
    }

    try {
      const ipAddress = req.ip;
      const userAgent = req.headers['user-agent'];

      const result = await authService.socialLogin(user, ipAddress, userAgent);
      
      // Redirect with token in query params (frontend should extract and store)
      res.redirect(`${process.env.FRONTEND_URL}/auth/social-callback?token=${result.token}`);
    } catch (error) {
      next(error);
    }
  })(req, res, next);
};

/**
 * @desc    Log in with Facebook (callback)
 * @route   GET /api/auth/facebook/callback
 * @access  Public
 */
const facebookCallback = (req, res, next) => {
  passport.authenticate('facebook', { session: false }, async (err, user) => {
    if (err || !user) {
      return next(new AppError('Failed to authenticate with Facebook', 401));
    }

    try {
      const ipAddress = req.ip;
      const userAgent = req.headers['user-agent'];

      const result = await authService.socialLogin(user, ipAddress, userAgent);
      
      // Redirect with token in query params (frontend should extract and store)
      res.redirect(`${process.env.FRONTEND_URL}/auth/social-callback?token=${result.token}`);
    } catch (error) {
      next(error);
    }
  })(req, res, next);
};

/**
 * @desc    Verify email
 * @route   GET /api/auth/verify-email/:token
 * @access  Public
 */
const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;
    
    // Call service method to verify email
    const result = await authService.verifyEmail(token);

    // For API response
    res.status(200).json({
      status: result.verified ? 'success' : 'fail',
      message: result.message,
      data: {
        verified: result.verified,
        redirectUrl: result.redirectUrl
      }
    });

  } catch (error) {
    // Fallback error handling
    res.status(400).json({
      status: 'fail',
      message: 'Email verification failed',
      data: {
        verified: false,
        redirectUrl: `${process.env.FRONTEND_URL}/verify-email/failed`
      }
    });
  }
};

/**
 * @desc    Forgot password
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    await authService.forgotPassword(email);

    // Always return success to prevent email enumeration
    res.status(200).json({
      status: 'success',
      message: 'If that email address is in our database, we will send you a password reset link'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reset password
 * @route   POST /api/auth/reset-password/:token
 * @access  Public
 */
const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    await authService.resetPassword(token, password);

    res.status(200).json({
      status: 'success',
      message: 'Password reset successful. You can now log in with your new password'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user
 * @route   GET /api/auth/me
 * @access  Private
 */
const getCurrentUser = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user
    }
  });
};

module.exports = {
  signup,
  login,
  googleCallback,
  facebookCallback,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getCurrentUser
};