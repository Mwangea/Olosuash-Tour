const { pool } = require('../config/db');
const { AppError } = require('../middleware/errorHandler');
const userModel = require('../models/userModel');
const fs = require('fs');
const path = require('path');

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
const getProfile = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT u.id, u.username, u.email, u.profile_picture, u.phone_number, u.role, u.is_verified, u.created_at,
        p.first_name, p.last_name, p.date_of_birth, p.address, p.city, p.country, p.postal_code
      FROM users u
      LEFT JOIN user_profiles p ON u.id = p.user_id
      WHERE u.id = ?`,
      [req.user.id]
    );
    
    if (!rows.length) {
      return next(new AppError('User not found', 404));
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        profile: rows[0]
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile
 * @route   PATCH /api/users/profile
 * @access  Private
 */
const updateProfile = async (req, res, next) => {
  try {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Allowed user table fields
      const userFields = {};
      if (req.body.username) userFields.username = req.body.username;
      if (req.body.email) userFields.email = req.body.email;
      if (req.body.phone_number) userFields.phone_number = req.body.phone_number;
      
      // Handle profile picture upload
      if (req.file) {
        // Get current user to check if they have an existing profile picture
        const [currentUser] = await connection.query(
          'SELECT profile_picture FROM users WHERE id = ?',
          [req.user.id]
        );
        
        // Delete old profile picture if it exists
        if (currentUser[0].profile_picture) {
          const oldPicturePath = path.join(__dirname, '..', currentUser[0].profile_picture);
          if (fs.existsSync(oldPicturePath)) {
            fs.unlinkSync(oldPicturePath);
          }
        }
        
        // Set the new profile picture path
        userFields.profile_picture = `/uploads/profile-pictures/${req.file.filename}`;
      }
      
      // Allowed profile table fields
      const profileFields = {};
      if (req.body.first_name !== undefined) profileFields.first_name = req.body.first_name;
      if (req.body.last_name !== undefined) profileFields.last_name = req.body.last_name;
      if (req.body.date_of_birth !== undefined) profileFields.date_of_birth = req.body.date_of_birth;
      if (req.body.address !== undefined) profileFields.address = req.body.address;
      if (req.body.city !== undefined) profileFields.city = req.body.city;
      if (req.body.country !== undefined) profileFields.country = req.body.country;
      if (req.body.postal_code !== undefined) profileFields.postal_code = req.body.postal_code;
      
      // Update user table if there are fields to update
      if (Object.keys(userFields).length > 0) {
        // Check if username or email already exists (if being updated)
        if (userFields.username) {
          const existingUser = await userModel.findByUsername(userFields.username);
          if (existingUser && existingUser.id !== req.user.id) {
            return next(new AppError(`Username ${userFields.username} is already taken`, 400));
          }
        }
        
        if (userFields.email) {
          const existingEmail = await userModel.findByEmail(userFields.email);
          if (existingEmail && existingEmail.id !== req.user.id) {
            return next(new AppError(`Email ${userFields.email} is already in use`, 400));
          }
        }
        
        const fields = Object.keys(userFields).map(field => `${field} = ?`).join(', ');
        const values = [...Object.values(userFields), req.user.id];
        
        await connection.query(
          `UPDATE users SET ${fields} WHERE id = ?`,
          values
        );
      }
      
      // Update profile table if there are fields to update
      if (Object.keys(profileFields).length > 0) {
        // First, check if the user_profile row exists
        const [profileExists] = await connection.query(
          'SELECT COUNT(*) as count FROM user_profiles WHERE user_id = ?',
          [req.user.id]
        );
        
        if (profileExists[0].count === 0) {
          // If profile doesn't exist, create one with provided fields
          const fields = ['user_id', ...Object.keys(profileFields)];
          const placeholders = fields.map(() => '?').join(', ');
          const values = [req.user.id, ...Object.values(profileFields)];
          
          await connection.query(
            `INSERT INTO user_profiles (${fields.join(', ')}) VALUES (${placeholders})`,
            values
          );
        } else {
          // If profile exists, update it
          const fields = Object.keys(profileFields).map(field => `${field} = ?`).join(', ');
          const values = [...Object.values(profileFields), req.user.id];
          
          await connection.query(
            `UPDATE user_profiles SET ${fields} WHERE user_id = ?`,
            values
          );
        }
      }
      
      // Get updated profile
      const [rows] = await connection.query(
        `SELECT u.id, u.username, u.email, u.profile_picture, u.phone_number, u.role, u.is_verified, u.created_at,
          p.first_name, p.last_name, p.date_of_birth, p.address, p.city, p.country, p.postal_code
        FROM users u
        LEFT JOIN user_profiles p ON u.id = p.user_id
        WHERE u.id = ?`,
        [req.user.id]
      );
      
      await connection.commit();
      
      res.status(200).json({
        status: 'success',
        data: {
          profile: rows[0]
        }
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile
};