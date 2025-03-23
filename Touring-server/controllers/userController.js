const { pool } = require('../config/db');
const { AppError } = require('../middleware/errorHandler');

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
const getProfile = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT u.id, u.username, u.email, u.profile_picture, u.phone_number, 
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
      if (req.body.phone_number) userFields.phone_number = req.body.phone_number;
      if (req.body.profile_picture) userFields.profile_picture = req.body.profile_picture;
      
      // Allowed profile table fields
      const profileFields = {};
      if (req.body.first_name) profileFields.first_name = req.body.first_name;
      if (req.body.last_name) profileFields.last_name = req.body.last_name;
      if (req.body.date_of_birth) profileFields.date_of_birth = req.body.date_of_birth;
      if (req.body.address) profileFields.address = req.body.address;
      if (req.body.city) profileFields.city = req.body.city;
      if (req.body.country) profileFields.country = req.body.country;
      if (req.body.postal_code) profileFields.postal_code = req.body.postal_code;
      
      // Update user table if there are fields to update
      if (Object.keys(userFields).length > 0) {
        const fields = Object.keys(userFields).map(field => `${field} = ?`).join(', ');
        const values = [...Object.values(userFields), req.user.id];
        
        await connection.query(
          `UPDATE users SET ${fields} WHERE id = ?`,
          values
        );
      }
      
      // Update profile table if there are fields to update
      if (Object.keys(profileFields).length > 0) {
        const fields = Object.keys(profileFields).map(field => `${field} = ?`).join(', ');
        const values = [...Object.values(profileFields), req.user.id];
        
        await connection.query(
          `UPDATE user_profiles SET ${fields} WHERE user_id = ?`,
          values
        );
      }
      
      // Get updated profile
      const [rows] = await connection.query(
        `SELECT u.id, u.username, u.email, u.profile_picture, u.phone_number, 
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

/**
 * @desc    Get user wishlist
 * @route   GET /api/users/wishlist
 * @access  Private
 */
const getWishlist = async (req, res, next) => {
  try {
    // TODO: Update this when tours table is implemented
    const [rows] = await pool.query(
      `SELECT w.id as wishlist_id, w.tour_id, w.created_at
      FROM wishlists w
      WHERE w.user_id = ?`,
      [req.user.id]
    );
    
    res.status(200).json({
      status: 'success',
      results: rows.length,
      data: {
        wishlist: rows
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add tour to wishlist
 * @route   POST /api/users/wishlist
 * @access  Private
 */
const addToWishlist = async (req, res, next) => {
  try {
    const { tourId } = req.body;
    
    if (!tourId) {
      return next(new AppError('Tour ID is required', 400));
    }
    
    // Check if already in wishlist
    const [existing] = await pool.query(
      'SELECT id FROM wishlists WHERE user_id = ? AND tour_id = ?',
      [req.user.id, tourId]
    );
    
    if (existing.length > 0) {
      return res.status(200).json({
        status: 'success',
        message: 'Tour is already in wishlist'
      });
    }
    
    // Add to wishlist
    await pool.query(
      'INSERT INTO wishlists (user_id, tour_id) VALUES (?, ?)',
      [req.user.id, tourId]
    );
    
    res.status(201).json({
      status: 'success',
      message: 'Tour added to wishlist'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Remove tour from wishlist
 * @route   DELETE /api/users/wishlist/:tourId
 * @access  Private
 */
const removeFromWishlist = async (req, res, next) => {
  try {
    const { tourId } = req.params;
    
    await pool.query(
      'DELETE FROM wishlists WHERE user_id = ? AND tour_id = ?',
      [req.user.id, tourId]
    );
    
    res.status(200).json({
      status: 'success',
      message: 'Tour removed from wishlist'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getWishlist,
  addToWishlist,
  removeFromWishlist
};