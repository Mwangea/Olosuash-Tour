const { AppError } = require("../middleware/errorHandler");
const userModel = require("../models/userModel");
const authService = require('../services/authService');

/**
 * @desc    Create admin account
 * @route   POST /api/admin/create
 * @access  Public (but protected by secret key)
 */
const createAdmin = async (req, res, next) => {
  try {
    const { username, email, password, secretKey } = req.body;

    // Create admin
    const admin = await userModel.createAdmin(
      { username, email, password },
      secretKey
    );

    // Generate token
    const token = authService.createToken(admin.id);

    res.status(201).json({
      status: 'success',
      message: 'Admin account created successfully',
      data: {
        user: {
          id: admin.id,
          username: admin.username,
          email: admin.email,
          role: admin.role
        },
        token
      }
    });
  } catch (error) {
    // Handle specific error cases
    if (error.message === "Invalid admin secret key") {
      return next(new AppError("Invalid admin secret key", 401));
    }
    if (error.message === "Admin account already exists") {
      return next(new AppError("Admin account already exists", 400));
    }
    if (error.message.includes("Username") && error.message.includes("already taken")) {
      return next(new AppError(error.message, 400));
    }
    if (error.message.includes("Email") && error.message.includes("already in use")) {
      return next(new AppError(error.message, 400));
    }
    if (error.code === 'ER_DUP_ENTRY') {
      return next(new AppError("Duplicate entry detected. Please try a different username or email.", 400));
    }
    
    // For any other errors
    next(error);
  }
};

module.exports = {
  createAdmin
};