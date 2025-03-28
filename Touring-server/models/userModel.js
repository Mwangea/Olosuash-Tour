const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');



const userModel = {
    /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Newly created user
   */

    async create(userData) {
      const connection = await pool.getConnection();
      
      try {
        await connection.beginTransaction();
  
        // Hash password if provided
        if (userData.password) {
          userData.password = await bcrypt.hash(userData.password, 12);
        }
  
        // Generate verification token and expiration (24 hours) for new unverified users
        if (!userData.is_verified) {
          userData.verification_token = crypto.randomBytes(32).toString('hex');
          userData.verification_token_expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        }
  
        // Execute insert query with all fields
        const [result] = await connection.query(
          `INSERT INTO users (
            username, email, password, profile_picture, phone_number, 
            auth_provider, auth_provider_id, verification_token, 
            verification_token_expires, is_verified, role
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            userData.username,
            userData.email,
            userData.password || null,
            userData.profile_picture || null,
            userData.phone_number || null,
            userData.auth_provider || 'local',
            userData.auth_provider_id || null,
            userData.verification_token || null,
            userData.verification_token_expires || null,
            userData.is_verified || false,
            userData.role || 'user'
          ]
        );
        
        const userId = result.insertId;
        
        // Create user profile
        await connection.query(
          'INSERT INTO user_profiles (user_id) VALUES (?)',
          [userId]
        );
        
        // Get the created user
        const [users] = await connection.query(
          `SELECT 
            id, username, email, profile_picture, role, 
            auth_provider, is_verified, verification_token, 
            verification_token_expires, created_at 
          FROM users WHERE id = ?`,
          [userId]
        );
        
        await connection.commit();
        return users[0];
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    },
  
  /**
   * Find user by ID
   * @param {number} id - User ID
   * @returns {Promise<Object>} User object
   */
  async findById(id) {
    const [rows] = await pool.query(
      `SELECT u.id, u.username, u.email, u.profile_picture, u.role, u.auth_provider, u.is_verified, u.created_at,
       p.first_name, p.last_name
       FROM users u
       LEFT JOIN user_profiles p ON u.id = p.user_id
       WHERE u.id = ?`,
      [id]
    );
    
    return rows[0] || null;
  },
  
  /**
   * Find user by email
   * @param {string} email - User email
   * @returns {Promise<Object>} User object
   */
  async findByEmail(email) {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    return rows[0] || null;
  },
  
  /**
   * Find user by username
   * @param {string} username - Username
   * @returns {Promise<Object>} User object
   */
  async findByUsername(username) {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    
    return rows[0] || null;
  },
  
  /**
   * Update user authentication provider
   * @param {number} userId - User ID
   * @param {string} provider - Auth provider (google, facebook)
   * @param {string} providerId - Provider ID
   * @returns {Promise<Object>} Updated user object
   */
  async updateAuthProvider(userId, provider, providerId) {
    await pool.query(
      'UPDATE users SET auth_provider = ?, auth_provider_id = ? WHERE id = ?',
      [provider, providerId, userId]
    );
    
    return this.findById(userId);
  },
  
/**
   * Verify email using verification token
   * @param {string} token - Verification token
   * @returns {Object|null} Verified user or null
   */
async verifyEmail(token) {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    console.log(`Attempting to verify token: ${token}`);

    // Simplified query without separate NOW() check
    const [tokenRows] = await connection.query(
      `SELECT id, email, is_verified 
       FROM users 
       WHERE verification_token = ? 
         AND (verification_token_expires > NOW() OR verification_token_expires IS NULL)`,
      [token]
    );

    if (!tokenRows.length) {
      console.log('No valid token found');
      await connection.rollback();
      return null;
    }

    const user = tokenRows[0];

    if (user.is_verified) {
      console.log('User already verified');
      await connection.rollback();
      return null;
    }

    await connection.query(
      `UPDATE users 
       SET is_verified = TRUE, 
           verification_token = NULL, 
           verification_token_expires = NULL 
       WHERE id = ?`,
      [user.id]
    );

    await connection.commit();
    console.log(`Successfully verified user ${user.email}`);
    return { id: user.id, email: user.email };
    
  } catch (error) {
    await connection.rollback();
    console.error('Verification failed:', error);
    return null;
  } finally {
    connection.release();
  }
},

/**
 * Create verification token for user
 * @param {number} userId - User ID
 * @returns {string} Verification token
 */
async createVerificationToken(userId) {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await connection.query(
      `UPDATE users 
      SET 
        verification_token = ?,
        verification_token_expires = ?,
        is_verified = FALSE
      WHERE id = ?`,
      [verificationToken, expiresAt, userId]
    );

    await connection.commit();
    return verificationToken;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
},
  
  /**
   * Generate password reset token
   * @param {string} email - User email
   * @returns {Promise<string>} Reset token
   */
  async createPasswordResetToken(email) {
    const user = await this.findByEmail(email);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    
    // Token expires in 10 minutes
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    
    await pool.query(
      'UPDATE users SET reset_password_token = ?, reset_token_expires = ? WHERE id = ?',
      [resetTokenHash, expiresAt, user.id]
    );
    
    return resetToken;
  },
  
  /**
   * Reset password with token
   * @param {string} token - Reset token
   * @param {string} newPassword - New password
   * @returns {Promise<boolean>} Success status
   */
  async resetPassword(token, newPassword) {
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
    
    const [rows] = await pool.query(
      'SELECT id FROM users WHERE reset_password_token = ? AND reset_token_expires > NOW()',
      [hashedToken]
    );
    
    if (!rows.length) {
      return false;
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    await pool.query(
      'UPDATE users SET password = ?, reset_password_token = NULL, reset_token_expires = NULL WHERE id = ?',
      [hashedPassword, rows[0].id]
    );
    
    return true;
  },
  
  /**
   * Check if login credentials are valid
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} User object if valid
   */
  async validateCredentials(email, password) {
    const user = await this.findByEmail(email);
    
    if (!user || !user.password) {
      return null;
    }
    
    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) {
      return null;
    }
    
    return user;
  },
  
  /**
   * Create a user session
   * @param {number} userId - User ID
   * @param {string} token - JWT token
   * @param {string} ipAddress - IP address
   * @param {string} userAgent - User agent
   * @returns {Promise<Object>} Session object
   */
  async createSession(userId, token, ipAddress, userAgent) {
    // Token expires in 7 days or as per JWT_EXPIRES_IN
    const expiresAt = new Date(
      Date.now() + parseInt(process.env.JWT_EXPIRES_IN) * 24 * 60 * 60 * 1000
    );
    
    const [result] = await pool.query(
      'INSERT INTO sessions (user_id, token, ip_address, user_agent, expires_at) VALUES (?, ?, ?, ?, ?)',
      [userId, token, ipAddress, userAgent, expiresAt]
    );
    
    return {
      id: result.insertId,
      userId,
      token,
      expiresAt
    };
  },
  
  /**
   * Log login attempt
   * @param {string} email - Email attempted
   * @param {string} ipAddress - IP address
   * @returns {Promise<void>}
   */
  async logLoginAttempt(email, ipAddress) {
    await pool.query(
      'INSERT INTO login_attempts (email, ip_address) VALUES (?, ?)',
      [email, ipAddress]
    );
  },
  
  /**
   * Check if user has too many login attempts
   * @param {string} email - User email
   * @param {string} ipAddress - IP address
   * @returns {Promise<boolean>} True if too many attempts
   */
  async tooManyLoginAttempts(email, ipAddress) {
    // Check if there are more than 5 attempts in the last 15 minutes
    const [rows] = await pool.query(
      'SELECT COUNT(*) as count FROM login_attempts WHERE (email = ? OR ip_address = ?) AND attempt_time > DATE_SUB(NOW(), INTERVAL 15 MINUTE)',
      [email, ipAddress]
    );
    
    return rows[0].count >= 5;
  },

   /**
   * Check if admin exists
   * @returns {Promise<boolean>} True if admin exists
   */
  async adminExists(){
    const [rows] = await pool.query(
        'SELECT COUNT(*) as count FROM users WHERE role = ?',
        ['admin']
    );
    return rows[0].count > 0;
  },


  /**
   * Create admin account
   * @param {Object} adminData - Admin data
   * @param {string} secretKey - Admin creation secret key
   * @returns {Promise<Object>} Created admin user
   */
  async createAdmin(adminData, secretKey) {
    // Check if secret key matches
    if (secretKey !== process.env.ADMIN_SECRET_KEY) {
      throw new Error('Invalid admin secret key');
    }
  
    // Check if admin already exists
    if (await this.adminExists()) {
      throw new Error('Admin account already exists');
    }
  
    // Check if username exists
    const existingUser = await this.findByUsername(adminData.username);
    if (existingUser) {
      throw new Error(`Username ${adminData.username} is already taken`);
    }
  
    // Check if email exists
    const existingEmail = await this.findByEmail(adminData.email);
    if (existingEmail) {
      throw new Error(`Email ${adminData.email} is already in use`);
    }
  
    // Create admin user with explicit role
    const adminUser = await this.create({
      ...adminData,
      role: 'admin',
      is_verified: true // Auto-verify admin
    });
  
    return adminUser;
  },

  /**
   * Get all users (for admin)
   * @returns {Promise<Array>} Array of users
   */


  async getAllUsers(){
    return pool.query(
      `SELECT id, username, email, phone_number, profile_picture, role, is_verified, created_at 
       FROM users
       WHERE role = 'user'
       ORDER BY created_at DESC`
    );
  },

  /**
   * Get user statistics
   * @returns {Promise<Object>} User statistics
   */

  async getUserStats(){
    // Get total users count
    const [totalUsers] = await pool.query(
      'SELECT COUNT(*) as count FROM users'
    );

    // Get user count by role
    const [usersByRole] = await pool.query(
      `SELECT role, COUNT(*) as count 
       FROM users 
       GROUP BY role`
    );

    // Get verified vs unverified user count
    const [verificationStatus] = await pool.query(
      `SELECT is_verified, COUNT(*) as count 
       FROM users 
       GROUP BY is_verified`
    );

    // Get users by registration month (for current year)
    const [usersByMonth] = await pool.query(
      `SELECT MONTH(created_at) as month, COUNT(*) as count 
       FROM users 
       WHERE YEAR(created_at) = YEAR(CURDATE())
       GROUP BY MONTH(created_at)
       ORDER BY month`
    );

    return {
      totalUsers: totalUsers[0].count,
      usersByRole,
      verificationStatus,
      usersByMonth
    };
  },
  /**
   * Update user by admin
   * @param {number} userId - User ID
   * @param {Object} userData - User data to update
   * @returns {Promise<Object>} Updated user
   */
  async updateUserByAdmin(userId, userData) {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    // Fields that admin can update in users table
    const userFields = {};
    if (userData.username !== undefined) userFields.username = userData.username;
    if (userData.email !== undefined) userFields.email = userData.email;
    if (userData.phone_number !== undefined) userFields.phone_number = userData.phone_number;
    if (userData.profile_picture !== undefined) userFields.profile_picture = userData.profile_picture;
    if (userData.role !== undefined) userFields.role = userData.role;
    if (userData.is_verified !== undefined) userFields.is_verified = userData.is_verified;
    
    // Fields that admin can update in user_profiles table
    const profileFields = {};
    if (userData.first_name !== undefined) profileFields.first_name = userData.first_name;
    if (userData.last_name !== undefined) profileFields.last_name = userData.last_name;
    if (userData.date_of_birth !== undefined) profileFields.date_of_birth = userData.date_of_birth;
    if (userData.address !== undefined) profileFields.address = userData.address;
    if (userData.city !== undefined) profileFields.city = userData.city;
    if (userData.country !== undefined) profileFields.country = userData.country;
    if (userData.postal_code !== undefined) profileFields.postal_code = userData.postal_code;
    
    // Check if username or email already exists (if being updated)
    if (userFields.username) {
      const existingUser = await this.findByUsername(userFields.username);
      if (existingUser && existingUser.id !== parseInt(userId)) {
        throw new Error(`Username ${userFields.username} is already taken`);
      }
    }
    
    if (userFields.email) {
      const existingEmail = await this.findByEmail(userFields.email);
      if (existingEmail && existingEmail.id !== parseInt(userId)) {
        throw new Error(`Email ${userFields.email} is already in use`);
      }
    }
    
    // Update users table if there are fields to update
    if (Object.keys(userFields).length > 0) {
      const fields = Object.keys(userFields).map(field => `${field} = ?`).join(', ');
      const values = [...Object.values(userFields), userId];
      
      await connection.query(
        `UPDATE users SET ${fields} WHERE id = ?`,
        values
      );
    }
    
    // Update user_profiles table if there are fields to update
    if (Object.keys(profileFields).length > 0) {
      // Check if the profile exists first
      const [profileExists] = await connection.query(
        'SELECT COUNT(*) as count FROM user_profiles WHERE user_id = ?',
        [userId]
      );
      
      if (profileExists[0].count === 0) {
        // If profile doesn't exist, create one with provided fields
        const fields = ['user_id', ...Object.keys(profileFields)];
        const placeholders = fields.map(() => '?').join(', ');
        const values = [userId, ...Object.values(profileFields)];
        
        await connection.query(
          `INSERT INTO user_profiles (${fields.join(', ')}) VALUES (${placeholders})`,
          values
        );
      } else {
        // If profile exists, update it
        const fields = Object.keys(profileFields).map(field => `${field} = ?`).join(', ');
        const values = [...Object.values(profileFields), userId];
        
        await connection.query(
          `UPDATE user_profiles SET ${fields} WHERE user_id = ?`,
          values
        );
      }
    }
    
    await connection.commit();
    
    // Get updated user with full profile information
    const [rows] = await connection.query(
      `SELECT u.id, u.username, u.email, u.profile_picture, u.phone_number, u.role, u.is_verified, u.created_at,
       p.first_name, p.last_name, p.date_of_birth, p.address, p.city, p.country, p.postal_code
       FROM users u
       LEFT JOIN user_profiles p ON u.id = p.user_id
       WHERE u.id = ?`,
      [userId]
    );
    
    return rows[0];
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
},

  /**
   * Delete user
   * @param {number} userId - User ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteUser(userId) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Delete sessions
      await connection.query(
        'DELETE FROM sessions WHERE user_id = ?',
        [userId]
      );
      
      // Delete login attempts
      await connection.query(
        'DELETE FROM login_attempts WHERE email IN (SELECT email FROM users WHERE id = ?)',
        [userId]
      );
      
      // Delete user profile
      await connection.query(
        'DELETE FROM user_profiles WHERE user_id = ?',
        [userId]
      );
      
      // Delete user
      await connection.query(
        'DELETE FROM users WHERE id = ?',
        [userId]
      );
      
      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },


};

module.exports = userModel;