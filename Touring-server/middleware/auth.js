const passport = require('passport');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const authenticateJWT = passport.authenticate('jwt', { session: false });

/**
 * Ensure user is logged in
 */
const isAuthenticated = (req, res, next) => {
  authenticateJWT(req, res, (err) => {
    if (err || !req.user) {
      return res.status(401).json({
        status: 'fail',
        message: 'Unauthorized. Please log in to access this resource'
      });
    }
    next();
  });
};

/**
 * Restrict access to specific roles
 * @param  {...string} roles - Roles to allow
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to perform this action'
      });
    }
    next();
  };
};

/**
 * Ensure user is verified
 */
const isVerified = (req, res, next) => {
  if (!req.user.is_verified) {
    return res.status(403).json({
      status: 'fail',
      message: 'Please verify your email address before accessing this resource'
    });
  }
  next();
};

/**
 * Ensure user is not logged in
 */
const isNotAuthenticated = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return next();
  }
  
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return res.status(400).json({
      status: 'fail',
      message: 'You are already logged in'
    });
  } catch (error) {
    next();
  }
};

/**
 * Check if too many login attempts
 */
const checkLoginAttempts = async (req, res, next) => {
  try {
    const { email } = req.body;
    const ipAddress = req.ip;
    
    if (await userModel.tooManyLoginAttempts(email, ipAddress)) {
      return res.status(429).json({
        status: 'fail',
        message: 'Too many login attempts. Please try again later'
      });
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  isAuthenticated,
  restrictTo,
  isVerified,
  isNotAuthenticated,
  checkLoginAttempts
};