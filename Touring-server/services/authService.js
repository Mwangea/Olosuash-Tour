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

  // Generate verification URL
  const verificationUrl = `${host}/api/auth/verify-email/${newUser.verification_token}`;

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
 * Verify user email
 * @param {string} token - Verification token
 * @returns {boolean} Success status
 */
const verifyEmail = async (token) => {
  const success = await userModel.verifyEmail(token);
  if (!success) {
    throw new AppError('Invalid or expired verification token', 400);
  }
  return true;
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

    // Generate reset URL
    const resetUrl = `${host}/reset-password?token=${resetToken}`;

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
  resetPassword
};