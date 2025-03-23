const { AppError } = require("../middleware/errorHandler");
const userModel = require("../models/userModel");
const authService = require('../services/authService');
const fs = require('fs');
const path = require('path');

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

/**
 * @desc    Get all users
 * @route   GET /api/admin/users
 * @access  Admin
 */
const getAllUsers = async (req, res, next) => {
  try {
    const [rows] = await userModel.getAllUsers();
    
    res.status(200).json({
      status: 'success',
      results: rows.length,
      data: {
        users: rows
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user by ID
 * @route   GET /api/admin/users/:id
 * @access  Admin
 */
const getUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await userModel.findById(userId);
    
    if (!user) {
      return next(new AppError(`No user found with ID: ${userId}`, 404));
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user
 * @route   PATCH /api/admin/users/:id
 * @access  Admin
 */
const updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    
    // Check if user exists
    const userExists = await userModel.findById(userId);
    if (!userExists) {
      return next(new AppError(`No user found with ID: ${userId}`, 404));
    }
    
    // Handle profile picture upload
    const userData = { ...req.body };
    if (req.file) {
      // Delete old profile picture if it exists
      if (userExists.profile_picture) {
        const oldPicturePath = path.join(__dirname, '..', userExists.profile_picture);
        if (fs.existsSync(oldPicturePath)) {
          fs.unlinkSync(oldPicturePath);
        }
      }
      
      // Set the new profile picture path
      userData.profile_picture = `/uploads/profile-pictures/${req.file.filename}`;
    }
    
    // Update user
    const updatedUser = await userModel.updateUserByAdmin(userId, userData);
    
    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete user
 * @route   DELETE /api/admin/users/:id
 * @access  Admin
 */
const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    
    // Check if user exists
    const user = await userModel.findById(userId);
    if (!user) {
      return next(new AppError(`No user found with ID: ${userId}`, 404));
    }
    
    // Delete user's profile picture if exists
    if (user.profile_picture) {
      const picturePath = path.join(__dirname, '..', user.profile_picture);
      if (fs.existsSync(picturePath)) {
        fs.unlinkSync(picturePath);
      }
    }
    
    // Delete user
    await userModel.deleteUser(userId);
    
    // Return 200 OK with success message
    res.status(200).json({
      status: 'success',
      message: 'User has been successfully deleted',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user statistics
 * @route   GET /api/admin/users/stats
 * @access  Admin
 */
const getUserStats = async (req, res, next) => {
  try {
    const stats = await userModel.getUserStats();
    
    res.status(200).json({
      status: 'success',
      data: {
        stats
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAdmin,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserStats
};