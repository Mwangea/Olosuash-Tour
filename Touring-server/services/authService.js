const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/email');
const { AppError } = require('../middleware/errorHandler');

/**
 * Create JWT token
 * @param {number} id - User ID
 * @returns {string} JWT token
 */
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

/**
 * Handle user signup
 * @param {Object} userData - User signup data
 * @param {string} host - Host URL for verification
 * @returns {Object} New user and token
 */
const signup = async (userData, host) => {
  // Check if email already exists
  const existingEmail = await userModel.findByEmail(userData.email);
  if (existingEmail) {
    throw new AppError('Email already in use', 400);
  }

  // Check if username already exists
  const existingUsername = await userModel.findByUsername(userData.username);
  if (existingUsername) {
    throw new AppError('Username already in use', 400);
  }

  // Create new user
  const newUser = await userModel.create({
    username: userData.username,
    email: userData.email,
    password: userData.password,
    auth_provider: 'local'
  });

  // Generate verification URL using frontend route
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${newUser.verification_token}`;

  // Send verification email
  await sendVerificationEmail(newUser, verificationUrl);

  // Create token
  const token = createToken(newUser.id);

  return {
    user: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      profile_picture: newUser.profile_picture,
      auth_provider: newUser.auth_provider,
      is_verified: newUser.is_verified
    },
    token
  };
};

/**
 * Handle user login
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} ipAddress - IP address
 * @param {string} userAgent - User agent
 * @returns {Object} User and token
 */
const login = async (email, password, ipAddress, userAgent) => {
  // Log login attempt
  await userModel.logLoginAttempt(email, ipAddress);

  // Check if user exists & password is correct
  const user = await userModel.validateCredentials(email, password);
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  // Add this check for verification
  if (!user.is_verified) {
    throw new AppError('Please verify your email before logging in', 403);
  }

  // Create token
  const token = createToken(user.id);

  // Create session
  await userModel.createSession(user.id, token, ipAddress, userAgent);

  return {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      profile_picture: user.profile_picture,
      auth_provider: user.auth_provider,
      is_verified: user.is_verified
    },
    token
  };
};

/**
 * Handle social login (Google, Facebook)
 * @param {Object} user - User object from passport
 * @param {string} ipAddress - IP address
 * @param {string} userAgent - User agent
 * @returns {Object} User and token
 */
const socialLogin = async (user, ipAddress, userAgent) => {
  // Create token
  const token = createToken(user.id);

  // Create session
  await userModel.createSession(user.id, token, ipAddress, userAgent);

  return {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      profile_picture: user.profile_picture,
      auth_provider: user.auth_provider,
      is_verified: user.is_verified
    },
    token
  };
};

/**
 * Verify email
 * @param {string} token - Verification token
 * @returns {Object} Verification result
 */
const verifyEmail = async (token) => {
 // console.log('Received verification token:', token); // Log the incoming token
  
  try {
    if (!token || token === "undefined") {
     // console.log('Token is missing or undefined');
      return {
        verified: false,
        redirectUrl: `${process.env.FRONTEND_URL}/verify-email/failed`,
        message: 'Invalid verification token'
      };
    }

    // Verify and update user's email
    const user = await userModel.verifyEmail(token);
    //console.log('User verification result:', user); // Log the user object

    if (!user) {
     // console.log('No user found for this token');
      return {
        verified: false,
        redirectUrl: `${process.env.FRONTEND_URL}/verify-email/failed`,
        message: 'Email verification failed. Token may be invalid or expired.'
      };
    }

    //console.log('Email verification successful for user:', user.email);
    return {
      verified: true,
      redirectUrl: `${process.env.FRONTEND_URL}/verify-email/success`,
      message: 'Email verified successfully'
    };
  } catch (error) {
    //console.error('Email verification error:', error);
    return {
      verified: false,
      redirectUrl: `${process.env.FRONTEND_URL}/verify-email/failed`,
      message: 'An unexpected error occurred during email verification'
    };
  }
};

/**
 * Request password reset
 * @param {string} email - User email
 * @param {string} host - Host URL for reset
 * @returns {boolean} Success status
 */
const forgotPassword = async (email, host) => {
  try {
    // Generate reset token
    const resetToken = await userModel.createPasswordResetToken(email);

    // Get user
    const user = await userModel.findByEmail(email);

    // Generate reset URL using frontend route
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Send password reset email
    await sendPasswordResetEmail(user, resetUrl);

    return true;
  } catch (error) {
    // If there's an error, we don't want to expose whether the email exists
    console.error('Forgot password error:', error);
    return true;
  }
};

/**
 * Reset password with token
 * @param {string} token - Reset token
 * @param {string} password - New password
 * @returns {boolean} Success status
 */
const resetPassword = async (token, password) => {
  const success = await userModel.resetPassword(token, password);
  if (!success) {
    throw new AppError('Invalid or expired reset token', 400);
  }
  return true;
};

module.exports = {
  signup,
  login,
  socialLogin,
  verifyEmail,
  forgotPassword,
  resetPassword,
  createToken
};